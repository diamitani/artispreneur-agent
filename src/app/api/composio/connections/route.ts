import { getSessionUser } from "@/lib/auth";
import {
  isComposioConfigured,
  getConnectedAccounts,
  initiateConnection,
} from "@/lib/composio";

export const runtime = "nodejs";

/**
 * GET /api/composio/connections — list artist's connected accounts
 * POST /api/composio/connections — initiate a new OAuth connection
 */
export async function GET() {
  if (!isComposioConfigured()) {
    return Response.json({ error: "Composio not configured" }, { status: 503 });
  }

  const session = await getSessionUser();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await getConnectedAccounts(session.projectId);
  return Response.json({ ok: true, accounts });
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
  const { integrationId, redirectUrl } = body as {
    integrationId: string;
    redirectUrl?: string;
  };

  if (!integrationId) {
    return Response.json(
      { error: "integrationId required" },
      { status: 400 },
    );
  }

  const connection = await initiateConnection(
    session.projectId,
    integrationId,
    redirectUrl,
  );

  return Response.json({ ok: true, connection });
}
