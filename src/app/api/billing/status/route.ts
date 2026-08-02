import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getAwsInstanceProject } from "@/lib/aws/instance-registry";
import { isStripeConfigured } from "@/lib/stripe/client";
import { BILLABLE_PLANS, statusEntitles } from "@/lib/billing/plans";
import { PRICING } from "@/lib/constants";

export const runtime = "nodejs";

/** Current plan + what the UI needs to render upgrade / manage controls. */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await getAwsInstanceProject(session.sub, session.projectId).catch(
    () => null,
  );
  const plan = project?.plan ?? "starter";
  const tier = PRICING[plan as keyof typeof PRICING] ?? PRICING.starter;

  return NextResponse.json({
    ok: true,
    billing_configured: isStripeConfigured(),
    plan,
    plan_name: tier.name,
    subscription_status: project?.subscription_status ?? null,
    active: statusEntitles(project?.subscription_status),
    current_period_end: project?.subscription_current_period_end ?? null,
    can_manage: Boolean(project?.stripe_customer_id),
    upgradeable: Object.values(BILLABLE_PLANS)
      .filter((p) => p.key !== plan)
      .map((p) => ({
        key: p.key,
        name: p.name,
        price: p.amountCents / 100,
        interval: p.interval,
        description: p.description,
      })),
  });
}
