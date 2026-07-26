import { NextResponse } from "next/server";
import { getIntake } from "@/lib/rostr/intake-store";
import { readFile } from "fs/promises";
import path from "path";

/**
 * Fetch a compiled intake by artist_id (memory first, then disk).
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ artistId: string }> },
) {
  const { artistId } = await ctx.params;
  const mem = getIntake(artistId);
  if (mem) {
    return NextResponse.json({ ok: true, source: "memory", result: mem });
  }

  try {
    const file = path.join(
      process.cwd(),
      ".data",
      "workspaces",
      artistId,
      "00-config",
      "pal-compilation.json",
    );
    const result = JSON.parse(await readFile(file, "utf8"));
    return NextResponse.json({ ok: true, source: "disk", result });
  } catch {
    return NextResponse.json({ ok: false, error: "Intake not found" }, { status: 404 });
  }
}
