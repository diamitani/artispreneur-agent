/**
 * ROSTR Reference Hub — durable record of what the agent system decided.
 *
 * Four state layers are kept distinct so they can be retained, exported, and
 * reasoned about separately:
 *   session   — one conversation
 *   task      — one unit of work
 *   decision  — an approval or rejection by a named human
 *   artifact  — a produced deliverable
 *
 * Approval records are append-only. `docs/PRD_WORKSPACE.md` requires that an
 * approval creates an immutable audit record, so nothing here rewrites history.
 */

import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { hubAppendJsonl, hubReadText } from "@/lib/hub/store";

const DECISIONS_LOG = "05-agent-memory/decisions.jsonl";
const TASK_LOG = "05-agent-memory/performance-history.jsonl";
const AUDIT_LOG = "04-deliverables/audit-log.jsonl";

export type DecisionRecord = {
  type: "decision";
  at: string;
  task_id: string;
  action: "approved" | "rejected" | "edited";
  /** Who approved. Never inferred — always passed from an authenticated session. */
  actor: string;
  summary: string;
  payload_digest?: string;
};

export type TaskSummaryRecord = {
  type: "task_summary";
  at: string;
  task_id: string;
  title: string;
  outcome: "completed" | "failed" | "cancelled";
  agent: string;
  learning?: string;
};

export type ArtifactRecord = {
  type: "artifact";
  at: string;
  task_id: string | null;
  path: string;
  kind: string;
  summary: string;
};

export type AuditEvent = {
  at: string;
  event: string;
  actor: string;
  task_id?: string;
  workspace_path: string;
  detail?: Record<string, unknown>;
};

/** Record an approval decision. Append-only. */
export async function recordDecision(
  scope: WorkspaceScope,
  record: Omit<DecisionRecord, "type" | "at">,
): Promise<DecisionRecord> {
  const full: DecisionRecord = { type: "decision", at: new Date().toISOString(), ...record };
  await hubAppendJsonl(scope, DECISIONS_LOG, full);
  return full;
}

/** Record how a task finished, plus any reusable learning. */
export async function recordTaskSummary(
  scope: WorkspaceScope,
  record: Omit<TaskSummaryRecord, "type" | "at">,
): Promise<TaskSummaryRecord> {
  const full: TaskSummaryRecord = { type: "task_summary", at: new Date().toISOString(), ...record };
  await hubAppendJsonl(scope, TASK_LOG, full);
  return full;
}

/** Record a produced artifact. */
export async function recordArtifact(
  scope: WorkspaceScope,
  record: Omit<ArtifactRecord, "type" | "at">,
): Promise<ArtifactRecord> {
  const full: ArtifactRecord = { type: "artifact", at: new Date().toISOString(), ...record };
  await hubAppendJsonl(scope, TASK_LOG, full);
  return full;
}

/**
 * Append to the immutable audit log. Every consequential event goes here:
 * approvals, executions, provisioning, and key issuance.
 */
export async function recordAudit(
  scope: WorkspaceScope,
  event: Omit<AuditEvent, "at">,
): Promise<AuditEvent> {
  const full: AuditEvent = { at: new Date().toISOString(), ...event };
  await hubAppendJsonl(scope, AUDIT_LOG, full);
  return full;
}

async function readJsonl<T>(scope: WorkspaceScope, path: string, limit: number): Promise<T[]> {
  const raw = await hubReadText(scope, path).catch(() => null);
  if (!raw) return [];
  const rows = raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as T;
      } catch {
        return null;
      }
    })
    .filter((r): r is T => r !== null);
  return rows.slice(-limit).reverse();
}

export async function listDecisions(scope: WorkspaceScope, limit = 50) {
  return readJsonl<DecisionRecord>(scope, DECISIONS_LOG, limit);
}

export async function listTaskHistory(
  scope: WorkspaceScope,
  limit = 50,
): Promise<(TaskSummaryRecord | ArtifactRecord)[]> {
  return readJsonl<TaskSummaryRecord | ArtifactRecord>(scope, TASK_LOG, limit);
}

export async function listAudit(scope: WorkspaceScope, limit = 100) {
  return readJsonl<AuditEvent>(scope, AUDIT_LOG, limit);
}
