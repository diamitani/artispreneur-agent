import { describe, expect, it } from "vitest";
import { PRICING } from "@/lib/constants";
import {
  BILLABLE_PLANS,
  getBillablePlan,
  isBillablePlan,
  maxProjectsFor,
  planFromStripe,
  statusEntitles,
} from "./plans";

describe("BILLABLE_PLANS", () => {
  it("charges exactly what the pricing page advertises", () => {
    // The whole point of deriving from PRICING: the page and the charge cannot
    // drift apart. 9.99 * 100 in floating point is 998.9999…, so this also
    // guards the rounding.
    expect(BILLABLE_PLANS.workspace.amountCents).toBe(999);
    expect(BILLABLE_PLANS.agency.amountCents).toBe(9900);
    expect(BILLABLE_PLANS.workspace.amountCents).toBe(
      Math.round(PRICING.workspace.price * 100),
    );
    expect(BILLABLE_PLANS.agency.amountCents).toBe(Math.round(PRICING.agency.price * 100));
  });

  it("names each plan the way the page does", () => {
    expect(BILLABLE_PLANS.workspace.name).toBe(PRICING.workspace.name);
    expect(BILLABLE_PLANS.agency.name).toBe(PRICING.agency.name);
  });
});

describe("isBillablePlan / getBillablePlan", () => {
  it("refuses the free tier", () => {
    // Checkout must reject "starter" — a $0 subscription is not a thing Stripe
    // should be asked to create.
    expect(isBillablePlan("starter")).toBe(false);
    expect(getBillablePlan("starter")).toBeNull();
  });

  it("refuses unknown and malformed keys", () => {
    for (const key of ["", "free", "WORKSPACE", "agency ", "__proto__", "constructor"]) {
      expect(isBillablePlan(key)).toBe(false);
      expect(getBillablePlan(key)).toBeNull();
    }
  });

  it("accepts the two paid tiers", () => {
    expect(getBillablePlan("workspace")?.key).toBe("workspace");
    expect(getBillablePlan("agency")?.key).toBe("agency");
  });
});

describe("statusEntitles", () => {
  it("keeps access during dunning", () => {
    // Stripe retries a failed invoice for days. Cutting off a paying artist
    // mid-retry is worse than carrying them.
    expect(statusEntitles("past_due")).toBe(true);
    expect(statusEntitles("active")).toBe(true);
    expect(statusEntitles("trialing")).toBe(true);
  });

  it("drops access once the subscription is really over", () => {
    for (const s of ["canceled", "unpaid", "incomplete", "incomplete_expired", "paused"]) {
      expect(statusEntitles(s)).toBe(false);
    }
    expect(statusEntitles(null)).toBe(false);
    expect(statusEntitles(undefined)).toBe(false);
    expect(statusEntitles("")).toBe(false);
  });
});

describe("planFromStripe", () => {
  it("maps an inline price back to its plan by amount", () => {
    expect(planFromStripe({ amountCents: 999 })).toBe("workspace");
    expect(planFromStripe({ amountCents: 9900 })).toBe("agency");
  });

  it("returns null for an amount that matches nothing", () => {
    // Better to leave the plan alone than to guess and hand someone the wrong
    // tier — in either direction.
    expect(planFromStripe({ amountCents: 4900 })).toBeNull();
    expect(planFromStripe({ amountCents: 0 })).toBeNull();
    expect(planFromStripe({})).toBeNull();
    expect(planFromStripe({ amountCents: null, priceId: null })).toBeNull();
  });

  it("ignores a Price ID that is not configured", () => {
    expect(planFromStripe({ priceId: "price_someone_elses" })).toBeNull();
  });
});

describe("maxProjectsFor", () => {
  it("holds free to one project and lets paid plans run unlimited", () => {
    expect(maxProjectsFor("starter")).toBe(1);
    expect(maxProjectsFor("workspace")).toBeNull();
    expect(maxProjectsFor("agency")).toBeNull();
  });

  it("treats a missing or unknown plan as free", () => {
    expect(maxProjectsFor(null)).toBe(1);
    expect(maxProjectsFor(undefined)).toBe(1);
    expect(maxProjectsFor("pro")).toBe(1);
  });
});
