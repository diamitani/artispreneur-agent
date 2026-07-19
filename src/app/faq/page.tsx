import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PageHero } from "@/components/marketing/PageHero";
import { FaqList } from "@/components/marketing/FaqList";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata: Metadata = {
  title: "FAQ — Agent by Artispreneur",
  description:
    "Approvals, soul.md, Hermes, Skills Library, AWS instance tenancy, and BYOK — answered straight.",
};

export default function FaqPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered."
        body="Approval-first by default. Educational on legal and tax. Your workspace stays yours."
      >
        <a
          href="/api/auth/login?signup=1&return=/onboarding"
          className="btn btn--primary btn--lg"
        >
          Start for Free
        </a>
        <Link href="/pricing" className="btn btn--outline btn--lg">
          View pricing
        </Link>
      </PageHero>

      <section className="section bg-white">
        <div className="container-page mx-auto max-w-[720px]">
          <FaqList />
        </div>
      </section>

      <FinalCta title="Still curious? Start the workspace." />
    </MarketingShell>
  );
}
