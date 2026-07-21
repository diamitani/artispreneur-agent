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
    "Starter free forever. Workspace $79/mo for the full specialist team. Agency & Label for rosters.",
};

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pricing"
        title="Start free. Scale with the roster."
        body="No card to open a workspace. Upgrade when you want the full specialist team and Skills power — for one artist or a whole catalog."
      >
        <a
          href="/api/auth/login?signup=1&return=/onboarding"
          className="btn btn--primary btn--lg"
        >
          Start for Free
        </a>
        <Link href="/features" className="btn btn--outline btn--lg">
          See what you get
        </Link>
      </PageHero>

      <section className="section bg-white">
        <div className="container-page">
          <PricingGrid />
          <Reveal className="mx-auto mt-12 max-w-2xl text-center text-sm text-[color:var(--color-gray-mid)]">
            Skills Marketplace packs are free during launch. Add what you need — EPK, outreach,
            release, deals — and put them to work the same day.
          </Reveal>
        </div>
      </section>

      <FinalCta title="Pick a plan. Keep the green light." />
    </MarketingShell>
  );
}
