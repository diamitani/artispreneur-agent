import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { setWorkspacePlan } from "@/lib/aws/instance-registry";
import { FREE_PLAN, planFromStripe, statusEntitles } from "@/lib/billing/plans";
import { hubReadGlobalJson, hubWriteGlobalJson } from "@/lib/hub/store";

export const runtime = "nodejs";

/**
 * Stripe subscription webhook.
 *
 * Unlike `api/skills/webhook`, this route has **no unsigned fallback**. That
 * route falls through to `JSON.parse(raw)` when STRIPE_WEBHOOK_SECRET is
 * missing and then writes using attacker-supplied `metadata.user_id`, which is
 * an unauthenticated cross-tenant write waiting for someone to set a Stripe key.
 * Money and entitlements only move here on a verified signature.
 */

type ProcessedLog = { ids: string[]; updated_at: string };

const PROCESSED_KEY = "billing/processed-events.json";
const PROCESSED_LIMIT = 500;

/**
 * Stripe retries deliveries, so the same event can arrive more than once.
 * Applying a plan twice is harmless, but a downgrade racing a re-delivered
 * upgrade is not — so events are applied at most once.
 */
async function alreadyProcessed(eventId: string): Promise<boolean> {
  const log = await hubReadGlobalJson<ProcessedLog>(PROCESSED_KEY).catch(() => null);
  return Boolean(log?.ids?.includes(eventId));
}

async function markProcessed(eventId: string): Promise<void> {
  const log = (await hubReadGlobalJson<ProcessedLog>(PROCESSED_KEY).catch(() => null)) ?? {
    ids: [],
    updated_at: new Date().toISOString(),
  };
  const ids = [eventId, ...log.ids.filter((id) => id !== eventId)].slice(0, PROCESSED_LIMIT);
  await hubWriteGlobalJson(PROCESSED_KEY, { ids, updated_at: new Date().toISOString() }).catch(
    (e) => console.error("[billing/webhook] could not record event id", e),
  );
}

/** Metadata is set by our own checkout route, so it is trustworthy once signed. */
function identity(meta: Stripe.Metadata | null | undefined) {
  const userId = meta?.user_id;
  const projectId = meta?.project_id;
  return userId && projectId ? { userId, projectId } : null;
}

function periodEnd(sub: Stripe.Subscription): string | null {
  const raw = (sub as unknown as { current_period_end?: number }).current_period_end;
  return typeof raw === "number" ? new Date(raw * 1000).toISOString() : null;
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    console.error("[billing/webhook] STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are both required");
    return NextResponse.json({ error: "Billing webhook is not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch {
    // Never echo Stripe's verification detail back to an unauthenticated caller.
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (await alreadyProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.mode !== "subscription") break; // skill packs are handled elsewhere

        const who = identity(s.metadata);
        const plan = s.metadata?.plan;
        if (!who || !plan) break;

        await setWorkspacePlan({
          ...who,
          plan,
          stripeCustomerId: typeof s.customer === "string" ? s.customer : null,
          stripeSubscriptionId: typeof s.subscription === "string" ? s.subscription : null,
          subscriptionStatus: "active",
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const who = identity(sub.metadata);
        if (!who) break;

        const item = sub.items?.data?.[0];
        const resolved =
          planFromStripe({
            priceId: item?.price?.id ?? null,
            amountCents: item?.price?.unit_amount ?? null,
          }) ??
          (sub.metadata?.plan as string | undefined) ??
          null;

        // A lapsed subscription drops the workspace back to free.
        const entitled = statusEntitles(sub.status);

        await setWorkspacePlan({
          ...who,
          plan: entitled && resolved ? resolved : FREE_PLAN,
          stripeCustomerId: typeof sub.customer === "string" ? sub.customer : null,
          stripeSubscriptionId: sub.id,
          subscriptionStatus: sub.status,
          currentPeriodEnd: periodEnd(sub),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const who = identity(sub.metadata);
        if (!who) break;

        await setWorkspacePlan({
          ...who,
          plan: FREE_PLAN,
          stripeSubscriptionId: null,
          subscriptionStatus: "canceled",
          currentPeriodEnd: periodEnd(sub),
        });
        break;
      }

      case "invoice.payment_failed": {
        // Log only. Stripe does not copy subscription metadata onto invoices,
        // so this event cannot reliably identify the workspace — and there is
        // nothing to do anyway: Stripe retries for days, and
        // customer.subscription.updated carries the status change (past_due,
        // then unpaid or canceled) with metadata intact. Downgrading here would
        // cut off an artist mid-dunning.
        const inv = event.data.object as Stripe.Invoice;
        console.warn("[billing/webhook] payment failed for customer", inv.customer);
        break;
      }

      default:
        break;
    }

    await markProcessed(event.id);
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[billing/webhook]", event.type, e);
    // 500 so Stripe retries rather than treating a failed apply as delivered.
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}
