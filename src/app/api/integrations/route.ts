import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { INTEGRATIONS } from "@/lib/integrations/registry";
import { getConnectedAccounts, isComposioConfigured } from "@/lib/composio";
import { isSpotifyConfigured } from "@/lib/mcp/music/tools";

export const runtime = "nodejs";

/**
 * Integration status for this workspace.
 *
 * Three signals combine per integration:
 *   configured  the deployment has the credential it needs
 *   connected   this artist has authorized it (Composio only)
 *   reachable   provider-level availability
 */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Composio holds the per-artist OAuth grants. A failure here must not take
  // down the whole page — we fall back to "not connected".
  let connectedApps = new Set<string>();
  let composioError: string | null = null;
  if (isComposioConfigured()) {
    try {
      const accounts = (await getConnectedAccounts(session.projectId)) as {
        appName?: string;
        appUniqueId?: string;
        status?: string;
      }[];
      connectedApps = new Set(
        accounts
          .filter((a) => (a.status ?? "ACTIVE").toUpperCase() === "ACTIVE")
          .map((a) => (a.appUniqueId ?? a.appName ?? "").toLowerCase())
          .filter(Boolean),
      );
    } catch (e) {
      composioError = e instanceof Error ? e.message : "Composio lookup failed";
    }
  }

  const items = INTEGRATIONS.map((i) => {
    const configured =
      i.provider === "affiliate"
        ? true
        : i.id === "spotify"
          ? isSpotifyConfigured()
          : i.envVar
            ? Boolean(process.env[i.envVar])
            : true;

    const connected =
      i.provider === "composio"
        ? connectedApps.has((i.handle ?? i.id).toLowerCase())
        : // Non-OAuth providers need no per-artist grant.
          configured && i.status !== "planned";

    return {
      id: i.id,
      name: i.name,
      category: i.category,
      provider: i.provider,
      status: i.status,
      purpose: i.purpose,
      handle: i.handle ?? null,
      configured,
      connected,
      /** Only Composio integrations are connectable from the UI. */
      connectable: i.provider === "composio" && configured && i.status !== "planned",
    };
  });

  return NextResponse.json({
    ok: true,
    workspace_path: session.workspacePath,
    composio_configured: isComposioConfigured(),
    composio_error: composioError,
    mcp_servers: [
      {
        id: "music",
        name: "Artispreneur Music MCP",
        endpoint: "/api/mcp/music",
        transport: "streamable-http",
      },
    ],
    counts: {
      total: items.length,
      connected: items.filter((i) => i.connected).length,
      planned: items.filter((i) => i.status === "planned").length,
    },
    integrations: items,
  });
}
