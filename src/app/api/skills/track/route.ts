import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getSkillBySlug } from "@/lib/skills/catalog";
import { trackSkillEvent } from "@/lib/hubspot/tracking";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    event?: "skill_viewed";
    slug?: string;
  };

  const skill = body.slug ? getSkillBySlug(body.slug) : null;
  if (!skill || body.event !== "skill_viewed") {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const session = await getSessionUser();
  await trackSkillEvent({
    event: "skill_viewed",
    email: session?.email,
    userId: session?.sub,
    skillId: skill.id,
    skillSlug: skill.slug,
    skillName: skill.name,
    priceCents: skill.priceCents,
    source: "marketplace",
  });

  return NextResponse.json({ ok: true });
}
