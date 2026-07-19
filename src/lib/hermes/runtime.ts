/**
 * Hermes Agent runtime — product shell for Agent by Artispreneur.
 *
 * Backend model:
 *   Hermes (workspace agent) = Bedrock DeepSeek chat
 *   Runtime brain            = PAL / ROSTR (Soul + NPAO + specialist roster)
 *   Capability packs         = Skills Library (installed SKILL.md)
 */

import { readFile } from "fs/promises";
import path from "path";
import { MASTER_AGENT_SYSTEM } from "@/lib/agent/bedrock";
import { agentProjectScope, workspaceFsRoot, workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import { loadIntakeFromDisk, getIntake } from "@/lib/rostr/intake-store";
import {
  listOwnedSkills,
  listInstalledSkillBodies,
  type OwnedSkill,
} from "@/lib/skills/library-store";
import { getSkillById, type SkillProduct } from "@/lib/skills/catalog";
import type { SpecialistId } from "@/lib/rostr/specialists";

const MAX_SKILL_CHARS = 3500;
const MAX_SOUL_CHARS = 6000;
const MAX_TOTAL_SKILLS = 5;

export type HermesRuntimeSnapshot = {
  workspace_path: string;
  user_id: string;
  project_id: string;
  soul_loaded: boolean;
  soul_excerpt_chars: number;
  pal_loaded: boolean;
  completeness: number | null;
  roster: { id: string; name: string; role: string }[];
  npao_count: number;
  owned_count: number;
  active_skills: {
    skill_id: string;
    slug: string;
    name: string;
    specialist_id?: SpecialistId;
    installed_at?: string;
  }[];
  runtime: "hermes+pal-rostr";
};

export async function getHermesSnapshot(
  userId: string,
  projectId: string,
): Promise<HermesRuntimeSnapshot> {
  const scope = agentProjectScope(userId, projectId);
  const owned = await listOwnedSkills(userId, projectId);
  const active = owned.filter((s) => s.installed);
  const pal =
    getIntake(projectId) ||
    getIntake(userId) ||
    (await loadIntakeFromDisk(userId, projectId));

  let soulLoaded = false;
  let soulChars = 0;
  try {
    const soul = await readFile(
      path.join(workspaceFsRoot(scope), "00-config", "master-soul.md"),
      "utf8",
    );
    soulLoaded = soul.trim().length > 0;
    soulChars = soul.length;
  } catch {
    if (pal?.master_soul_md) {
      soulLoaded = true;
      soulChars = pal.master_soul_md.length;
    }
  }

  return {
    workspace_path: workspaceLogicalPath(scope),
    user_id: userId,
    project_id: projectId,
    soul_loaded: soulLoaded,
    soul_excerpt_chars: soulChars,
    pal_loaded: Boolean(pal),
    completeness: pal?.workspace_config?.completeness ?? null,
    roster: (pal?.workspace_config?.roster?.active ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
    })),
    npao_count: pal?.npao_plan?.length ?? 0,
    owned_count: owned.length,
    active_skills: active.map((s) => {
      const product = getSkillById(s.skill_id);
      return {
        skill_id: s.skill_id,
        slug: s.slug,
        name: s.name,
        specialist_id: product?.specialistId,
        installed_at: s.installed_at,
      };
    }),
    runtime: "hermes+pal-rostr",
  };
}

async function loadSoulMarkdown(userId: string, projectId: string): Promise<string | null> {
  const scope = agentProjectScope(userId, projectId);
  try {
    return await readFile(
      path.join(workspaceFsRoot(scope), "00-config", "master-soul.md"),
      "utf8",
    );
  } catch {
    const pal =
      getIntake(projectId) ||
      getIntake(userId) ||
      (await loadIntakeFromDisk(userId, projectId));
    return pal?.master_soul_md ?? null;
  }
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n…[truncated for context budget]`;
}

/**
 * Build Hermes system prompt: base rules + PAL Soul + roster/NPAO + active skill packs.
 */
export async function buildHermesSystemPrompt(
  userId: string,
  projectId: string,
): Promise<{ system: string; snapshot: HermesRuntimeSnapshot }> {
  const snapshot = await getHermesSnapshot(userId, projectId);
  const pal =
    getIntake(projectId) ||
    getIntake(userId) ||
    (await loadIntakeFromDisk(userId, projectId));
  const soul = await loadSoulMarkdown(userId, projectId);
  const skillBodies = await listInstalledSkillBodies(userId, projectId);

  const parts: string[] = [
    MASTER_AGENT_SYSTEM,
    "",
    "## Hermes runtime",
    "You are running as the Hermes Agent inside Agent by Artispreneur.",
    "Your operating system is ROSTR: PAL-compiled Soul, NPAO task routing, specialist roster, and installed Skills Library packs.",
    `Workspace: ${snapshot.workspace_path}`,
    "When a skill pack is active, follow its Runtime protocol for matching requests. Route domain work to the named specialist role conceptually; you remain the manager drafting outputs.",
  ];

  if (soul?.trim()) {
    parts.push("", "## Master Soul (PAL-compiled)", clip(soul.trim(), MAX_SOUL_CHARS));
  } else {
    parts.push(
      "",
      "## Master Soul",
      "No Master Soul on disk yet. Ask the artist to complete /onboarding (PAL intake) so work is personalized.",
    );
  }

  if (pal) {
    const roster = pal.workspace_config?.roster?.active ?? [];
    const plan = pal.npao_plan ?? [];
    parts.push(
      "",
      "## PAL roster & NPAO",
      `Completeness: ${pal.workspace_config?.completeness ?? "?"}%`,
      `Active specialists: ${roster.map((s) => `${s.name} (${s.role})`).join("; ") || "none"}`,
    );
    if (plan.length) {
      parts.push(
        "Current NPAO plan:",
        ...plan.slice(0, 8).map((t) => `- [${t.npao}] ${t.title} → ${t.agent} (${t.phase})`),
      );
    }
  }

  const activeBodies = skillBodies.slice(0, MAX_TOTAL_SKILLS);
  if (activeBodies.length) {
    parts.push("", `## Active Skills Library (${activeBodies.length} installed)`);
    for (const pack of activeBodies) {
      parts.push(
        "",
        `### Skill: ${pack.name} (\`${pack.slug}\`)`,
        clip(pack.body, MAX_SKILL_CHARS),
      );
    }
  } else {
    parts.push(
      "",
      "## Active Skills Library",
      "No skill packs installed. Artist can claim packs at /skills and Install them in /skills/library to activate Hermes capabilities.",
    );
  }

  return { system: parts.join("\n"), snapshot };
}

export function skillProductMeta(skill: SkillProduct) {
  return {
    id: skill.id,
    slug: skill.slug,
    specialistId: skill.specialistId,
  };
}

export type { OwnedSkill };
