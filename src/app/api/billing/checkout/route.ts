import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { getStripe, appUrl } from "@/lib/stripe/client";
import { getBillablePlan } from "@/lib/billing/plans";
import { getAwsInstanceProject } from "@/lib/aws/instance-registry";
import { statusEntitles } from "@/lib/billing/plans";

export const runtime = "nodejs";

const Body = z.object({ plan: z.string().min(1) });

/**
 * Start a subscription Checkout session for the signed-in workspace.
 *
 * Uses inline `price_data` so no Stripe Price IDs are needed to go live; a
 * configured STRIPE_PRICE_* env var takes precedence via getBillablePlan().
 */
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing is not configured on this deployment." },
      { status: 503 },
    );
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A plan is required." }, { status: 400 });
  }

  // Rejects "starter" and anything unrecognised — the amount is never taken
  // from the request.
  const plan = getBillablePlan(parsed.data.plan);
  if (!plan) {
    return NextResponse.json({ error: "That plan cannot be purchased." }, { status: 400 });
  }

  const project = await getAwsInstanceProject(session.sub, session.projectId).catch(
    () => null,
  );

  // Already subscribed — send them to the portal rather than opening a second
  // subscription against the same workspace.
  if (project && statusEntitles(project.subscription_status)) {
    return NextResponse.json(
      { error: "You already have an active subscription.", portal: "/api/billing/portal" },
      { status: 409 },
    );
  }

  const base = appUrl();

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Ties the payment back to the workspace without trusting the client.
      client_reference_id: session.sub,
      customer: project?.stripe_customer_id || undefined,
      customer_email: project?.stripe_customer_id ? undefined : session.email,
      line_items: [
        plan.priceId
          ? { price: plan.priceId, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: plan.currency,
                unit_amount: plan.amountCents,
                recurring: { interval: plan.interval },
                product_data: { name: `Artispreneur ${plan.name}`, description: plan.description },
              },
            },
      ],
      subscription_data: {
        metadata: { user_id: session.sub, project_id: session.projectId, plan: plan.key },
      },
      metadata: { user_id: session.sub, project_id: session.projectId, plan: plan.key },
      success_url: `${base}/dashboard/settings?upgraded=1`,
      cancel_url: `${base}/pricing?canceled=1`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ ok: true, url: checkout.url });
  } catch (e) {
    console.error("[billing/checkout]", e);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
