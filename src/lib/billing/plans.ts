/**
 * Billable plans.
 *
 * Amounts come from PRICING in `src/lib/constants.ts` — the same object the
 * pricing page and homepage render — so what a user is shown and what they are
 * charged cannot drift apart.
 *
 * Stripe Checkout accepts inline `price_data` with a `recurring` interval in
 * subscription mode, so no Price IDs are required to go live. If you would
 * rather manage prices in the Stripe dashboard, set STRIPE_PRICE_ARTIST /
 * STRIPE_PRICE_UNLIMITED and those take precedence with no code change.
 */

import { PRICING } from "@/lib/constants";

/** Plan keys as stored on the workspace record. */
export type PlanKey = "starter" | "workspace" | "agency";

export const FREE_PLAN: PlanKey = "starter";

export type BillablePlan = {
  key: PlanKey;
  name: string;
  /** Charge in the smallest currency unit, derived from PRICING. */
  amountCents: number;
  currency: "usd";
  interval: "month";
  description: string;
  /** Optional managed Stripe Price, overriding inline price_data. */
  priceId: string | null;
};

function centsFrom(price: number): number {
  // PRICING carries display dollars (9.99, 99). Round to avoid the classic
  // 9.99 * 100 = 998.9999… float artefact.
  return Math.round(price * 100);
}

export const BILLABLE_PLANS: Record<Exclude<PlanKey, "starter">, BillablePlan> = {
  workspace: {
    key: "workspace",
    name: PRICING.workspace.name,
    amountCents: centsFrom(PRICING.workspace.price),
    currency: "usd",
    interval: "month",
    description: PRICING.workspace.description,
    priceId: process.env.STRIPE_PRICE_ARTIST || null,
  },
  agency: {
    key: "agency",
    name: PRICING.agency.name,
    amountCents: centsFrom(PRICING.agency.price),
    currency: "usd",
    interval: "month",
    description: PRICING.agency.description,
    priceId: process.env.STRIPE_PRICE_UNLIMITED || null,
  },
};

export function isBillablePlan(key: string): key is Exclude<PlanKey, "starter"> {
  return key === "workspace" || key === "agency";
}

export function getBillablePlan(key: string): BillablePlan | null {
  return isBillablePlan(key) ? BILLABLE_PLANS[key] : null;
}

/** Stripe subscription statuses that should keep a paid plan active. */
const ENTITLING_STATUSES = new Set(["active", "trialing", "past_due"]);

/**
 * `past_due` is deliberately included: Stripe retries failed invoices for days,
 * and cutting a paying artist off mid-dunning is worse than carrying them
 * briefly. `unpaid` and `canceled` are not entitling.
 */
export function statusEntitles(status: string | null | undefined): boolean {
  return Boolean(status && ENTITLING_STATUSES.has(status));
}

/** Map a Stripe subscription back to a plan key, by Price ID or by amount. */
export function planFromStripe(input: {
  priceId?: string | null;
  amountCents?: number | null;
}): PlanKey | null {
  for (const plan of Object.values(BILLABLE_PLANS)) {
    if (plan.priceId && input.priceId && plan.priceId === input.priceId) {
      return plan.key;
    }
  }
  // Inline price_data has no stable Price ID, so fall back to the amount.
  for (const plan of Object.values(BILLABLE_PLANS)) {
    if (input.amountCents != null && input.amountCents === plan.amountCents) {
      return plan.key;
    }
  }
  return null;
}

/**
 * What each plan actually allows.
 *
 * The pricing page advertises "1 active project" on Free and unlimited on the
 * paid tiers, but nothing enforced it — every gated row in the comparison table
 * was decorative. This is the limit that is now actually applied.
 */
export const PLAN_LIMITS: Record<PlanKey, { maxProjects: number | null }> = {
  starter: { maxProjects: 1 },
  workspace: { maxProjects: null },
  agency: { maxProjects: null },
};

export function maxProjectsFor(plan: string | null | undefined): number | null {
  const key = (plan ?? "starter") as PlanKey;
  return (PLAN_LIMITS[key] ?? PLAN_LIMITS.starter).maxProjects;
}
