import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  ensureWorkspaceApiKey,
  issueWorkspaceApiKey,
  listWorkspaceApiKeys,
  revealOnceApiKey,
  revokeWorkspaceApiKey,
} from "@/lib/agent/workspace-api-key";
import { getUsageSummary } from "@/lib/agent/usage-ledger";

export const runtime = "nodejs";

/** List keys + usage for the signed-in workspace */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await listWorkspaceApiKeys(session.sub, session.projectId);
  const once = await revealOnceApiKey(session.sub, session.projectId);
  const usage = await getUsageSummary(session.sub, session.projectId);

  return NextResponse.json({
    ok: true,
    workspace_path: session.workspacePath,
    project_id: session.projectId,
    keys,
    reveal_once: once,
    usage,
    note: "Workspace Agent keys (apa_*) track Bedrock DeepSeek usage. Separate from AWS platform credentials.",
  });
}

/** Issue a new long workspace Agent API key */
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    label?: string;
    ensure?: boolean;
  };

  if (body.ensure) {
    const result = await ensureWorkspaceApiKey(session.sub, session.projectId);
    return NextResponse.json({ ok: true, ...result });
  }

  const issued = await issueWorkspaceApiKey({
    userId: session.sub,
    projectId: session.projectId,
    label: body.label,
  });

  return NextResponse.json({
    ok: true,
    issued: true,
    key: {
      key_id: issued.key_id,
      key_prefix: issued.key_prefix,
      label: issued.label,
      env: issued.env,
      created_at: issued.created_at,
      api_key: issued.api_key,
    },
    warning: "Copy api_key now — it will not be shown again.",
  });
}

/** Revoke a key */
export async function DELETE(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const keyId = searchParams.get("keyId");
  if (!keyId) {
    return NextResponse.json({ error: "keyId required" }, { status: 400 });
  }

  const ok = await revokeWorkspaceApiKey(session.sub, session.projectId, keyId);
  return NextResponse.json({ ok });
}
