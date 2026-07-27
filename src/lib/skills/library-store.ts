/**
 * Per-workspace Skills Library — owned / installed digital skill packs.
 * Persisted via AWS instance hub (fs|S3). Install state syncs to DynamoDB AGENT#hermes.
 */

import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import {
  hubReadJson,
  hubReadText,
  hubWriteJson,
  hubWriteText,
} from "@/lib/hub/store";
import { syncInstanceRuntime } from "@/lib/aws/instance-registry";
import { getSkillById, type SkillProduct } from "./catalog";
import { renderSkillPackMarkdown } from "./packs";

export type OwnedSkill = {
  skill_id: string;
  slug: string;
  name: string;
  acquired_at: string;
  source: "free_claim" | "stripe" | "admin";
  stripe_session_id?: string;
  /** Active in Hermes runtime */
  installed: boolean;
  installed_at?: string;
};

type LibraryFile = {
  user_id: string;
  project_id: string;
  skills: OwnedSkill[];
  updated_at: string;
  hub?: string;
};

type HermesSkillsRegistry = {
  runtime: "hermes+pal-rostr";
  user_id: string;
  project_id: string;
  active: string[];
  updated_at: string;
};

async function readLibrary(userId: string, projectId: string): Promise<LibraryFile> {
  const scope = agentProjectScope(userId, projectId);
  const lib = await hubReadJson<LibraryFile>(scope, "00-config/skills-library.json");
  return (
    lib ?? {
      user_id: userId,
      project_id: projectId,
      skills: [],
      updated_at: new Date().toISOString(),
    }
  );
}

async function writeLibrary(lib: LibraryFile) {
  const scope = agentProjectScope(lib.user_id, lib.project_id);
  lib.updated_at = new Date().toISOString();
  lib.hub = "aws-instance";
  await hubWriteJson(scope, "00-config/skills-library.json", lib);
  await syncHermesRegistry(lib);
}

async function syncHermesRegistry(lib: LibraryFile) {
  const scope = agentProjectScope(lib.user_id, lib.project_id);
  const active = lib.skills.filter((s) => s.installed).map((s) => s.slug);
  const registry: HermesSkillsRegistry = {
    runtime: "hermes+pal-rostr",
    user_id: lib.user_id,
    project_id: lib.project_id,
    active,
    updated_at: new Date().toISOString(),
  };
  await hubWriteJson(scope, "00-config/hermes-skills.json", registry);
  await syncInstanceRuntime({
    userId: lib.user_id,
    projectId: lib.project_id,
    activeSkillSlugs: active,
  }).catch((e) => console.error("[instance-sync skills]", e));
}

async function writePackFiles(
  userId: string,
  projectId: string,
  skill: SkillProduct,
  owned: OwnedSkill,
) {
  const scope = agentProjectScope(userId, projectId);
  await hubWriteText(
    scope,
    `skills/${skill.slug}/SKILL.md`,
    renderSkillPackMarkdown(skill),
  );
  await hubWriteJson(scope, `skills/${skill.slug}/manifest.json`, {
    id: skill.id,
    slug: skill.slug,
    version: skill.version,
    specialist_id: skill.specialistId,
    acquired_at: owned.acquired_at,
    source: owned.source,
    runtime: "hermes+pal-rostr",
    hub: "aws-instance",
  });
}

export async function listOwnedSkills(userId: string, projectId: string) {
  return (await readLibrary(userId, projectId)).skills;
}

export async function ownsSkill(userId: string, projectId: string, skillId: string) {
  const lib = await readLibrary(userId, projectId);
  return lib.skills.some((s) => s.skill_id === skillId);
}

export async function addSkillToLibrary(input: {
  userId: string;
  projectId: string;
  skill: SkillProduct;
  source: OwnedSkill["source"];
  stripeSessionId?: string;
  autoInstall?: boolean;
}) {
  const lib = await readLibrary(input.userId, input.projectId);
  if (lib.skills.some((s) => s.skill_id === input.skill.id)) {
    const existing = lib.skills.find((s) => s.skill_id === input.skill.id)!;
    await writePackFiles(input.userId, input.projectId, input.skill, existing);
    return { alreadyOwned: true as const, skill: existing };
  }

  const autoInstall =
    input.autoInstall ?? (input.source === "free_claim" || input.source === "admin");
  const now = new Date().toISOString();

  const owned: OwnedSkill = {
    skill_id: input.skill.id,
    slug: input.skill.slug,
    name: input.skill.name,
    acquired_at: now,
    source: input.source,
    stripe_session_id: input.stripeSessionId,
    installed: autoInstall,
    installed_at: autoInstall ? now : undefined,
  };
  lib.skills.push(owned);
  await writeLibrary(lib);
  await writePackFiles(input.userId, input.projectId, input.skill, owned);

  return { alreadyOwned: false as const, skill: owned };
}

export async function markSkillInstalled(
  userId: string,
  projectId: string,
  skillId: string,
  installed = true,
) {
  const lib = await readLibrary(userId, projectId);
  const i = lib.skills.findIndex((s) => s.skill_id === skillId);
  if (i < 0) return false;

  const owned = lib.skills[i];
  if (!owned) return null;
  const skill = getSkillById(skillId);
  if (skill) {
    await writePackFiles(userId, projectId, skill, owned);
  }

  lib.skills[i] = {
    ...owned,
    installed,
    installed_at: installed ? new Date().toISOString() : owned.installed_at,
  };
  await writeLibrary(lib);
  return true;
}

export async function enrichOwned(userId: string, projectId: string) {
  const owned = await listOwnedSkills(userId, projectId);
  return owned.map((o) => ({
    ...o,
    product: getSkillById(o.skill_id),
    hermes_active: o.installed,
  }));
}

export async function listInstalledSkillBodies(userId: string, projectId: string) {
  const owned = await listOwnedSkills(userId, projectId);
  const installed = owned.filter((s) => s.installed);
  const scope = agentProjectScope(userId, projectId);
  const out: { skill_id: string; slug: string; name: string; body: string }[] = [];

  for (const s of installed) {
    const product = getSkillById(s.skill_id);
    const body = await hubReadText(scope, `skills/${s.slug}/SKILL.md`);
    if (body) {
      out.push({ skill_id: s.skill_id, slug: s.slug, name: s.name, body });
    } else if (product) {
      const rendered = renderSkillPackMarkdown(product);
      await writePackFiles(userId, projectId, product, s);
      out.push({ skill_id: s.skill_id, slug: s.slug, name: s.name, body: rendered });
    }
  }

  return out;
}
