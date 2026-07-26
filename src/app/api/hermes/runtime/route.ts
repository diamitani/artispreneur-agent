import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getHermesSnapshot } from "@/lib/hermes/runtime";

export const runtime = "nodejs";

/** Hermes + PAL/ROSTR runtime status for Mission Control / Skills Library */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hermes = await getHermesSnapshot(session.sub, session.projectId);
  return NextResponse.json({ ok: true, hermes });
}
