import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { getSkillById } from "@/lib/skills/catalog";
import { addSkillToLibrary } from "@/lib/skills/library-store";
import { trackSkillEvent } from "@/lib/hubspot/tracking";

export const runtime = "nodejs";

/** Stripe webhook — checkout.session.completed → unlock skill + HubSpot */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  let event;
  try {
    if (secret && sig) {
      event = stripe.webhooks.constructEvent(raw, sig, secret);
    } else {
      // Dev fallback (unsigned) — do not use in production
      event = JSON.parse(raw);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      metadata?: Record<string, string>;
      customer_email?: string | null;
      amount_total?: number | null;
    };

    const meta = session.metadata || {};
    const skill = meta.skill_id ? getSkillById(meta.skill_id) : null;
    if (skill && meta.user_id && meta.project_id) {
      await addSkillToLibrary({
        userId: meta.user_id,
        projectId: meta.project_id,
        skill,
        source: "stripe",
        stripeSessionId: session.id,
      });

      await trackSkillEvent({
        event: "skill_purchased",
        email: meta.email || session.customer_email || undefined,
        userId: meta.user_id,
        skillId: skill.id,
        skillSlug: skill.slug,
        skillName: skill.name,
        priceCents: session.amount_total ?? 0,
        stripeSessionId: session.id,
        source: "stripe_webhook",
      });
    }
  }

  return NextResponse.json({ received: true });
}
