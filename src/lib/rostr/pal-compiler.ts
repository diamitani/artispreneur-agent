/**
 * PAL Roster Agent — compiler core
 *
 * Runs ROSTR PAL stages L1→L5 on every new-user intake.
 * Deterministic first (schema + Soul + roster). Optional LLM enrichment later.
 */

import { specialistsForSurfaces, type Specialist } from "./specialists";
import { ONBOARDING_STEPS, type Mode } from "./onboarding-questions";

export type IntakeAnswers = Record<string, string | string[] | undefined>;

export type PalIntent = {
  primary_intent: string;
  domain: "music_business";
  subject: string;
  mode: Mode;
  constraints: string[];
  desired_output: string;
  urgency: "immediate";
  ambiguity_score: number;
  gaps: string[];
};

export type NpaoTask = {
  id: string;
  title: string;
  npao: "N" | "A" | "P" | "O";
  phase: "PreD" | "Design" | "Development" | "Deployment" | "Debugging";
  agent: string;
  reason: string;
};

export type WorkspaceConfig = {
  artist_id: string;
  mode: Mode;
  completeness: number;
  artist_profile: Record<string, unknown>;
  brand: Record<string, unknown>;
  goals: Record<string, unknown>;
  permissions: { default_mode: string };
  release_plan: Record<string, unknown>;
  roster: { active: Specialist[]; deferred: Specialist[] };
  links: string[];
};

export type PalCompilationResult = {
  agent: "pal-roster";
  version: "2.0";
  compiled_at: string;
  user_id: string;
  intent: PalIntent;
  workspace_config: WorkspaceConfig;
  master_soul_md: string;
  brand_prompts: string[];
  npao_plan: NpaoTask[];
  next_actions: string[];
  artifacts: {
    path: string;
    kind: string;
    summary: string;
  }[];
};

function str(v: string | string[] | undefined, fallback = ""): string {
  if (Array.isArray(v)) return v.join(", ");
  return (v ?? fallback).toString().trim();
}

function arr(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v.map((x) => x.trim()).filter(Boolean);
  if (!v) return [];
  return v
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48) || "artist"
  );
}

function requiredGaps(answers: IntakeAnswers): string[] {
  const gaps: string[] = [];
  for (const step of ONBOARDING_STEPS) {
    for (const field of step.fields) {
      if (!field.required) continue;
      const val = answers[field.id];
      const empty =
        val === undefined ||
        val === null ||
        (typeof val === "string" && !val.trim()) ||
        (Array.isArray(val) && val.length === 0);
      if (empty) gaps.push(field.id);
    }
  }
  return gaps;
}

function completenessScore(answers: IntakeAnswers): number {
  const all = ONBOARDING_STEPS.flatMap((s) => s.fields);
  const required = all.filter((f) => f.required);
  const optional = all.filter((f) => !f.required);
  let score = 0;
  const reqWeight = 70;
  const optWeight = 30;
  const reqHit = required.filter((f) => {
    const v = answers[f.id];
    return Array.isArray(v) ? v.length > 0 : Boolean(str(v));
  }).length;
  const optHit = optional.filter((f) => {
    const v = answers[f.id];
    return Array.isArray(v) ? v.length > 0 : Boolean(str(v));
  }).length;
  score += (reqHit / Math.max(required.length, 1)) * reqWeight;
  score += (optHit / Math.max(optional.length, 1)) * optWeight;
  return Math.round(score);
}

function goalToTasks(goal: string, stageName: string): NpaoTask[] {
  const base: NpaoTask[] = [
    {
      id: "n1",
      title: "Lock Master Soul.md and approval policy",
      npao: "N",
      phase: "PreD",
      agent: "Master Agent",
      reason: "Every specialist depends on shared artist context",
    },
    {
      id: "n2",
      title: "Inventory rights, splits, and key assets",
      npao: "N",
      phase: "PreD",
      agent: "Contracts & Business",
      reason: "Commercial actions blocked without rights hygiene",
    },
  ];

  const byGoal: Record<string, NpaoTask[]> = {
    release: [
      {
        id: "p1",
        title: `Build 42-day release plan for ${stageName}`,
        npao: "P",
        phase: "Design",
        agent: "Release & Distribution",
        reason: "Primary 90-day goal is a coordinated release",
      },
      {
        id: "p2",
        title: "Draft EPK + pitch metadata packet",
        npao: "P",
        phase: "Development",
        agent: "Brand & EPK",
        reason: "Release campaigns need press-ready assets",
      },
    ],
    rights: [
      {
        id: "p1",
        title: "Run rights completeness check on catalog",
        npao: "N",
        phase: "Development",
        agent: "Contracts & Business",
        reason: "Primary goal is clean ownership and PRO path",
      },
    ],
    booking: [
      {
        id: "p1",
        title: "Package booking kit (EPK + tech rider + availability)",
        npao: "P",
        phase: "Development",
        agent: "Booking Manager",
        reason: "Primary goal is paid performances",
      },
    ],
    press: [
      {
        id: "p1",
        title: "Build target list + first pitch drafts (approval queue)",
        npao: "P",
        phase: "Development",
        agent: "Press & Outreach",
        reason: "Primary goal is press / playlist / radio",
      },
    ],
    brand: [
      {
        id: "p1",
        title: "Produce EPK v1 with short/medium/long bios",
        npao: "P",
        phase: "Development",
        agent: "Brand & EPK",
        reason: "Primary goal is brand and story lock",
      },
    ],
    money: [
      {
        id: "p1",
        title: "Map revenue channels + simple Q budget",
        npao: "P",
        phase: "Design",
        agent: "Finance Manager",
        reason: "Primary goal is a new revenue channel",
      },
    ],
    ops: [
      {
        id: "p1",
        title: "Guided business setup checklist (entity, banking, PRO)",
        npao: "N",
        phase: "Development",
        agent: "Contracts & Business",
        reason: "Primary goal is operating foundation",
      },
    ],
  };

  return [...base, ...(byGoal[goal] ?? byGoal.release)];
}

function buildMasterSoul(cfg: WorkspaceConfig, intent: PalIntent, answers: IntakeAnswers): string {
  const p = cfg.artist_profile as {
    stage_name: string;
    legal_name: string;
    location: string;
    genres: string[];
    career_stage: string;
  };
  const brand = cfg.brand as {
    voice_words: string;
    bio_short: string;
    do_not: string;
  };
  const goals = cfg.goals as { primary_90d: string; success_metric: string };
  const rosterNames = cfg.roster.active.map((s) => s.name).join(", ");

  return `# Master Soul.md — ${p.stage_name}

> Compiled by PAL Roster Agent · Agent by Artispreneur · ROSTR PAL L1–L5  
> Completeness: ${cfg.completeness}% · Mode: ${cfg.mode} · Approval: ${cfg.permissions.default_mode}

## 1. Identity

- **Stage name:** ${p.stage_name}
- **Legal name:** ${p.legal_name}
- **Location:** ${p.location}
- **Genres:** ${p.genres.join(", ") || "TBD"}
- **Career stage:** ${p.career_stage}
- **Workspace mode:** ${cfg.mode}

## 2. Mission (compiled intent)

${intent.primary_intent}

**Desired outcome (90 days):** ${goals.success_metric || goals.primary_90d}

## 3. Brand voice

- **Voice:** ${brand.voice_words || "professional, direct, no fluff"}
- **Bio (short):**  
${brand.bio_short || "_Draft pending — Brand & EPK will generate from profile._"}

### Do not
${brand.do_not || "- No hype or overpromises\n- No outbound send without approval"}

## 4. Permission policy

Default mode: **${cfg.permissions.default_mode}**

- Agents may research, draft, and organize freely.
- Rights-affecting, financial, outbound, and publishing actions require named human approval.
- Never invent ownership, splits, or clearances.

## 5. Active specialist roster

${cfg.roster.active.map((s) => `- **${s.name}** — ${s.role}: ${s.blurb}`).join("\n")}

${
  cfg.roster.deferred.length
    ? `\n### Deferred (activate later)\n${cfg.roster.deferred.map((s) => `- ${s.name}`).join("\n")}`
    : ""
}

Master Agent routes plain-language requests to: ${rosterNames}.

## 6. Constraints (PAL)

${intent.constraints.map((c) => `- ${c}`).join("\n") || "- None listed"}

## 7. Known gaps

${
  intent.gaps.length
    ? intent.gaps.map((g) => `- Missing field: \`${g}\``).join("\n")
    : "- No required-field gaps"
}

## 8. Links & context

${cfg.links.length ? cfg.links.map((l) => `- ${l}`).join("\n") : "- None provided"}

${str(answers.open_prompt) ? `\n## 9. Founder notes\n\n${str(answers.open_prompt)}\n` : ""}

---

*This file is the source of truth for Hermes-style daily chat and Rostr specialist handoffs. Recompile via \`POST /api/pal/intake\` when goals materially change.*
`;
}

/**
 * Compile intake answers into workspace config + Master Soul + NPAO plan.
 * This is the PAL Roster Agent's core job.
 */
export function compilePalIntake(input: {
  userId?: string;
  answers: IntakeAnswers;
}): PalCompilationResult {
  const answers = input.answers;
  const stageName = str(answers.stage_name, "Artist");
  const legalName = str(answers.legal_name, stageName);
  const mode = (str(answers.mode, "artist") as Mode) || "artist";
  const genres = arr(answers.genres);
  const surfaces = arr(answers.priority_surfaces);
  const active = specialistsForSurfaces(surfaces);
  const deferred = specialistsForSurfaces(
    ["epk_brand", "contracts", "release", "content", "press", "booking", "finance"].filter(
      (s) => !surfaces.includes(s),
    ),
  ).filter((s) => !active.some((a) => a.id === s.id));

  const gaps = requiredGaps(answers);
  const completeness = completenessScore(answers);
  const ambiguity = Math.min(1, gaps.length * 0.12 + (str(answers.bio_short) ? 0 : 0.08));

  const primaryGoal = str(answers.primary_goal_90d, "brand");
  const success = str(answers.success_metric, `Make meaningful progress for ${stageName} in 90 days`);

  const intent: PalIntent = {
    primary_intent: `Operate a personalized Artispreneur workspace for ${stageName} (${mode}) focused on ${primaryGoal.replace(/_/g, " ")}`,
    domain: "music_business",
    subject: stageName,
    mode,
    constraints: [
      str(answers.do_not) || "No outbound or rights actions without approval",
      `Approval policy: ${str(answers.approval_policy, "approval_required")}`,
      "Do not promise editorial, sync, or streaming outcomes",
    ].filter(Boolean),
    desired_output: success,
    urgency: "immediate",
    ambiguity_score: Number(ambiguity.toFixed(2)),
    gaps,
  };

  const artistId = `artispreneur-${slugify(stageName)}`;
  const links = arr(answers.links).filter((l) => l.startsWith("http"));

  const workspace_config: WorkspaceConfig = {
    artist_id: artistId,
    mode,
    completeness,
    artist_profile: {
      legal_name: legalName,
      stage_name: stageName,
      location: str(answers.location),
      genres,
      career_stage: str(answers.career_stage, "emerging"),
      reach: { monthly_listeners: str(answers.monthly_listeners, "unknown") },
      links,
    },
    brand: {
      voice_words: str(answers.voice_words),
      bio_short: str(answers.bio_short),
      do_not: str(answers.do_not),
    },
    goals: {
      primary_90d: primaryGoal,
      success_metric: success,
    },
    permissions: {
      default_mode: str(answers.approval_policy, "approval_required"),
    },
    release_plan: {
      next: str(answers.next_release),
    },
    roster: { active, deferred },
    links,
  };

  const master_soul_md = buildMasterSoul(workspace_config, intent, answers);
  const npao_plan = goalToTasks(primaryGoal, stageName);

  const brand_prompts = [
    `Write a 50-word short bio for ${stageName}, ${str(answers.location)}, genres: ${genres.join(", ")}. Voice: ${str(answers.voice_words)}. No hype.`,
    `Draft EPK one-pager outline for ${stageName} aimed at ${primaryGoal.replace(/_/g, " ")}.`,
    `List 5 brand do/don't rules from: ${str(answers.do_not) || "approval-first, no overpromises"}.`,
  ];

  return {
    agent: "pal-roster",
    version: "2.0",
    compiled_at: new Date().toISOString(),
    user_id: input.userId || artistId,
    intent,
    workspace_config,
    master_soul_md,
    brand_prompts,
    npao_plan,
    next_actions: [
      "Review Master Soul.md in Knowledge Vault",
      "Confirm active specialist roster",
      ...npao_plan.slice(0, 3).map((t) => t.title),
      completeness < 85 ? "Finish missing onboarding fields to raise completeness" : "Start Master Agent chat with your 90-day goal",
    ],
    artifacts: [
      {
        path: `00-config/master-soul.md`,
        kind: "soul",
        summary: `Master Soul for ${stageName} (${completeness}% complete)`,
      },
      {
        path: `00-config/artist-profile.json`,
        kind: "profile",
        summary: "Normalized artist profile for all agents",
      },
      {
        path: `00-config/permissions.yaml`,
        kind: "permissions",
        summary: `Default mode: ${workspace_config.permissions.default_mode}`,
      },
      {
        path: `03-agent-workflows/npao-plan.json`,
        kind: "plan",
        summary: `${npao_plan.length} prioritized tasks (N→A→P→O)`,
      },
    ],
  };
}
