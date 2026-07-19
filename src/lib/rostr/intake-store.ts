/**
 * Intake store — memory + Rostr Hub (fs|S3) under AWS instance hierarchy.
 *
 * Path key:
 * orgs/diamitani-industries/tenants/artispreneur-com/products/agent/
 *   users/{cognitoSub}/projects/{projectId}/00-config/
 *
 * Control plane: DynamoDB USER# / PROJECT# sync via syncInstanceRuntime.
 */

import type { PalCompilationResult } from "./pal-compiler";
import {
  agentProjectScope,
  workspaceLogicalPath,
} from "@/lib/tenancy/hierarchy";
import { hubReadJson, hubWriteJson, hubWriteText } from "@/lib/hub/store";
import { syncInstanceRuntime } from "@/lib/aws/instance-registry";

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
  const tenancy = {
    workspace_path: workspaceLogicalPath(scope),
    org_id: scope.orgId,
    tenant_id: scope.tenantId,
    product_id: scope.productId,
    user_id: scope.userId,
    project_id: scope.projectId,
  };

  await hubWriteText(scope, "00-config/master-soul.md", result.master_soul_md);
  await hubWriteJson(scope, "00-config/artist-profile.json", result.workspace_config.artist_profile);
  await hubWriteJson(scope, "00-config/workspace-config.json", {
    ...result.workspace_config,
    tenancy,
  });
  await hubWriteJson(scope, "00-config/tenancy.json", tenancy);
  await hubWriteText(
    scope,
    "00-config/permissions.yaml",
    `default_mode: ${result.workspace_config.permissions.default_mode}\napproval_required: true\n`,
  );
  await hubWriteJson(scope, "03-agent-workflows/npao-plan.json", result.npao_plan);
  await hubWriteJson(scope, "00-config/pal-compilation.json", { ...result, tenancy });

  await syncInstanceRuntime({
    userId: result.user_id,
    projectId: result.workspace_config.artist_id,
    completeness: result.workspace_config.completeness ?? null,
    soulLoaded: Boolean(result.master_soul_md?.trim()),
  }).catch((e) => console.error("[instance-sync pal]", e));

  return workspaceLogicalPath(scope) + "/00-config";
}

export async function loadIntakeFromDisk(
  userId: string,
  projectId: string,
): Promise<PalCompilationResult | null> {
  const scope = agentProjectScope(userId, projectId);
  return hubReadJson<PalCompilationResult>(scope, "00-config/pal-compilation.json");
}
