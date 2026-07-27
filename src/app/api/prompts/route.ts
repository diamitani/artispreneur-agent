import { NextResponse } from "next/server";
import { listPrompts, getPrompt, renderPrompt } from "@/lib/prompts/library";
import type { SkillCategory } from "@/lib/skills/catalog";

export const runtime = "nodejs";

/**
 * Prompt Library — task-specific openers that drop straight into the compiler.
 *
 * Public: these are platform content, not workspace data, so no auth is
 * required and nothing artist-specific is returned.
 *
 * `?id=` renders one prompt; `?fill_x=y` substitutes its blanks.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    const entry = getPrompt(id);
    if (!entry) {
      return NextResponse.json({ error: `Unknown prompt: ${id}` }, { status: 404 });
    }

    const fills: Record<string, string> = {};
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith("fill_")) fills[key.slice(5)] = value;
    }

    const rendered = renderPrompt(entry, fills);
    const unfilled = entry.fills.filter((f) => !fills[f]?.trim());

    return NextResponse.json({
      ok: true,
      prompt: entry,
      rendered,
      unfilled,
      // Hand straight to the compiler.
      compile_body: { prompt: rendered },
    });
  }

  const raw = url.searchParams.get("category");
  const prompts = listPrompts((raw as SkillCategory) ?? undefined);

  return NextResponse.json({
    ok: true,
    prompts,
    featured: prompts.filter((p) => p.featured).map((p) => p.id),
    count: prompts.length,
  });
}
