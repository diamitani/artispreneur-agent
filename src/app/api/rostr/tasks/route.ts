import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import {
  boardSummary,
  readBoard,
  transitionTask,
  TaskTransitionError,
} from "@/lib/rostr/task-board";
import { listDecisions } from "@/lib/rostr/reference-hub";

export const runtime = "nodejs";

const TransitionBody = z.object({
  task_id: z.string().min(1),
  status: z.enum([
    "planned",
    "in_progress",
    "needs_approval",
    "approved",
    "done",
    "blocked",
    "rejected",
  ]),
  note: z.string().max(2000).optional(),
});

/** Task board plus recent approval decisions. */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scope = agentProjectScope(session.sub, session.projectId);
  const board = await readBoard(scope);
  const decisions = await listDecisions(scope, 20);

  return NextResponse.json({
    ok: true,
    board,
    summary: boardSummary(board),
    decisions,
  });
}

/**
 * Move a task through the board.
 *
 * The approval gate lives in `transitionTask`: an approval-gated task cannot
 * reach `done` without an explicit `approved` transition by a named actor,
 * and every decision is written to the immutable audit log.
 */
export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = TransitionBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const scope = agentProjectScope(session.sub, session.projectId);

  try {
    const { board, task } = await transitionTask({
      scope,
      taskId: parsed.data.task_id,
      next: parsed.data.status,
      // Actor comes from the verified session — never from the request body.
      actor: session.sub,
      note: parsed.data.note,
    });
    return NextResponse.json({ ok: true, task, summary: boardSummary(board) });
  } catch (e) {
    if (e instanceof TaskTransitionError) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    console.error("[rostr:tasks:patch]", e);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
