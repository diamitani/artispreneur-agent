import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { loadIntakeFromDisk } from "@/lib/rostr/intake-store";

export const runtime = "nodejs";

/**
 * Fetch this workspace's compiled PAL intake.
 *
 * This route previously took `artistId` straight from the URL with no session
 * check and served the result from a process-memory map. That map is keyed by
 * artist id, and `defaultProjectId()` derives ids as
 * `artispreneur-{stage-name-slug}` — a public stage name. Anyone could read
 * another artist's Master Soul: legal name, business structure, goals,
 * finances. It also joined `artistId` into a filesystem path unsanitised.
 *
 * The id in the URL is now only accepted when it matches the caller's own
 * project, and the read goes through `loadIntakeFromDisk`, which resolves the
 * tenancy-scoped workspace rather than a raw path join.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ artistId: string }> },
) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { artistId } = await ctx.params;

  // Answer 404 rather than 403 so the route cannot be used to probe which
  // artist ids exist.
  if (artistId !== session.projectId) {
    return NextResponse.json({ ok: false, error: "Intake not found" }, { status: 404 });
  }

  const result = await loadIntakeFromDisk(session.sub, session.projectId).catch(
    () => null,
  );

  if (!result) {
    return NextResponse.json({ ok: false, error: "Intake not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, source: "workspace", result });
}
