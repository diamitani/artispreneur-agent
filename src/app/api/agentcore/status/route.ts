import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { agentCoreStatus, memoryActorId } from "@/lib/agentcore";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import { instancePlaneStatus } from "@/lib/aws/instance-registry";

export const runtime = "nodejs";

/**
 * AgentCore capability status for this workspace.
 *
 * Reports which parts of the managed agent plane are wired up (runtime,
 * memory, identity, gateway) and what the workspace falls back to when they
 * are not. Config values only — never credentials.
 */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scope = agentProjectScope(session.sub, session.projectId);
  const core = agentCoreStatus();

  return NextResponse.json({
    ok: true,
    workspace_path: session.workspacePath,
    actor_id: memoryActorId(scope),
    agentcore: core,
    instance_plane: instancePlaneStatus(),
    fallbacks: {
      runtime: core.runtime.configured ? null : "Bedrock inline invocation (pooled worker)",
      memory: core.memory.configured ? null : "Rostr Hub 05-agent-memory/decisions.jsonl",
      identity: core.identity.configured ? null : "Platform IAM with server-side scope checks",
      gateway: core.gateway.configured ? null : "In-process tool registry",
    },
  });
}
