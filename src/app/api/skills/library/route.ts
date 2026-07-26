import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { enrichOwned, markSkillInstalled } from "@/lib/skills/library-store";
import { trackSkillEvent } from "@/lib/hubspot/tracking";
import { getSkillById } from "@/lib/skills/catalog";
import { getHermesSnapshot } from "@/lib/hermes/runtime";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [skills, hermes] = await Promise.all([
    enrichOwned(session.sub, session.projectId),
    getHermesSnapshot(session.sub, session.projectId),
  ]);

  return NextResponse.json({
    ok: true,
    workspace_path: session.workspacePath,
    runtime: hermes.runtime,
    hermes,
    skills,
  });
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    skillId?: string;
    install?: boolean;
  };

  if (!body.skillId || typeof body.install !== "boolean") {
    return NextResponse.json(
      { error: "skillId + install (boolean) required" },
      { status: 400 },
    );
  }

  const ok = await markSkillInstalled(
    session.sub,
    session.projectId,
    body.skillId,
    body.install,
  );
  const skill = getSkillById(body.skillId);

  if (ok && skill && body.install) {
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

  const hermes = await getHermesSnapshot(session.sub, session.projectId);

  return NextResponse.json({
    ok,
    install: body.install,
    hermes_active: body.install,
    runtime: hermes.runtime,
    active_skills: hermes.active_skills,
  });
}
