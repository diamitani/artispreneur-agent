/**
 * ROSTR task board — materializes NPAO build steps into trackable work.
 *
 * The board is the enforcement point for "approval before impact": a step
 * marked `requires_approval` can never move to `done` directly. It must pass
 * through `needs_approval` and be approved by a named human, and that approval
 * is written to the Reference Hub audit log.
 */

import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import { hubReadJson, hubWriteJson } from "@/lib/hub/store";
import type { BuildStep, NpaoStageOutput } from "@/lib/rostr/pipeline/types";
import { recordAudit, recordDecision, recordTaskSummary } from "./reference-hub";

const BOARD_PATH = "03-agent-workflows/task-board.json";

export type TaskStatus =
  | "planned"
  | "in_progress"
  | "needs_approval"
  | "approved"
  | "done"
  | "blocked"
  | "rejected";

export type BoardTask = {
  id: string;
  compile_id: string;
  order: number;
  title: string;
  instructions: string;
  npao: BuildStep["npao"];
  phase: BuildStep["phase"];
  owner: string;
  requires_approval: boolean;
  depends_on: string[];
  status: TaskStatus;
  /** Set when the artist approves or rejects. */
  decided_by: string | null;
  decided_at: string | null;
  note: string | null;
  updated_at: string;
};

export type TaskBoard = {
  version: 1;
  workspace_path: string;
  compile_id: string;
  tasks: BoardTask[];
  created_at: string;
  updated_at: string;
};

/** Transitions the board will accept. Anything else is rejected. */
const ALLOWED: Record<TaskStatus, TaskStatus[]> = {
  planned: ["in_progress", "blocked"],
  in_progress: ["needs_approval", "done", "blocked"],
  needs_approval: ["approved", "rejected", "blocked"],
  approved: ["done"],
  done: [],
  blocked: ["planned", "in_progress"],
  rejected: ["planned"],
};

export async function readBoard(scope: WorkspaceScope): Promise<TaskBoard | null> {
  return hubReadJson<TaskBoard>(scope, BOARD_PATH).catch(() => null);
}

/** Create (or replace) the board from an NPAO plan. */
export async function seedBoard(input: {
  scope: WorkspaceScope;
  compileId: string;
  npao: NpaoStageOutput;
}): Promise<TaskBoard> {
  const now = new Date().toISOString();
  const board: TaskBoard = {
    version: 1,
    workspace_path: workspaceLogicalPath(input.scope),
    compile_id: input.compileId,
    tasks: input.npao.steps.map((step) => ({
      id: step.id,
      compile_id: input.compileId,
      order: step.order,
      title: step.title,
      instructions: step.instructions,
      npao: step.npao,
      phase: step.phase,
      owner: step.owner,
      requires_approval: step.requires_approval,
      depends_on: step.depends_on,
      status: "planned" as const,
      decided_by: null,
      decided_at: null,
      note: null,
      updated_at: now,
    })),
    created_at: now,
    updated_at: now,
  };
  await hubWriteJson(input.scope, BOARD_PATH, board);
  return board;
}

export class TaskTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskTransitionError";
  }
}

/**
 * Move a task to a new status.
 *
 * Enforces three rules:
 *   1. Only declared transitions are allowed.
 *   2. An approval-gated task cannot reach `done` without being approved.
 *   3. Approving or rejecting requires a named actor, recorded in the audit log.
 */
export async function transitionTask(input: {
  scope: WorkspaceScope;
  taskId: string;
  next: TaskStatus;
  /** Authenticated user id. Required for approve/reject. */
  actor: string;
  note?: string;
}): Promise<{ board: TaskBoard; task: BoardTask }> {
  const board = await readBoard(input.scope);
  if (!board) throw new TaskTransitionError("No task board — compile a build first.");

  const task = board.tasks.find((t) => t.id === input.taskId);
  if (!task) throw new TaskTransitionError(`Unknown task: ${input.taskId}`);

  if (!ALLOWED[task.status].includes(input.next)) {
    throw new TaskTransitionError(
      `Cannot move "${task.title}" from ${task.status} to ${input.next}.`,
    );
  }

  // Rule 2: the approval gate cannot be bypassed.
  if (input.next === "done" && task.requires_approval && task.status !== "approved") {
    throw new TaskTransitionError(
      `"${task.title}" is approval-gated and must be approved before it can be completed.`,
    );
  }

  // Rule 3: decisions need a named human.
  const isDecision = input.next === "approved" || input.next === "rejected";
  if (isDecision && !input.actor.trim()) {
    throw new TaskTransitionError("Approval decisions require an authenticated actor.");
  }

  // Dependencies must be satisfied before work starts.
  if (input.next === "in_progress") {
    const blocking = task.depends_on.filter((depId) => {
      const dep = board.tasks.find((t) => t.id === depId);
      return dep && dep.status !== "done";
    });
    if (blocking.length) {
      throw new TaskTransitionError(
        `"${task.title}" is blocked by: ${blocking.join(", ")}.`,
      );
    }
  }

  const now = new Date().toISOString();
  task.status = input.next;
  task.note = input.note ?? task.note;
  task.updated_at = now;
  if (isDecision) {
    task.decided_by = input.actor;
    task.decided_at = now;
  }
  board.updated_at = now;

  await hubWriteJson(input.scope, BOARD_PATH, board);

  // Reference Hub: decisions and completions are recorded, not inferred.
  if (isDecision) {
    await recordDecision(input.scope, {
      task_id: task.id,
      action: input.next === "approved" ? "approved" : "rejected",
      actor: input.actor,
      summary: task.title,
    }).catch((e) => console.error("[reference-hub:decision]", e));
  }
  if (input.next === "done") {
    await recordTaskSummary(input.scope, {
      task_id: task.id,
      title: task.title,
      outcome: "completed",
      agent: task.owner,
    }).catch((e) => console.error("[reference-hub:summary]", e));
  }

  await recordAudit(input.scope, {
    event: `task.${input.next}`,
    actor: input.actor,
    task_id: task.id,
    workspace_path: board.workspace_path,
    detail: { title: task.title, requires_approval: task.requires_approval },
  }).catch((e) => console.error("[reference-hub:audit]", e));

  return { board, task };
}

/** Board rollup for Mission Control. */
export function boardSummary(board: TaskBoard | null) {
  if (!board) {
    return { total: 0, done: 0, needs_approval: 0, in_progress: 0, blocked: 0 };
  }
  const count = (s: TaskStatus) => board.tasks.filter((t) => t.status === s).length;
  return {
    total: board.tasks.length,
    done: count("done"),
    needs_approval: count("needs_approval"),
    in_progress: count("in_progress"),
    blocked: count("blocked"),
  };
}
