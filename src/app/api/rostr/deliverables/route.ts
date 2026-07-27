import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import { hubReadText } from "@/lib/hub/store";
import { listTaskHistory } from "@/lib/rostr/reference-hub";

export const runtime = "nodejs";

const ALLOWED_PREFIXES = [
  "04-deliverables/",
  "03-agent-workflows/",
  "00-config/",
];

/**
 * List produced deliverables, or read one with `?path=`.
 *
 * Reads are constrained to the caller's own workspace scope and to known
 * artifact prefixes, and path traversal is rejected — a deliverable path can
 * never be used to reach outside the workspace.
 */
export async function GET(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scope = agentProjectScope(session.sub, session.projectId);
  const path = new URL(req.url).searchParams.get("path");

  if (path) {
    if (path.includes("..") || path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    if (!ALLOWED_PREFIXES.some((p) => path.startsWith(p))) {
      return NextResponse.json({ error: "Path not readable" }, { status: 403 });
    }

    const content = await hubReadText(scope, path).catch(() => null);
    if (content === null) {
      return NextResponse.json({ error: `Not found: ${path}` }, { status: 404 });
    }
    return NextResponse.json({ ok: true, path, content });
  }

  // Artifact records from the Reference Hub double as the deliverable index.
  const history = await listTaskHistory(scope, 100);
  const deliverables = history
    .filter((r): r is Extract<typeof r, { type: "artifact" }> => r.type === "artifact")
    .map((r) => ({ path: r.path, kind: r.kind, summary: r.summary, at: r.at }));

  return NextResponse.json({ ok: true, deliverables, count: deliverables.length });
}
