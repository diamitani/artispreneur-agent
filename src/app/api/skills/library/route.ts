import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { enrichOwned, markSkillInstalled } from "@/lib/skills/library-store";
import { trackSkillEvent } from "@/lib/hubspot/tracking";
import { getSkillById } from "@/lib/skills/catalog";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await enrichOwned(session.sub, session.projectId);
  return NextResponse.json({
    ok: true,
    workspace_path: session.workspacePath,
    skills,
  });
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { skillId?: string; install?: boolean };
  if (!body.skillId || !body.install) {
    return NextResponse.json({ error: "skillId + install required" }, { status: 400 });
  }

  const ok = await markSkillInstalled(session.sub, session.projectId, body.skillId);
  const skill = getSkillById(body.skillId);
  if (ok && skill) {
    await trackSkillEvent({
      event: "skill_installed",
      email: session.email,
      userId: session.sub,
      skillId: skill.id,
      skillSlug: skill.slug,
      skillName: skill.name,
      priceCents: 0,
      source: "library",
    });
  }

  return NextResponse.json({ ok });
}
