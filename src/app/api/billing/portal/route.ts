import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getStripe, appUrl } from "@/lib/stripe/client";
import { getAwsInstanceProject } from "@/lib/aws/instance-registry";

export const runtime = "nodejs";

/**
 * Stripe billing portal — what makes "cancel anytime" on the pricing page true.
 * Cancellation, card updates, and invoices all live in Stripe's hosted portal,
 * so we never handle card data.
 */
export async function POST() {
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

  const project = await getAwsInstanceProject(session.sub, session.projectId).catch(
    () => null,
  );
  // The customer id is only ever written by the signed webhook, so it cannot be
  // spoofed into pointing at someone else's Stripe customer.
  if (!project?.stripe_customer_id) {
    return NextResponse.json({ error: "No subscription to manage." }, { status: 404 });
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: project.stripe_customer_id,
      return_url: `${appUrl()}/dashboard/settings`,
    });
    return NextResponse.json({ ok: true, url: portal.url });
  } catch (e) {
    console.error("[billing/portal]", e);
    return NextResponse.json({ error: "Could not open the billing portal." }, { status: 500 });
  }
}
