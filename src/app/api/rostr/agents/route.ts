import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import { hubReadJson } from "@/lib/hub/store";
import {
  listAgents,
  proposeAgentFromCompile,
  registerAgent,
  setAgentStatus,
} from "@/lib/rostr/agent-registry";
import { loadWorkspaceContext } from "@/lib/rostr/pipeline";
import type { RostrCompilation } from "@/lib/rostr/pipeline/types";
import { recordAudit } from "@/lib/rostr/reference-hub";

export const runtime = "nodejs";

const ProposeBody = z.object({
  /** Compile to derive the agent from. Defaults to the latest compile. */
  compile_id: z.string().max(120).optional(),
  /** Activate immediately instead of leaving it proposed. */
  activate: z.boolean().optional(),
});

const StatusBody = z.object({
  agent_id: z.string().min(1).max(64),
  status: z.enum(["proposed", "active", "disabled"]),
});

/** Custom agents registered in this workspace. */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scope = agentProjectScope(session.sub, session.projectId);
  const agents = await listAgents(scope);

  return NextResponse.json({
    ok: true,
    workspace_path: session.workspacePath,
    agents,
    counts: {
      total: agents.length,
      active: agents.filter((a) => a.status === "active").length,
      proposed: agents.filter((a) => a.status === "proposed").length,
    },
  });
}

/**
 * Build a custom agent from a compile.
 *
 * The agent is derived from work the artist actually asked for, so it inherits
 * that build's tools, skills, and approval gates. It lands as `proposed` unless
 * `activate` is set — a standing capability needs an explicit yes.
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

  const parsed = ProposeBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const scope = agentProjectScope(session.sub, session.projectId);

  let compileId = parsed.data.compile_id;
  if (!compileId) {
    const latest = await hubReadJson<{ compile_id: string }>(
      scope,
      "03-agent-workflows/latest-compile.json",
    ).catch(() => null);
    compileId = latest?.compile_id;
  }
  if (!compileId) {
    return NextResponse.json(
      { error: "No compile found — run POST /api/rostr/compile first." },
      { status: 409 },
    );
  }

  const compilation = await hubReadJson<RostrCompilation>(
    scope,
    `03-agent-workflows/compiles/${compileId}/compilation.json`,
  ).catch(() => null);
  if (!compilation) {
    return NextResponse.json({ error: `Unknown compile: ${compileId}` }, { status: 404 });
  }

  const ctx = await loadWorkspaceContext(scope);
  const proposed = proposeAgentFromCompile(compilation, ctx);
  if (parsed.data.activate) proposed.status = "active";

  const agent = await registerAgent(scope, proposed);

  await recordAudit(scope, {
    event: "agent.registered",
    actor: session.sub,
    workspace_path: session.workspacePath,
    detail: { agent_id: agent.id, status: agent.status, compile_id: compileId },
  }).catch((e) => console.error("[audit]", e));

  return NextResponse.json({ ok: true, agent });
}

/** Activate or disable a registered agent. */
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

  const parsed = StatusBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const scope = agentProjectScope(session.sub, session.projectId);
  const agent = await setAgentStatus(scope, parsed.data.agent_id, parsed.data.status);
  if (!agent) {
    return NextResponse.json({ error: `Unknown agent: ${parsed.data.agent_id}` }, { status: 404 });
  }

  await recordAudit(scope, {
    event: `agent.${parsed.data.status}`,
    actor: session.sub,
    workspace_path: session.workspacePath,
    detail: { agent_id: agent.id },
  }).catch((e) => console.error("[audit]", e));

  return NextResponse.json({ ok: true, agent });
}
