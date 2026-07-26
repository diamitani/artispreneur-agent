import type { Metadata } from "next";
import Link from "next/link";
import { ROI_COMPARISON } from "@/lib/marketing-data";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PageHero } from "@/components/marketing/PageHero";
import { PricingGrid } from "@/components/marketing/PricingGrid";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Reveal, RevealStagger, RevealItem } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Pricing — Agent by Artispreneur",
  description:
    "Starter free forever. Workspace $79/mo for the full specialist team. Agency & Label for rosters.",
};

const PRICING_FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your workspace settings. You keep access through the billing period, then drop to Starter. Your data stays.",
  },
  {
    q: "What happens to my work if I downgrade?",
    a: "Everything stays in your workspace. You lose access to Pro agents and larger models, but your outputs, briefs, and history remain.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes — annual plans save 20%. Pay $758/year instead of $948 ($79 × 12). Email hello@artispreneur.com to switch.",
  },
  {
    q: "Can I use my own API keys?",
    a: "Yes. Workspace and higher plans support BYOK. Connect your Anthropic or OpenAI keys and use your own token budget.",
  },
];

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
          Build My Agent Team
        </a>
        <Link href="/features" className="btn btn--outline btn--lg">
          See What You Get
        </Link>
      </PageHero>

      <section className="section bg-white">
        <div className="container-page">
          <PricingGrid />

          {/* Annual discount callout */}
          <Reveal className="mx-auto mt-10 max-w-xl">
            <div className="rounded-[12px] border border-[color:var(--color-gold)]/30 bg-[color:var(--color-gold)]/5 p-5 text-center">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-gold)]">
                Annual discount
              </p>
              <p className="mt-2 font-heading text-xl text-[color:var(--color-black)]">
                Save 20% with annual billing
              </p>
              <p className="mt-1 text-sm text-[color:var(--color-gray-mid)]">
                Workspace: $758/year (vs $948). Email{" "}
                <a href="mailto:hello@artispreneur.com?subject=Annual%20billing" className="font-semibold text-[color:var(--color-gold)]">
                  hello@artispreneur.com
                </a>{" "}
                to switch.
              </p>
            </div>
          </Reveal>

          <Reveal className="mx-auto mt-8 max-w-2xl text-center text-sm text-[color:var(--color-gray-mid)]">
            Skills Marketplace packs are free during launch. Add what you need — EPK, outreach,
            release, deals — and put them to work the same day.
          </Reveal>
        </div>
      </section>

      {/* ROI comparison */}
      <section className="section bg-[color:var(--color-bg-surface)]">
        <div className="container-page">
          <Reveal className="mb-10 max-w-xl">
            <p className="type-overline mb-2.5">The Math</p>
            <h2
              className="font-heading text-[color:var(--color-text-primary)]"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}
            >
              What you&apos;d pay without Agent.
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-card)]">
              {ROI_COMPARISON.map((row, i) => (
                <div
                  key={row.task}
                  className={`flex flex-wrap items-center justify-between gap-4 px-6 py-4 ${
                    i < ROI_COMPARISON.length - 1 ? "border-b border-[color:var(--color-border)]" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-[color:var(--color-text-primary)]">{row.task}</span>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-[color:var(--color-text-muted)] line-through opacity-60">{row.without}</span>
                    <span className="rounded bg-[color:var(--color-success)]/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-[color:var(--color-success)]">
                      Included
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="section bg-white">
        <div className="container-page mx-auto max-w-[720px]">
          <Reveal>
            <h2
              className="font-heading mb-9 text-center text-[color:var(--color-black)]"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}
            >
              Pricing questions
            </h2>
          </Reveal>
          <RevealStagger className="space-y-4">
            {PRICING_FAQS.map((faq) => (
              <RevealItem key={faq.q}>
                <details className="group rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-gray-light)]/30 px-6 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-heading text-base text-[color:var(--color-black)]">
                    {faq.q}
                    <span className="ml-4 text-[color:var(--color-gray-mid)] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">{faq.a}</p>
                </details>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* B2B callout */}
      <section className="section bg-[color:var(--color-bg-surface)]">
        <div className="container-page">
          <Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              <Link
                href="/for-agencies"
                className="group rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 transition-colors hover:border-[color:var(--color-crimson)]/40"
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-crimson)]">
                  For Agencies
                </p>
                <h3 className="mt-3 font-heading text-xl text-[color:var(--color-text-primary)]">
                  Managing multiple artists?
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
                  Client workspaces, shared playbooks, approval routing. Custom pricing for your roster.
                </p>
                <span className="mt-4 inline-block font-mono text-[12px] font-semibold text-[color:var(--color-crimson)] group-hover:underline">
                  Learn more
                </span>
              </Link>
              <Link
                href="/for-labels"
                className="group rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 transition-colors hover:border-[color:var(--color-gold)]/40"
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-gold)]">
                  For Labels
                </p>
                <h3 className="mt-3 font-heading text-xl text-[color:var(--color-text-primary)]">
                  Running a roster?
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
                  Release calendar, rights vault, catalog ops. Everything agencies get plus roster-level tools.
                </p>
                <span className="mt-4 inline-block font-mono text-[12px] font-semibold text-[color:var(--color-gold)] group-hover:underline">
                  Learn more
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta title="Pick a plan. Keep the green light." />
    </MarketingShell>
  );
}
