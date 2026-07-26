import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Reveal, RevealItem, RevealStagger } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "For Agencies & Managers — Artispreneur Agent",
  description:
    "Run client artist workspaces from one command center. Shared playbooks, approval queues, and AI agents that respect artist voice.",
};

const AGENCY_FEATURES = [
  {
    title: "Client Artist Workspaces",
    desc: "Each artist gets their own workspace with their brief, approvals, and outputs. You manage from one dashboard.",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  },
  {
    title: "Shared Playbooks",
    desc: "Create playbooks once, deploy across all client workspaces. Release strategies, pitch sequences, contract templates.",
    icon: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 004 17V7a2.5 2.5 0 012.5-2.5H20v15",
  },
  {
    title: "Approval Routing",
    desc: "Drafts flow to the right person. Artist approves creative; you approve business. Nothing ships without both.",
    icon: "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  },
  {
    title: "Priority Compute",
    desc: "Agency workspaces get priority job queues and access to larger models. Your artists never wait.",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    title: "Team Roles & Permissions",
    desc: "Assign staff to specific artists. Coordinators see what they need; artists see only their workspace.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    title: "Reporting & Audit",
    desc: "Export activity logs, track hours, and show clients exactly what work was done. Full audit trail.",
    icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8",
  },
];

const AGENCY_PROOF = [
  { value: "7", label: "Specialist agents per workspace" },
  { value: "Unlimited", label: "Client artist workspaces" },
  { value: "Zero", label: "Sends without artist approval" },
  { value: "Custom", label: "Playbooks you create" },
];

const AGENCY_USE_CASES = [
  {
    title: "Artist onboarding",
    desc: "New signing? PAL intake builds their brief, sets up their workspace, and provisions agents in minutes.",
  },
  {
    title: "Release coordination",
    desc: "Manage 10 releases across 10 artists from one calendar. Agents draft assets; artists approve.",
  },
  {
    title: "Pitch campaigns",
    desc: "Create a pitch playbook once, run it for every artist. Personalized outreach, shared CRM.",
  },
  {
    title: "Contract management",
    desc: "Draft agreements with the Contract Agent. Route to artist for review. Store in their vault.",
  },
];

export default function ForAgenciesPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative min-h-[85vh] overflow-hidden bg-[color:var(--color-bg-dark)] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-bg-dark)] via-[color:var(--color-bg-dark)]/95 to-[color:var(--color-crimson)]/10" />
        <div className="container-page relative z-10 flex min-h-[85vh] flex-col justify-center pb-16 pt-32 md:pb-20 md:pt-28">
          <div className="max-w-2xl">
            <Reveal>
              <div className="mb-6 flex items-center gap-2.5">
                <Image src={brand.logo.primaryPng} alt="" width={40} height={40} className="h-10 w-10" />
                <div>
                  <p className="font-heading text-xl tracking-tight text-white">Artispreneur</p>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-gold)]">
                    For Agencies
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1
                className="font-heading text-white"
                style={{ fontSize: "clamp(2.2rem, 6vw, 3.25rem)", lineHeight: 1.1 }}
              >
                Manage your roster.
                <br />
                <span className="text-[color:var(--color-gold)]">Respect artist voice.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-6 max-w-lg text-[clamp(0.95rem,2vw,1.125rem)] leading-relaxed text-white/70">
                One command center for every client artist workspace. AI agents draft the work;
                artists approve before anything ships. Scale your agency without losing the human touch.
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="mailto:hello@artispreneur.com?subject=Agency%20Plan" className="btn btn--primary btn--lg">
                  Talk to Sales
                </a>
                <Link href="/#how" className="btn btn--outline-on-dark btn--lg">
                  See How It Works
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-10 flex gap-6 md:gap-10">
                {AGENCY_PROOF.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <p className="font-heading text-[24px] text-[color:var(--color-gold)]">{s.value}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal className="mb-12 max-w-2xl">
            <p className="type-overline type-overline--crimson mb-2.5">Agency Features</p>
            <h2
              className="font-heading text-[color:var(--color-black)]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Built for multi-artist operations.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
              Your artists keep their workspace and approvals. You get the command center, shared
              playbooks, and reporting.
            </p>
          </Reveal>

          <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGENCY_FEATURES.map((f) => (
              <RevealItem key={f.title}>
                <article className="h-full rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-gray-light)]/30 p-6 transition-colors hover:border-[color:var(--color-crimson)]/30 hover:bg-white">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-crimson)]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-crimson)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
              What agencies do with Agent.
            </h2>
          </Reveal>

          <RevealStagger className="grid gap-4 md:grid-cols-2">
            {AGENCY_USE_CASES.map((u, i) => (
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

      {/* Pricing callout */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-[16px] border border-[color:var(--color-crimson)]/20 bg-gradient-to-br from-[color:var(--color-crimson)]/5 to-transparent p-8 text-center md:p-12">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-crimson)]">
                Agency & Label Plan
              </p>
              <h2 className="mt-4 font-heading text-3xl text-[color:var(--color-black)] md:text-4xl">
                Custom pricing for your roster.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm text-[color:var(--color-gray-mid)]">
                Includes: Agency Director agent, unlimited client workspaces, shared playbooks,
                priority compute, SSO, and dedicated support.
              </p>
              <a
                href="mailto:hello@artispreneur.com?subject=Agency%20Plan"
                className="btn btn--primary btn--lg mt-8"
              >
                Talk to Sales
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta
        title="Ready to scale your roster?"
        body="Talk to us about Agency and Label plans. Custom pricing based on your needs."
      />
    </MarketingShell>
  );
}
