import type { OnboardingIntake, SoulMd } from "@/types/onboarding";
import type { NpaoPhase } from "@/types/task";
import { SPECIALISTS } from "@/lib/constants";

/**
 * Deterministic PAL Compiler.
 * Transforms OnboardingIntake into a SoulMd object and its markdown representation.
 * No LLM calls — purely template-based compilation.
 */
export function compileSoulMd(intake: OnboardingIntake): {
  soulMd: SoulMd;
  markdown: string;
} {
  const tone = deriveTone(intake.brandAdjectives);
  const audience = intake.targetAudience || "general music fans";
  const mission = generateMission(intake);
  const resources = buildResources(intake);
  const roster = selectSpecialists(intake);

  const soulMd: SoulMd = {
    identity: {
      name: intake.artistName,
      mode: intake.mode,
      genre: intake.genre,
      stage: intake.careerStage,
    },
    mission,
    voice: {
      tone,
      style: intake.communicationStyle,
      audience,
    },
    permissions: {
      canSend: false,
      canPublish: false,
      canSpend: false,
      approvalRequired: [
        "email outreach",
        "social media posts",
        "financial transactions",
        "public content",
      ],
    },
    context: {
      goals: intake.primaryGoals,
      challenges: intake.currentChallenges,
      resources,
    },
    roster,
  };

  const markdown = renderMarkdown(soulMd, intake);

  return { soulMd, markdown };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function deriveTone(adjectives: string[]): string {
  if (adjectives.length === 0) return "professional and approachable";

  const lower = adjectives.map((a) => a.toLowerCase());

  if (lower.includes("bold") || lower.includes("rebellious") || lower.includes("raw")) {
    return "direct and bold";
  }
  if (lower.includes("refined") || lower.includes("luxurious") || lower.includes("classic")) {
    return "polished and sophisticated";
  }
  if (lower.includes("playful") || lower.includes("warm") || lower.includes("uplifting")) {
    return "warm and conversational";
  }
  if (lower.includes("mysterious") || lower.includes("dark") || lower.includes("underground")) {
    return "understated and enigmatic";
  }
  if (lower.includes("innovative") || lower.includes("futuristic") || lower.includes("minimalist")) {
    return "forward-thinking and concise";
  }

  // Fallback: join first two adjectives
  return `${lower[0]} and ${lower[1] ?? "authentic"}`;
}

function generateMission(intake: OnboardingIntake): string {
  const stageVerb: Record<string, string> = {
    emerging: "launch and establish",
    developing: "grow and professionalize",
    established: "scale and optimize",
    veteran: "maintain and expand",
  };

  const verb = stageVerb[intake.careerStage] ?? "build";
  const topGoal = intake.primaryGoals[0] ?? "build a sustainable music career";
  const modeLabel =
    intake.mode === "artist"
      ? intake.artistName
      : intake.mode === "agency"
        ? `${intake.artistName} (agency)`
        : `${intake.artistName} (label)`;

  return `Help ${modeLabel} ${verb} their music business with a primary focus on: ${topGoal.toLowerCase()}.`;
}

function buildResources(intake: OnboardingIntake): Record<string, string> {
  const resources: Record<string, string> = {};

  if (intake.hasDistributor && intake.distributor) {
    resources.distributor = intake.distributor;
  }
  if (intake.hasPro && intake.pro) {
    resources.pro = intake.pro;
  }
  if (intake.hasManager) {
    resources.manager = "yes";
  }
  if (intake.monthlyBudget) {
    const labels: Record<string, string> = {
      none: "$0",
      under500: "Under $500/mo",
      "500to2000": "$500-$2,000/mo",
      over2000: "$2,000+/mo",
    };
    resources.budget = labels[intake.monthlyBudget] ?? intake.monthlyBudget;
  }

  return resources;
}

function selectSpecialists(intake: OnboardingIntake): string[] {
  const selected: string[] = ["master"]; // Always include master agent

  const goalMap: Record<string, string[]> = {
    "Release music consistently": ["release"],
    "Build fanbase": ["content", "press"],
    "Get press coverage": ["press", "epk-brand"],
    "Book more shows": ["booking"],
    "Monetize catalog": ["publishing", "finance"],
    "Build team": ["contracts"],
    "Establish brand identity": ["epk-brand"],
    "Land sync placements": ["publishing", "contracts", "press"],
    "Grow streaming numbers": ["release", "content"],
    "Launch merchandise": ["finance", "content"],
    "Secure distribution deal": ["release", "publishing", "contracts"],
    "Build email list": ["content"],
    "Create content strategy": ["content"],
    "Network with industry": ["booking", "press"],
  };

  for (const goal of intake.primaryGoals) {
    const specialists = goalMap[goal];
    if (specialists) {
      for (const s of specialists) {
        if (!selected.includes(s)) {
          selected.push(s);
        }
      }
    }
  }

  // Also add EPK-brand for emerging artists
  if (intake.careerStage === "emerging" && !selected.includes("epk-brand")) {
    selected.push("epk-brand");
  }

  return selected;
}

function renderMarkdown(soul: SoulMd, intake: OnboardingIntake): string {
  const lines: string[] = [];

  lines.push(`# Soul.MD — ${soul.identity.name}`);
  lines.push("");
  lines.push("## Identity");
  lines.push(`- **Name**: ${soul.identity.name}`);
  lines.push(`- **Mode**: ${soul.identity.mode}`);
  lines.push(`- **Genre**: ${soul.identity.genre}`);
  lines.push(`- **Stage**: ${soul.identity.stage}`);
  if (intake.subGenres && intake.subGenres.length > 0) {
    lines.push(`- **Sub-genres**: ${intake.subGenres.join(", ")}`);
  }
  lines.push("");

  lines.push("## Mission");
  lines.push(soul.mission);
  lines.push("");

  lines.push("## Voice");
  lines.push(`- **Tone**: ${soul.voice.tone}`);
  lines.push(`- **Style**: ${soul.voice.style}`);
  lines.push(`- **Audience**: ${soul.voice.audience}`);
  lines.push("");

  lines.push("## Permissions");
  lines.push(`- Send on behalf: ${soul.permissions.canSend ? "YES" : "NO (approval required)"}`);
  lines.push(`- Publish content: ${soul.permissions.canPublish ? "YES" : "NO (approval required)"}`);
  lines.push(`- Financial actions: ${soul.permissions.canSpend ? "YES" : "NO (approval required)"}`);
  lines.push("");

  lines.push("## Context");
  lines.push("");
  lines.push("### Goals");
  for (const goal of soul.context.goals) {
    lines.push(`- ${goal}`);
  }
  lines.push("");

  lines.push("### Challenges");
  for (const challenge of soul.context.challenges) {
    lines.push(`- ${challenge}`);
  }
  lines.push("");

  lines.push("### Resources");
  const entries = Object.entries(soul.context.resources);
  if (entries.length === 0) {
    lines.push("- None configured yet");
  } else {
    for (const [key, value] of entries) {
      lines.push(`- **${capitalize(key)}**: ${value}`);
    }
  }
  lines.push("");

  lines.push("## Active Specialists");
  for (const id of soul.roster) {
    const specialist = SPECIALISTS.find((s) => s.id === id);
    if (specialist) {
      lines.push(`- **${specialist.name}** — ${specialist.role}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Initial Task Generator
// ---------------------------------------------------------------------------

interface StarterTask {
  title: string;
  description: string;
  priority: string;
  npaoPhase: NpaoPhase;
}

/**
 * Generates 3-5 starter tasks based on the user's goals, stage, and current setup.
 * Deterministic — no LLM calls.
 */
export function generateInitialTasks(intake: OnboardingIntake): StarterTask[] {
  const tasks: StarterTask[] = [];

  // Always start with brand foundation for emerging/developing
  if (
    intake.careerStage === "emerging" ||
    intake.careerStage === "developing"
  ) {
    tasks.push({
      title: "Build your Electronic Press Kit (EPK)",
      description:
        "Create a professional EPK with bio, photos, music links, and press highlights. This is your digital business card for industry outreach.",
      priority: "high",
      npaoPhase: "plan",
    });
  }

  // Distribution setup if they don't have one
  if (!intake.hasDistributor) {
    tasks.push({
      title: "Set up music distribution",
      description:
        "Research and choose a distribution partner (DistroKid, TuneCore, CD Baby, etc.) to get your music on all major streaming platforms.",
      priority: "high",
      npaoPhase: "navigate",
    });
  }

  // PRO registration
  if (!intake.hasPro) {
    tasks.push({
      title: "Register with a Performance Rights Organization",
      description:
        "Join ASCAP, BMI, or SESAC to collect performance royalties. This is essential for monetizing your music when it's played publicly.",
      priority: "medium",
      npaoPhase: "navigate",
    });
  }

  // Goal-specific tasks
  const goalTaskMap: Record<string, StarterTask> = {
    "Release music consistently": {
      title: "Create your release calendar",
      description:
        "Map out your next 3-6 months of releases with target dates, working backward from each release to set prep milestones.",
      priority: "high",
      npaoPhase: "plan",
    },
    "Build fanbase": {
      title: "Define your content strategy",
      description:
        "Establish your social media presence with a content plan: what platforms, posting frequency, content pillars, and engagement tactics.",
      priority: "medium",
      npaoPhase: "plan",
    },
    "Get press coverage": {
      title: "Build your press target list",
      description:
        "Research and compile a list of 20-30 blogs, playlists, and media contacts relevant to your genre and career stage.",
      priority: "medium",
      npaoPhase: "navigate",
    },
    "Book more shows": {
      title: "Create your live performance package",
      description:
        "Assemble your tech rider, stage plot, and booking one-sheet for venue outreach.",
      priority: "medium",
      npaoPhase: "plan",
    },
    "Establish brand identity": {
      title: "Define your visual brand system",
      description:
        "Establish your color palette, typography, imagery style, and brand guidelines for consistent visual identity across all touchpoints.",
      priority: "high",
      npaoPhase: "plan",
    },
    "Monetize catalog": {
      title: "Audit your royalty collection",
      description:
        "Review all revenue streams (streaming, sync, performance, mechanical) and identify uncollected royalties or gaps in your setup.",
      priority: "high",
      npaoPhase: "navigate",
    },
  };

  for (const goal of intake.primaryGoals) {
    const task = goalTaskMap[goal];
    if (task && tasks.length < 5) {
      // Avoid duplicates
      if (!tasks.some((t) => t.title === task.title)) {
        tasks.push(task);
      }
    }
  }

  // Ensure at least 3 tasks
  if (tasks.length < 3) {
    if (!tasks.some((t) => t.title.includes("brand"))) {
      tasks.push({
        title: "Complete your artist profile",
        description:
          "Fill out your full artist profile with bio, links, and imagery so your workspace agents have context for all outputs.",
        priority: "medium",
        npaoPhase: "operate",
      });
    }
    if (tasks.length < 3) {
      tasks.push({
        title: "Set your first 30-day milestone",
        description:
          "Define one concrete, measurable goal to achieve in the next 30 days. This gives your agent team a clear target.",
        priority: "medium",
        npaoPhase: "align",
      });
    }
  }

  return tasks.slice(0, 5);
}
