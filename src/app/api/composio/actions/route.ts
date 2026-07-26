import { getSessionUser } from "@/lib/auth";
import { isComposioConfigured } from "@/lib/composio";
import { executeAction, getActions } from "@/lib/composio/client";

export const runtime = "nodejs";

/**
 * GET /api/composio/actions?app=GMAIL — list available actions for an app
 * POST /api/composio/actions — execute an action manually (approval queue)
 */
export async function GET(req: Request) {
  if (!isComposioConfigured()) {
    return Response.json({ error: "Composio not configured" }, { status: 503 });
  }

  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const app = url.searchParams.get("app");
  if (!app) {
    return Response.json({ error: "app param required" }, { status: 400 });
  }

  const actions = await getActions(app, {
    useCase: url.searchParams.get("useCase") || undefined,
    limit: Number(url.searchParams.get("limit")) || 10,
  });

  return Response.json({ ok: true, actions });
}

export async function POST(req: Request) {
  if (!isComposioConfigured()) {
    return Response.json({ error: "Composio not configured" }, { status: 503 });
  }

  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { actionName, params } = body as {
    actionName: string;
    params: Record<string, unknown>;
  };

  if (!actionName) {
    return Response.json({ error: "actionName required" }, { status: 400 });
  }

  const result = await executeAction(actionName, session.projectId, params || {});
  return Response.json({ ok: true, result });
}
