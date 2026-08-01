import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PageHero } from "@/components/marketing/PageHero";
import { FaqList } from "@/components/marketing/FaqList";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata: Metadata = {
  title: "FAQ — Agent by Artispreneur",
  description:
    "Approvals, privacy, Skills, agency and label modes — answered for artists, managers, and operators.",
};

export default function FaqPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="FAQ"
        title="Straight answers."
        body="Nothing ships without you. Education on deals and money — not a substitute for counsel. Your workspace stays yours."
      >
        <a
          href="/signup?next=/onboarding"
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

      <FinalCta title="Still curious? Open a workspace." />
    </MarketingShell>
  );
}
