/**
 * AgentCore Identity — workspace-scoped workload access tokens.
 *
 * Per the tenant-isolation rules in docs/WORKSPACE_FLOW.md, every agent task
 * runs with a short-lived token limited to one workspace. This mints that
 * token from the workload identity, keyed by the same actor id used for
 * Memory so runtime, memory, and tools all agree on the boundary.
 */

import { GetWorkloadAccessTokenForUserIdCommand } from "@aws-sdk/client-bedrock-agentcore";
import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { agentCoreData } from "./client";
import { getWorkloadIdentityName, isAgentCoreIdentityConfigured } from "./config";
import { memoryActorId } from "./memory";

export type WorkloadToken = {
  token: string;
  workload_name: string;
  actor_id: string;
};

/**
 * Mint a workspace-scoped access token, or null when Identity is not
 * configured. Callers must treat null as "no elevated scope available" and
 * stay on the platform-credential path — never as "skip authorization".
 */
export async function mintWorkspaceToken(
  scope: WorkspaceScope,
): Promise<WorkloadToken | null> {
  if (!isAgentCoreIdentityConfigured()) return null;

  const actorId = memoryActorId(scope);
  try {
    const out = await agentCoreData().send(
      new GetWorkloadAccessTokenForUserIdCommand({
        workloadName: getWorkloadIdentityName(),
        userId: actorId,
      }),
    );
    if (!out.workloadAccessToken) return null;
    return {
      token: out.workloadAccessToken,
      workload_name: getWorkloadIdentityName(),
      actor_id: actorId,
    };
  } catch (e) {
    console.error("[agentcore:identity]", e);
    return null;
  }
}
