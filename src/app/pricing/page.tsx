import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PageHero } from "@/components/marketing/PageHero";
import { PricingGrid } from "@/components/marketing/PricingGrid";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Pricing — Agent by Artispreneur",
  description:
    "Starter free forever. Workspace $79/mo for the full Hermes team. Agency & Label custom.",
};

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pricing"
        title="Start free. Add agents as you grow."
        body="No credit card to begin. PAL onboarding provisions your workspace. Upgrade when you need the full specialist roster and Skills Library power."
      >
        <a
          href="/api/auth/login?signup=1&return=/onboarding"
          className="btn btn--primary btn--lg"
        >
          Start for Free
        </a>
        <Link href="/features" className="btn btn--outline btn--lg">
          Compare features
        </Link>
      </PageHero>

      <section className="section bg-white">
        <div className="container-page">
          <PricingGrid />
          <Reveal className="mx-auto mt-12 max-w-2xl text-center text-sm text-[color:var(--color-gray-mid)]">
            Skills Marketplace packs are free during launch. Paid Stripe checkout ready when you flip{" "}
            <code className="font-mono text-[12px]">SKILLS_FORCE_FREE=0</code>.
          </Reveal>
        </div>
      </section>

      <FinalCta title="Pick a plan. Keep the approvals." />
    </MarketingShell>
  );
}
