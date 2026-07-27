/**
 * Hermes Agent runtime — product shell for Agent by Artispreneur.
 *
 * Managed under the AWS instance system:
 *   Hub (fs|S3)     → Soul, skills, PAL artifacts
 *   DynamoDB        → USER# / PROJECT# / AGENT#hermes
 *   Bedrock         → DeepSeek LLM
 *   PAL / ROSTR     → compilation + NPAO routing
 */

import { MASTER_AGENT_SYSTEM } from "@/lib/agent/bedrock";
import { agentProjectScope, workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import { loadIntakeFromDisk, getIntake } from "@/lib/rostr/intake-store";
import {
  listOwnedSkills,
  listInstalledSkillBodies,
  type OwnedSkill,
} from "@/lib/skills/library-store";
import { getSkillById } from "@/lib/skills/catalog";
import type { SpecialistId } from "@/lib/rostr/specialists";
import { hubReadText, hubBackendLabel } from "@/lib/hub/store";
import { listAgents } from "@/lib/rostr/agent-registry";
import {
  getAwsHermesAgent,
  getAwsInstanceProject,
  instancePlaneStatus,
  syncInstanceRuntime,
} from "@/lib/aws/instance-registry";

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
  aws_instance: ReturnType<typeof instancePlaneStatus>;
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
  const soul = await hubReadText(scope, "00-config/master-soul.md");
  if (soul?.trim()) {
    soulLoaded = true;
    soulChars = soul.length;
  } else if (pal?.master_soul_md) {
    soulLoaded = true;
    soulChars = pal.master_soul_md.length;
  }

  // Best-effort sync to instance control plane
  await syncInstanceRuntime({
    userId,
    projectId,
    completeness: pal?.workspace_config?.completeness ?? null,
    soulLoaded,
    activeSkillSlugs: active.map((s) => s.slug),
  }).catch(() => undefined);

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
    aws_instance: instancePlaneStatus(),
  };
}

async function loadSoulMarkdown(userId: string, projectId: string): Promise<string | null> {
  const scope = agentProjectScope(userId, projectId);
  const soul = await hubReadText(scope, "00-config/master-soul.md");
  if (soul?.trim()) return soul;
  const pal =
    getIntake(projectId) ||
    getIntake(userId) ||
    (await loadIntakeFromDisk(userId, projectId));
  return pal?.master_soul_md ?? null;
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n…[truncated for context budget]`;
}

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
  const instanceProject = await getAwsInstanceProject(userId, projectId);
  const hermesAgent = await getAwsHermesAgent(userId);

  const parts: string[] = [
    MASTER_AGENT_SYSTEM,
    "",
    "## Hermes runtime (AWS instance)",
    "You are running as the Hermes Agent inside Agent by Artispreneur.",
    "Your operating system is ROSTR: PAL-compiled Soul, NPAO task routing, specialist roster, and installed Skills Library packs.",
    `Workspace: ${snapshot.workspace_path}`,
    `Hub backend: ${hubBackendLabel()}`,
    instanceProject
      ? `Instance project plan: ${instanceProject.plan} · s3_prefix: ${instanceProject.s3_prefix}`
      : "Instance project: provisioning on first login.",
    hermesAgent
      ? `Control plane AGENT#hermes · model ${hermesAgent.model_id}`
      : "Control plane AGENT#hermes: pending sync.",
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

  // Custom agents the artist has built and activated in this workspace.
  const customAgents = await listAgents(
    agentProjectScope(userId, projectId),
    "active",
  ).catch(() => []);
  if (customAgents.length) {
    parts.push(
      "",
      `## Custom agents (${customAgents.length} active)`,
      "These were built by this artist for recurring work. Route matching requests to them by name and follow their instructions:",
      ...customAgents.map((a) => `- **${a.name}** (\`${a.id}\`) — ${a.purpose}`),
    );
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

export type { OwnedSkill };
