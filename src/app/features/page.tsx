import type { Metadata } from "next";
import Link from "next/link";
import { FEATURE_BLOCKS } from "@/lib/marketing-data";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PageHero } from "@/components/marketing/PageHero";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Reveal, RevealItem, RevealStagger } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Product — Agent by Artispreneur",
  description:
    "Manager-grade Agent for independent artists, agencies, and labels. EPKs, deals, releases, outreach — drafts wait for your approval.",
};

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <PageHero
        dark
        eyebrow="Product"
        title="The business side of music — staffed."
        body="For independent artists, managers, agencies, and label operators. Your Agent drafts the EPK, the pitch list, the release plan, and the split sheet. You greenlight before anything ships."
      >
        <a
          href="/api/auth/login?signup=1&return=/onboarding"
          className="btn btn--primary btn--lg"
        >
          Start for Free
        </a>
        <Link href="/pricing" className="btn btn--outline-on-dark btn--lg">
          See pricing
        </Link>
      </PageHero>

      <section className="section bg-white">
        <div className="container-page space-y-16 md:space-y-24">
          {FEATURE_BLOCKS.map((block, i) => (
            <Reveal key={block.id}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="type-mono-label mb-3 text-[color:var(--color-crimson)]">
                    {block.eyebrow}
                  </p>
                  <h2
                    className="font-heading text-[color:var(--color-black)]"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.25rem)" }}
                  >
                    {block.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-gray-mid)] md:text-base">
                    {block.body}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {block.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-2 text-sm text-[color:var(--color-gray-dark)]"
                      >
                        <span className="font-bold text-[color:var(--color-crimson)]">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`rounded-[12px] p-8 ${
                    i % 2 === 0
                      ? "bg-[color:var(--color-bg-dark)] text-white"
                      : "border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]"
                  }`}
                >
                  <p
                    className={`font-mono text-[11px] font-semibold tracking-[0.12em] ${
                      i % 2 === 0
                        ? "text-[color:var(--color-gold)]"
                        : "text-[color:var(--color-crimson)]"
                    }`}
                  >
                    {block.eyebrow.toUpperCase()}
                  </p>
                  <p
                    className={`mt-4 font-heading text-2xl ${
                      i % 2 === 0 ? "text-white" : "text-[color:var(--color-black)]"
                    }`}
                  >
                    {block.title}
                  </p>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      i % 2 === 0 ? "text-white/50" : "text-[color:var(--color-gray-mid)]"
                    }`}
                  >
                    Live in your workspace after a short setup brief.
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section bg-[color:var(--color-bg-surface)]">
        <div className="container-page">
          <Reveal className="mx-auto mb-10 max-w-lg text-center">
            <p className="type-overline mb-2.5">Built for the industry</p>
            <h2 className="font-heading text-2xl text-[color:var(--color-black)] md:text-3xl">
              What operators actually need.
            </h2>
          </Reveal>
          <RevealStagger className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              "EPKs & press kits",
              "Venue & playlist outreach",
              "Deal red-flag review",
              "42-day release calendars",
              "Split sheets & catalog prep",
              "Royalty staging & budgets",
            ].map((item) => (
              <RevealItem key={item}>
                <div className="rounded-[10px] border border-[color:var(--color-border)] bg-white px-5 py-4 text-sm font-medium text-[color:var(--color-black)]">
                  {item}
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <FinalCta
        title="Put a team on your roster."
        body="Independent artist, agency, or label — open a workspace and run the business side like you mean it."
      />
    </MarketingShell>
  );
}
