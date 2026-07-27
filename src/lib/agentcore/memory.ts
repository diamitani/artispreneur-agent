/**
 * AgentCore Memory — durable per-artist memory for the Hermes agent.
 *
 * Tenant isolation is structural, not advisory: every write and read is keyed
 * by an actor id derived from the workspace scope, so one artist's memory can
 * never be addressed from another workspace's scope. See `memoryActorId`.
 *
 * Falls back to the Rostr Hub (`05-agent-memory/`) when AgentCore Memory is not
 * configured, so local/dev keeps the same behaviour with no AWS dependency.
 */

import {
  CreateEventCommand,
  RetrieveMemoryRecordsCommand,
  Role,
} from "@aws-sdk/client-bedrock-agentcore";
import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import { hubAppendJsonl, hubReadText } from "@/lib/hub/store";
import { agentCoreData } from "./client";
import { getAgentCoreMemoryId, isAgentCoreMemoryConfigured } from "./config";

const HUB_MEMORY_LOG = "05-agent-memory/decisions.jsonl";

export type MemoryRole = "artist" | "agent";

export type MemoryTurn = {
  role: MemoryRole;
  text: string;
};

export type RecalledMemory = {
  id: string;
  text: string;
  created_at: string | null;
  source: "agentcore" | "hub";
};

/**
 * Actor id for AgentCore Memory. Derived only from the workspace scope, which
 * is itself derived server-side from the session — never from client input.
 */
export function memoryActorId(scope: WorkspaceScope): string {
  return `${scope.userId}::${scope.projectId}`;
}

/** Namespace used to partition retrieval to a single artist workspace. */
export function memoryNamespace(scope: WorkspaceScope): string {
  return workspaceLogicalPath(scope);
}

/**
 * Record a conversation turn (or decision) into artist memory.
 * Best-effort: memory must never break a chat turn.
 */
export async function rememberTurns(input: {
  scope: WorkspaceScope;
  sessionId: string;
  turns: MemoryTurn[];
}): Promise<{ written: boolean; backend: "agentcore" | "hub" }> {
  const { scope, sessionId, turns } = input;
  if (!turns.length) return { written: false, backend: "hub" };

  if (isAgentCoreMemoryConfigured()) {
    try {
      await agentCoreData().send(
        new CreateEventCommand({
          memoryId: getAgentCoreMemoryId(),
          actorId: memoryActorId(scope),
          sessionId,
          eventTimestamp: new Date(),
          payload: turns.map((t) => ({
            conversational: {
              role: t.role === "artist" ? Role.USER : Role.ASSISTANT,
              content: { text: t.text },
            },
          })),
        }),
      );
      return { written: true, backend: "agentcore" };
    } catch (e) {
      console.error("[agentcore:memory:write]", e);
      // fall through to hub
    }
  }

  await hubAppendJsonl(scope, HUB_MEMORY_LOG, {
    at: new Date().toISOString(),
    session_id: sessionId,
    turns,
  }).catch((e) => console.error("[hub:memory:write]", e));

  return { written: true, backend: "hub" };
}

/**
 * Semantic recall of prior artist memory, scoped to this workspace only.
 * Returns [] rather than throwing — recall is an enhancement, not a hard dep.
 */
export async function recallMemory(input: {
  scope: WorkspaceScope;
  query: string;
  limit?: number;
}): Promise<RecalledMemory[]> {
  const { scope, query } = input;
  const limit = input.limit ?? 5;
  if (!query.trim()) return [];

  if (isAgentCoreMemoryConfigured()) {
    try {
      const out = await agentCoreData().send(
        new RetrieveMemoryRecordsCommand({
          memoryId: getAgentCoreMemoryId(),
          namespace: memoryNamespace(scope),
          searchCriteria: { searchQuery: query, topK: limit },
          maxResults: limit,
        }),
      );
      const records = out.memoryRecordSummaries ?? [];
      return records
        .map((r) => {
          const content = r.content as { text?: string } | undefined;
          return {
            id: r.memoryRecordId ?? "",
            text: content?.text ?? "",
            created_at: r.createdAt ? new Date(r.createdAt).toISOString() : null,
            source: "agentcore" as const,
          };
        })
        .filter((r) => r.text.trim());
    } catch (e) {
      console.error("[agentcore:memory:recall]", e);
      return [];
    }
  }

  // Hub fallback: recent decisions, newest first. Keyword match, not semantic.
  const raw = await hubReadText(scope, HUB_MEMORY_LOG);
  if (!raw) return [];
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
  const rows = raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as { at?: string; turns?: MemoryTurn[] };
      } catch {
        return null;
      }
    })
    .filter((r): r is { at?: string; turns?: MemoryTurn[] } => r !== null);

  const scored: RecalledMemory[] = [];
  for (const row of rows.reverse()) {
    for (const turn of row.turns ?? []) {
      const lower = turn.text.toLowerCase();
      const hits = terms.filter((t) => lower.includes(t)).length;
      if (terms.length === 0 || hits > 0) {
        scored.push({
          id: `${row.at ?? ""}:${scored.length}`,
          text: turn.text,
          created_at: row.at ?? null,
          source: "hub",
        });
      }
      if (scored.length >= limit) return scored;
    }
  }
  return scored;
}
