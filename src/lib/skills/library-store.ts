/**
 * Per-workspace Skills Library — owned / installed digital skill packs.
 *
 * Own  → claim or Stripe fulfill (vault pack written)
 * Install → activate in Hermes runtime (loaded into chat system prompt)
 */

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { agentProjectScope, workspaceFsRoot } from "@/lib/tenancy/hierarchy";
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
};

type HermesSkillsRegistry = {
  runtime: "hermes+pal-rostr";
  user_id: string;
  project_id: string;
  active: string[];
  updated_at: string;
};

function libraryPath(userId: string, projectId: string) {
  return path.join(
    workspaceFsRoot(agentProjectScope(userId, projectId)),
    "00-config",
    "skills-library.json",
  );
}

function hermesRegistryPath(userId: string, projectId: string) {
  return path.join(
    workspaceFsRoot(agentProjectScope(userId, projectId)),
    "00-config",
    "hermes-skills.json",
  );
}

function packDir(userId: string, projectId: string, slug: string) {
  return path.join(
    workspaceFsRoot(agentProjectScope(userId, projectId)),
    "skills",
    slug,
  );
}

async function readLibrary(userId: string, projectId: string): Promise<LibraryFile> {
  try {
    return JSON.parse(await readFile(libraryPath(userId, projectId), "utf8")) as LibraryFile;
  } catch {
    return { user_id: userId, project_id: projectId, skills: [], updated_at: new Date().toISOString() };
  }
}

async function writeLibrary(lib: LibraryFile) {
  const file = libraryPath(lib.user_id, lib.project_id);
  await mkdir(path.dirname(file), { recursive: true });
  lib.updated_at = new Date().toISOString();
  await writeFile(file, JSON.stringify(lib, null, 2), "utf8");
  await syncHermesRegistry(lib);
}

async function syncHermesRegistry(lib: LibraryFile) {
  const registry: HermesSkillsRegistry = {
    runtime: "hermes+pal-rostr",
    user_id: lib.user_id,
    project_id: lib.project_id,
    active: lib.skills.filter((s) => s.installed).map((s) => s.slug),
    updated_at: new Date().toISOString(),
  };
  const file = hermesRegistryPath(lib.user_id, lib.project_id);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(registry, null, 2), "utf8");
}

async function writePackFiles(userId: string, projectId: string, skill: SkillProduct, owned: OwnedSkill) {
  const dir = packDir(userId, projectId, skill.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "SKILL.md"), renderSkillPackMarkdown(skill), "utf8");
  await writeFile(
    path.join(dir, "manifest.json"),
    JSON.stringify(
      {
        id: skill.id,
        slug: skill.slug,
        version: skill.version,
        specialist_id: skill.specialistId,
        acquired_at: owned.acquired_at,
        source: owned.source,
        runtime: "hermes+pal-rostr",
      },
      null,
      2,
    ),
    "utf8",
  );
}

export async function listOwnedSkills(userId: string, projectId: string) {
  return (await readLibrary(userId, projectId)).skills;
}

export async function ownsSkill(userId: string, projectId: string, skillId: string) {
  const lib = await readLibrary(userId, projectId);
  return lib.skills.some((s) => s.skill_id === skillId);
}

/**
 * Claim / fulfill a skill into the library.
 * Free claims auto-install into Hermes so the pack is immediately usable.
 */
export async function addSkillToLibrary(input: {
  userId: string;
  projectId: string;
  skill: SkillProduct;
  source: OwnedSkill["source"];
  stripeSessionId?: string;
  /** Default: true for free_claim, false for paid until webhook confirms */
  autoInstall?: boolean;
}) {
  const lib = await readLibrary(input.userId, input.projectId);
  if (lib.skills.some((s) => s.skill_id === input.skill.id)) {
    // Refresh pack body if already owned
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

  const skill = getSkillById(skillId);
  if (skill) {
    await writePackFiles(userId, projectId, skill, lib.skills[i]);
  }

  lib.skills[i] = {
    ...lib.skills[i],
    installed,
    installed_at: installed ? new Date().toISOString() : lib.skills[i].installed_at,
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

/** Read SKILL.md bodies for packs currently installed in Hermes */
export async function listInstalledSkillBodies(userId: string, projectId: string) {
  const owned = await listOwnedSkills(userId, projectId);
  const installed = owned.filter((s) => s.installed);
  const out: { skill_id: string; slug: string; name: string; body: string }[] = [];

  for (const s of installed) {
    const product = getSkillById(s.skill_id);
    const file = path.join(packDir(userId, projectId, s.slug), "SKILL.md");
    try {
      const body = await readFile(file, "utf8");
      out.push({ skill_id: s.skill_id, slug: s.slug, name: s.name, body });
    } catch {
      if (product) {
        const body = renderSkillPackMarkdown(product);
        await writePackFiles(userId, projectId, product, s);
        out.push({ skill_id: s.skill_id, slug: s.slug, name: s.name, body });
      }
    }
  }

  return out;
}
