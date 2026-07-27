import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import { executeNext, executeTask } from "@/lib/executor";

export const runtime = "nodejs";
export const maxDuration = 300;

const ExecuteBody = z.object({
  /** Run one specific task. Omit to run the next runnable task(s). */
  task_id: z.string().max(64).optional(),
  /** How many tasks to run when task_id is omitted. */
  limit: z.number().int().min(1).max(10).optional(),
  /** Run as a registered custom agent instead of the Master Agent. */
  agent_id: z.string().max(64).optional(),
});

/**
 * Execute work from the task board.
 *
 * The executor produces artifacts into `04-deliverables/drafts-awaiting-approval/`.
 * Approval-gated tasks stop at `needs_approval`; nothing is ever sent,
 * published, spent, signed, or filed here.
 */
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown = {};
  try {
    const text = await req.text();
    if (text.trim()) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ExecuteBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const scope = agentProjectScope(session.sub, session.projectId);

  const results = parsed.data.task_id
    ? [
        await executeTask({
          scope,
          taskId: parsed.data.task_id,
          // Actor is the verified session, never the request body.
          actor: session.sub,
          agentId: parsed.data.agent_id,
        }),
      ]
    : await executeNext({
        scope,
        actor: session.sub,
        limit: parsed.data.limit,
        agentId: parsed.data.agent_id,
      });

  const failed = results.find((r) => !r.ok);
  const status = failed && results.every((r) => !r.ok) ? 422 : 200;

  return NextResponse.json(
    {
      ok: !failed,
      executed: results.filter((r) => r.ok).length,
      results,
    },
    { status },
  );
}
