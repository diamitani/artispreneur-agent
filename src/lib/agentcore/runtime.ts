/**
 * AgentCore Runtime — serverless execution of the Hermes agent.
 *
 * When AGENTCORE_RUNTIME_ARN is set, agent turns can be dispatched to a
 * deployed AgentCore runtime instead of being run inline against Bedrock.
 * The session id is derived from the workspace scope so AgentCore's own
 * session isolation lines up with our workspace boundary.
 */

import { InvokeAgentRuntimeCommand } from "@aws-sdk/client-bedrock-agentcore";
import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { agentCoreData } from "./client";
import {
  getAgentRuntimeArn,
  getAgentRuntimeQualifier,
  isAgentCoreRuntimeConfigured,
} from "./config";
import { memoryActorId } from "./memory";

export type RuntimeInvocation = {
  /** Compiled task package handed to the agent. */
  payload: unknown;
  scope: WorkspaceScope;
  /** Stable per-conversation id; defaults to the workspace actor id. */
  sessionId?: string;
  traceId?: string;
};

export type RuntimeResult = {
  ok: true;
  body: string;
  contentType: string | null;
  session_id: string;
};

export type RuntimeSkipped = {
  ok: false;
  reason: "not_configured" | "error";
  detail?: string;
};

/**
 * AgentCore requires a session id of at least 33 characters. Workspace ids are
 * often shorter, so pad deterministically rather than truncating — the same
 * scope must always map to the same session.
 */
export function runtimeSessionId(scope: WorkspaceScope, sessionId?: string): string {
  const base = sessionId?.trim() || memoryActorId(scope);
  const safe = base.replace(/[^A-Za-z0-9_.:-]/g, "-");
  if (safe.length >= 33) return safe.slice(0, 100);
  return `${safe}${"-artispreneur-agent-session".repeat(3)}`.slice(0, 100);
}

export async function invokeAgentRuntime(
  input: RuntimeInvocation,
): Promise<RuntimeResult | RuntimeSkipped> {
  if (!isAgentCoreRuntimeConfigured()) {
    return { ok: false, reason: "not_configured" };
  }

  const sessionId = runtimeSessionId(input.scope, input.sessionId);
  try {
    const out = await agentCoreData().send(
      new InvokeAgentRuntimeCommand({
        agentRuntimeArn: getAgentRuntimeArn(),
        qualifier: getAgentRuntimeQualifier(),
        runtimeSessionId: sessionId,
        runtimeUserId: memoryActorId(input.scope),
        traceId: input.traceId,
        contentType: "application/json",
        accept: "application/json",
        payload: new TextEncoder().encode(JSON.stringify(input.payload)),
      }),
    );

    const body = out.response ? await out.response.transformToString("utf8") : "";
    return {
      ok: true,
      body,
      contentType: out.contentType ?? null,
      session_id: sessionId,
    };
  } catch (e) {
    console.error("[agentcore:runtime]", e);
    return { ok: false, reason: "error", detail: (e as Error)?.message };
  }
}
