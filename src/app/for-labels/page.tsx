import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Reveal, RevealItem, RevealStagger } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "For Labels & Rosters — Artispreneur Agent",
  description:
    "Roster release calendar, rights vault, catalog management, and AI agents across every artist house.",
};

const LABEL_FEATURES = [
  {
    title: "Roster Release Calendar",
    desc: "See every artist release on one timeline. Coordinate drops, avoid conflicts, plan marketing windows.",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    title: "Rights & Catalog Vault",
    desc: "Master recordings, publishing splits, sync licenses — all in one searchable vault per artist.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Artist House Workspaces",
    desc: "Each artist gets their own workspace with their brief, approvals, and agent team. You see them all.",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    title: "Roster Director Agent",
    desc: "Your AI chief of staff that coordinates across all artist houses. Surfaces blockers, tracks progress.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Budget & Royalty Tracking",
    desc: "Track spend per artist, project, or campaign. Monitor incoming royalties across DSPs and PROs.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Reserved Compute",
    desc: "Dedicated agent capacity for your label. No queuing, no throttling, even during heavy release cycles.",
    icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
  },
];

const LABEL_USE_CASES = [
  {
    title: "New signing onboarding",
    desc: "PAL intake builds the artist brief, sets up their workspace, and provisions their agent team in minutes.",
  },
  {
    title: "Coordinated release campaigns",
    desc: "Plan 6 releases across 6 artists. Each gets personalized assets; you see the full timeline.",
  },
  {
    title: "Catalog audit & metadata cleanup",
    desc: "The Catalog Agent scans every artist discography for missing ISRCs, bad splits, and registration gaps.",
  },
  {
    title: "Sync licensing prep",
    desc: "Surface sync-ready tracks across the roster. Pre-cleared stems, one-sheets, and pitchable assets.",
  },
];

export default function ForLabelsPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative min-h-[85vh] overflow-hidden bg-[color:var(--color-bg-dark)] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-bg-dark)] via-[color:var(--color-bg-dark)]/95 to-[color:var(--color-gold)]/10" />
        <div className="container-page relative z-10 flex min-h-[85vh] flex-col justify-center pb-16 pt-32 md:pb-20 md:pt-28">
          <div className="max-w-2xl">
            <Reveal>
              <div className="mb-6 flex items-center gap-2.5">
                <Image src={brand.logo.primaryPng} alt="" width={40} height={40} className="h-10 w-10" />
                <div>
                  <p className="font-heading text-xl tracking-tight text-white">Artispreneur</p>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-gold)]">
                    For Labels
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1
                className="font-heading text-white"
                style={{ fontSize: "clamp(2.2rem, 6vw, 3.25rem)", lineHeight: 1.1 }}
              >
                Run your roster.
                <br />
                <span className="text-[color:var(--color-gold)]">Keep every house in order.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-6 max-w-lg text-[clamp(0.95rem,2vw,1.125rem)] leading-relaxed text-white/70">
                Release calendar, rights vault, catalog ops, and AI agents across every artist workspace.
                Your Roster Director sees it all — artists only see their house.
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="mailto:hello@artispreneur.com?subject=Label%20Plan" className="btn btn--primary btn--lg">
                  Talk to Sales
                </a>
                <Link href="/for-agencies" className="btn btn--outline-on-dark btn--lg">
                  Agency Features
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-10 flex gap-6 md:gap-10">
                <div>
                  <p className="font-heading text-[24px] text-[color:var(--color-gold)]">1</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">Roster Director</p>
                </div>
                <div>
                  <p className="font-heading text-[24px] text-white">7</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">Agents per artist</p>
                </div>
                <div>
                  <p className="font-heading text-[24px] text-white">Unlimited</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">Artist workspaces</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal className="mb-12 max-w-2xl">
            <p className="type-overline type-overline--crimson mb-2.5">Label Features</p>
            <h2
              className="font-heading text-[color:var(--color-black)]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              The command center for your catalog.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
              Every feature agencies get, plus roster-level tools: release calendar, rights vault,
              catalog ops, and the Roster Director agent.
            </p>
          </Reveal>

          <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LABEL_FEATURES.map((f) => (
              <RevealItem key={f.title}>
                <article className="h-full rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-gray-light)]/30 p-6 transition-colors hover:border-[color:var(--color-gold)]/30 hover:bg-white">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-gold)]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="font-heading text-lg text-[color:var(--color-black)]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">{f.desc}</p>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Use cases */}
      <section className="section bg-[color:var(--color-bg-surface)]">
        <div className="container-page">
          <Reveal className="mb-12 max-w-xl">
            <p className="type-overline mb-2.5">Use Cases</p>
            <h2
              className="font-heading text-[color:var(--color-text-primary)]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              What labels do with Agent.
            </h2>
          </Reveal>

          <RevealStagger className="grid gap-4 md:grid-cols-2">
            {LABEL_USE_CASES.map((u, i) => (
              <RevealItem key={u.title}>
                <article className="flex h-full gap-5 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-gold)]/15 font-heading text-lg text-[color:var(--color-gold)]">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-[color:var(--color-text-primary)]">{u.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-muted)]">{u.desc}</p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal className="mb-10 max-w-xl">
            <p className="type-overline type-overline--crimson mb-2.5">Plans</p>
            <h2
              className="font-heading text-[color:var(--color-black)]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Agency vs. Label — what&apos;s different?
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="overflow-hidden rounded-[14px] border border-[color:var(--color-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-gray-light)]/50">
                    <th className="px-6 py-4 text-left font-heading text-[color:var(--color-black)]">Feature</th>
                    <th className="px-6 py-4 text-center font-heading text-[color:var(--color-black)]">Agency</th>
                    <th className="px-6 py-4 text-center font-heading text-[color:var(--color-gold)]">Label</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Client/Artist Workspaces", agency: "Unlimited", label: "Unlimited" },
                    { feature: "Specialist Agents per workspace", agency: "7", label: "7" },
                    { feature: "Shared Playbooks", agency: true, label: true },
                    { feature: "Approval Routing", agency: true, label: true },
                    { feature: "Director Agent", agency: "Agency Director", label: "Roster Director" },
                    { feature: "Roster Release Calendar", agency: false, label: true },
                    { feature: "Rights & Catalog Vault", agency: false, label: true },
                    { feature: "Sync Licensing Prep", agency: false, label: true },
                    { feature: "Reserved Compute", agency: "Priority queue", label: "Dedicated capacity" },
                  ].map((row, i) => (
                    <tr key={row.feature} className={i < 8 ? "border-b border-[color:var(--color-border)]" : ""}>
                      <td className="px-6 py-3 text-[color:var(--color-gray-mid)]">{row.feature}</td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.agency === "boolean" ? (
                          row.agency ? (
                            <span className="text-[color:var(--color-success)]">Yes</span>
                          ) : (
                            <span className="text-[color:var(--color-gray-mid)]">—</span>
                          )
                        ) : (
                          <span className="text-[color:var(--color-black)]">{row.agency}</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {typeof row.label === "boolean" ? (
                          row.label ? (
                            <span className="font-semibold text-[color:var(--color-gold)]">Yes</span>
                          ) : (
                            <span className="text-[color:var(--color-gray-mid)]">—</span>
                          )
                        ) : (
                          <span className="font-semibold text-[color:var(--color-gold)]">{row.label}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 text-center">
            <a
              href="mailto:hello@artispreneur.com?subject=Label%20Plan"
              className="btn btn--primary btn--lg"
            >
              Get Label Pricing
            </a>
          </Reveal>
        </div>
      </section>

      <FinalCta
        title="Ready to run your roster?"
        body="Talk to us about Label plans. Custom pricing based on roster size and needs."
      />
    </MarketingShell>
  );
}
