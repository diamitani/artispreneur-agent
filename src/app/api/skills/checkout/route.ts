import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  effectivePriceCents,
  getSkillBySlug,
  isSkillFree,
} from "@/lib/skills/catalog";
import { addSkillToLibrary, ownsSkill } from "@/lib/skills/library-store";
import { appUrl, getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { trackSkillEvent } from "@/lib/hubspot/tracking";

export const runtime = "nodejs";

/**
 * Start checkout for a skill.
 * Free skills: claim immediately (still tracks HubSpot).
 * Paid: Stripe Checkout Session.
 * If Stripe unset and free: claim. If paid and Stripe unset: 503.
 */
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Sign in required", login: "/signin?next=/skills" }, { status: 401 });
  }

  const body = (await req.json()) as { slug?: string };
  const skill = body.slug ? getSkillBySlug(body.slug) : null;
  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  if (await ownsSkill(session.sub, session.projectId, skill.id)) {
    return NextResponse.json({
      ok: true,
      alreadyOwned: true,
      redirect: `/skills/library?owned=${skill.slug}`,
    });
  }

  const price = effectivePriceCents(skill);

  await trackSkillEvent({
    event: "skill_checkout_started",
    email: session.email,
    userId: session.sub,
    skillId: skill.id,
    skillSlug: skill.slug,
    skillName: skill.name,
    priceCents: price,
    source: "marketplace",
  });

  // Free path (launch default)
  if (isSkillFree(skill) || price <= 0) {
    // Prefer Stripe $0 checkout when configured (keeps payment method on file for later)
    const stripe = getStripe();
    const useStripeFree = isStripeConfigured() && process.env.SKILLS_STRIPE_FREE_CHECKOUT === "1";

    if (useStripeFree && stripe) {
      const checkout = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: session.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: 0,
              product_data: {
                name: skill.name,
                description: skill.tagline,
                metadata: { skill_id: skill.id, skill_slug: skill.slug },
              },
            },
          },
        ],
        success_url: `${appUrl()}/skills/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl()}/skills/${skill.slug}?canceled=1`,
        metadata: {
          skill_id: skill.id,
          skill_slug: skill.slug,
          user_id: session.sub,
          project_id: session.projectId,
          email: session.email,
        },
      });
      return NextResponse.json({ ok: true, url: checkout.url, mode: "stripe_free" });
    }

    await addSkillToLibrary({
      userId: session.sub,
      projectId: session.projectId,
      skill,
      source: "free_claim",
    });

    await trackSkillEvent({
      event: "skill_added_free",
      email: session.email,
      userId: session.sub,
      skillId: skill.id,
      skillSlug: skill.slug,
      skillName: skill.name,
      priceCents: 0,
      source: "marketplace",
    });

    return NextResponse.json({
      ok: true,
      claimed: true,
      redirect: `/skills/success?slug=${skill.slug}&free=1`,
    });
  }

  // Paid path
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured", hint: "Set STRIPE_SECRET_KEY" },
      { status: 503 },
    );
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: price,
          product_data: {
            name: skill.name,
            description: skill.tagline,
            metadata: { skill_id: skill.id, skill_slug: skill.slug },
          },
        },
      },
    ],
    success_url: `${appUrl()}/skills/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl()}/skills/${skill.slug}?canceled=1`,
    metadata: {
      skill_id: skill.id,
      skill_slug: skill.slug,
      user_id: session.sub,
      project_id: session.projectId,
      email: session.email,
    },
  });

  return NextResponse.json({ ok: true, url: checkout.url, mode: "stripe" });
}
