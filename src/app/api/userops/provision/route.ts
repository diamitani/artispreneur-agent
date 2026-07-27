import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import {
  provisionSummary,
  provisionWorkspace,
  readProvisionState,
} from "@/lib/userops";
import { recordAudit } from "@/lib/rostr/reference-hub";

export const runtime = "nodejs";
export const maxDuration = 120;

const ProvisionBody = z.object({
  /** Build package to install from. Defaults to the workspace's latest compile. */
  compile_id: z.string().max(120).optional(),
  /** Re-run every step, including completed ones. */
  force: z.boolean().optional(),
});

/** Current provisioning state for this workspace. */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const state = await readProvisionState(session.sub, session.projectId);
  return NextResponse.json({
    ok: true,
    workspace_path: session.workspacePath,
    state,
    summary: provisionSummary(state),
  });
}

/**
 * Run (or resume) UserOps provisioning: control-plane records, workspace
 * storage structure, agent compute binding, and the agent install.
 *
 * Idempotent — completed steps are skipped unless `force` is set.
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

  const parsed = ProvisionBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const scope = agentProjectScope(session.sub, session.projectId);

  const state = await provisionWorkspace({
    // Identity comes from the session, so a caller can only ever provision
    // their own workspace.
    userId: session.sub,
    projectId: session.projectId,
    compileId: parsed.data.compile_id ?? null,
    email: session.email,
    force: parsed.data.force,
  });

  await recordAudit(scope, {
    event: "userops.provision",
    actor: session.sub,
    workspace_path: session.workspacePath,
    detail: {
      status: state.status,
      compile_id: state.compile_id,
      steps: state.steps.map((s) => ({ id: s.id, status: s.status })),
    },
  }).catch((e) => console.error("[audit]", e));

  return NextResponse.json(
    {
      ok: state.status !== "failed",
      workspace_path: session.workspacePath,
      state,
      summary: provisionSummary(state),
    },
    { status: state.status === "failed" ? 500 : 200 },
  );
}
