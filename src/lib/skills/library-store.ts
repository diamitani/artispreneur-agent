/**
 * Per-workspace Skills Library — owned / installed digital skill packs.
 */

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { agentProjectScope, workspaceFsRoot } from "@/lib/tenancy/hierarchy";
import { getSkillById, type SkillProduct } from "./catalog";

export type OwnedSkill = {
  skill_id: string;
  slug: string;
  name: string;
  acquired_at: string;
  source: "free_claim" | "stripe" | "admin";
  stripe_session_id?: string;
  installed: boolean;
  installed_at?: string;
};

type LibraryFile = {
  user_id: string;
  project_id: string;
  skills: OwnedSkill[];
  updated_at: string;
};

function libraryPath(userId: string, projectId: string) {
  return path.join(
    workspaceFsRoot(agentProjectScope(userId, projectId)),
    "00-config",
    "skills-library.json",
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
}) {
  const lib = await readLibrary(input.userId, input.projectId);
  if (lib.skills.some((s) => s.skill_id === input.skill.id)) {
    return { alreadyOwned: true as const, skill: lib.skills.find((s) => s.skill_id === input.skill.id)! };
  }

  const owned: OwnedSkill = {
    skill_id: input.skill.id,
    slug: input.skill.slug,
    name: input.skill.name,
    acquired_at: new Date().toISOString(),
    source: input.source,
    stripe_session_id: input.stripeSessionId,
    installed: false,
  };
  lib.skills.push(owned);
  await writeLibrary(lib);

  // Drop digital pack stub into workspace
  const packDir = path.join(
    workspaceFsRoot(agentProjectScope(input.userId, input.projectId)),
    "skills",
    input.skill.slug,
  );
  await mkdir(packDir, { recursive: true });
  await writeFile(
    path.join(packDir, "SKILL.md"),
    `# ${input.skill.name}\n\n${input.skill.tagline}\n\n${input.skill.description}\n\n## Includes\n\n${input.skill.includes.map((i) => `- ${i}`).join("\n")}\n\n## Agent\n\n${input.skill.agent}\n\nVersion ${input.skill.version}\n`,
    "utf8",
  );
  await writeFile(
    path.join(packDir, "manifest.json"),
    JSON.stringify(
      {
        id: input.skill.id,
        slug: input.skill.slug,
        version: input.skill.version,
        acquired_at: owned.acquired_at,
        source: owned.source,
      },
      null,
      2,
    ),
    "utf8",
  );

  return { alreadyOwned: false as const, skill: owned };
}

export async function markSkillInstalled(userId: string, projectId: string, skillId: string) {
  const lib = await readLibrary(userId, projectId);
  const i = lib.skills.findIndex((s) => s.skill_id === skillId);
  if (i < 0) return false;
  lib.skills[i] = {
    ...lib.skills[i],
    installed: true,
    installed_at: new Date().toISOString(),
  };
  await writeLibrary(lib);
  return true;
}

export async function enrichOwned(userId: string, projectId: string) {
  const owned = await listOwnedSkills(userId, projectId);
  return owned.map((o) => ({
    ...o,
    product: getSkillById(o.skill_id),
  }));
}
