/**
 * In-process intake store for MVP.
 * Later: DynamoDB / S3 under artispreneurs/{artist-id}/00-config/
 */

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { PalCompilationResult } from "./pal-compiler";

const memory = new Map<string, PalCompilationResult>();

export function saveIntakeMemory(result: PalCompilationResult) {
  memory.set(result.user_id, result);
  memory.set(result.workspace_config.artist_id, result);
}

export function getIntake(userOrArtistId: string) {
  return memory.get(userOrArtistId) ?? null;
}

export function listIntakes() {
  return Array.from(memory.values());
}

/** Persist compiled artifacts under .data/workspaces/{artist-id}/ for local hub */
export async function persistIntakeToDisk(result: PalCompilationResult) {
  const root = path.join(
    process.cwd(),
    ".data",
    "workspaces",
    result.workspace_config.artist_id,
    "00-config",
  );
  await mkdir(root, { recursive: true });
  await mkdir(path.join(root, "..", "03-agent-workflows"), { recursive: true });

  await writeFile(path.join(root, "master-soul.md"), result.master_soul_md, "utf8");
  await writeFile(
    path.join(root, "artist-profile.json"),
    JSON.stringify(result.workspace_config.artist_profile, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(root, "workspace-config.json"),
    JSON.stringify(result.workspace_config, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(root, "permissions.yaml"),
    `default_mode: ${result.workspace_config.permissions.default_mode}\napproval_required: true\n`,
    "utf8",
  );
  await writeFile(
    path.join(root, "..", "03-agent-workflows", "npao-plan.json"),
    JSON.stringify(result.npao_plan, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(root, "pal-compilation.json"),
    JSON.stringify(result, null, 2),
    "utf8",
  );

  return root;
}
