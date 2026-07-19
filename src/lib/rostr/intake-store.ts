/**
 * Intake store — memory + hierarchical Rostr Hub on disk.
 *
 * Path:
 * .data/orgs/diamitani-industries/tenants/artispreneur-com/products/agent/
 *   users/{cognitoSub}/projects/{projectId}/00-config/
 *
 * Prod target: same key layout on S3 + DynamoDB USER# index.
 */

import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import type { PalCompilationResult } from "./pal-compiler";
import {
  agentProjectScope,
  workspaceFsRoot,
  workspaceLogicalPath,
} from "@/lib/tenancy/hierarchy";

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

function scopeForResult(result: PalCompilationResult) {
  return agentProjectScope(result.user_id, result.workspace_config.artist_id);
}

/** Persist compiled artifacts under hierarchical Agent project workspace */
export async function persistIntakeToDisk(result: PalCompilationResult) {
  const scope = scopeForResult(result);
  const root = workspaceFsRoot(scope);
  const configDir = path.join(root, "00-config");

  await mkdir(configDir, { recursive: true });
  await mkdir(path.join(root, "03-agent-workflows"), { recursive: true });

  const tenancy = {
    workspace_path: workspaceLogicalPath(scope),
    org_id: scope.orgId,
    tenant_id: scope.tenantId,
    product_id: scope.productId,
    user_id: scope.userId,
    project_id: scope.projectId,
  };

  await writeFile(path.join(configDir, "master-soul.md"), result.master_soul_md, "utf8");
  await writeFile(
    path.join(configDir, "artist-profile.json"),
    JSON.stringify(result.workspace_config.artist_profile, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(configDir, "workspace-config.json"),
    JSON.stringify({ ...result.workspace_config, tenancy }, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(configDir, "tenancy.json"),
    JSON.stringify(tenancy, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(configDir, "permissions.yaml"),
    `default_mode: ${result.workspace_config.permissions.default_mode}\napproval_required: true\n`,
    "utf8",
  );
  await writeFile(
    path.join(root, "03-agent-workflows", "npao-plan.json"),
    JSON.stringify(result.npao_plan, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(configDir, "pal-compilation.json"),
    JSON.stringify({ ...result, tenancy }, null, 2),
    "utf8",
  );

  // Legacy alias for older loaders
  const legacy = path.join(process.cwd(), ".data", "workspaces", result.workspace_config.artist_id);
  await mkdir(path.join(legacy, "00-config"), { recursive: true });
  await writeFile(
    path.join(legacy, "00-config", "pal-compilation.json"),
    JSON.stringify({ ...result, tenancy, hub_path: configDir }, null, 2),
    "utf8",
  );

  return configDir;
}

export async function loadIntakeFromDisk(
  userId: string,
  projectId: string,
): Promise<PalCompilationResult | null> {
  const scope = agentProjectScope(userId, projectId);
  const file = path.join(workspaceFsRoot(scope), "00-config", "pal-compilation.json");
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as PalCompilationResult;
  } catch {
    return null;
  }
}
