import { getStripe } from "@/lib/stripe/client";
import { getSkillById } from "./catalog";
import { addSkillToLibrary } from "./library-store";
import { trackSkillEvent } from "@/lib/hubspot/tracking";

/** Fulfill from Stripe Checkout session (success page + webhook redundancy) */
export async function fulfillStripeSession(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) return { ok: false as const, slug: undefined };

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" && session.amount_total !== 0) {
      return { ok: false as const, slug: session.metadata?.skill_slug };
    }

    const meta = session.metadata || {};
    const skill = meta.skill_id ? getSkillById(meta.skill_id) : null;
    if (!skill || !meta.user_id || !meta.project_id) {
      return { ok: false as const, slug: meta.skill_slug };
    }

    await addSkillToLibrary({
      userId: meta.user_id,
      projectId: meta.project_id,
      skill,
      source: "stripe",
      stripeSessionId: session.id,
    });

    await trackSkillEvent({
      event: session.amount_total === 0 ? "skill_added_free" : "skill_purchased",
      email: meta.email || session.customer_email || undefined,
      userId: meta.user_id,
      skillId: skill.id,
      skillSlug: skill.slug,
      skillName: skill.name,
      priceCents: session.amount_total ?? 0,
      stripeSessionId: session.id,
      source: "success_page",
    });

    return { ok: true as const, slug: skill.slug };
  } catch {
    return { ok: false as const, slug: undefined };
  }
}
