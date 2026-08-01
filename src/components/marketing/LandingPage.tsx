import Link from "next/link";
import {
  AGENT_CARDS,
  COURSE_CHIPS,
  HOW_STEPS,
  MODE_CARDS,
  PROBLEM_PAINS,
  ROI_COMPARISON,
  SOCIAL_PROOF,
  TRUST_POINTS,
} from "@/lib/marketing-data";
import { SKILLS_CATALOG } from "@/lib/skills/catalog";
import { MarketingShell } from "./MarketingShell";
import { NewHeroChat } from "./NewHeroChat";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import { PricingGrid } from "./PricingGrid";
import { FaqList } from "./FaqList";
import { FinalCta } from "./FinalCta";

export function LandingPage() {
  return (
    <MarketingShell>
      <NewHeroChat />
      <ProofStrip />
      <HowSection />
      <AgentsSection />
      <RoiComparisonSection />
      <DashboardPreviewSection />
      <AcademySection />
      <ProblemSection />
      <ApprovalSection />
      <ModesSection />
      <SkillsTeaser />
      <PricingTeaser />
      <FaqTeaser />
      <FinalCta />
    </MarketingShell>
  );
}

/* ─── Proof strip ──────────────────────────────────────────────────────────── */
function ProofStrip() {
  return (
    <section className="bg-white">
      <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:gap-4 md:py-12">
        {SOCIAL_PROOF.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05} className="text-center md:text-left">
            <p className="font-heading text-3xl text-[color:var(--color-crimson)] md:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[#aaa]">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── Agent skills — full detail ───────────────────────────────────────────── */
function AgentsSection() {
  return (
    <section id="agents" className="section bg-white">
      <div className="container-page">
        <Reveal className="mb-4 max-w-2xl">
          <p className="type-overline mb-2.5">Your AI Team</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Seven specialists.
            <br />
            <span className="text-[color:var(--color-gold)]">One command center.</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[color:var(--color-text-muted)]">
            Each agent owns a core function of your music business. They draft; you approve.
            Nothing ships without your sign-off.
          </p>
        </Reveal>

        {/* Master agent banner */}
        <Reveal delay={0.05} className="mb-5 mt-10">
          <div className="relative overflow-hidden rounded-[14px] border border-[color:var(--color-gold)] bg-[color:var(--color-card)] px-7 py-6">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[color:var(--color-gold)]/[0.06]"
            />
            <div className="relative flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-gold)]/15">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-[color:var(--color-text-primary)]">Your Master Agent</h3>
                    <p className="font-mono text-[10px] text-[color:var(--color-gold)]">EVERY WORKSPACE · APPROVAL-FIRST</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[color:var(--color-text-muted)]">
                  Manager-grade chief of staff. Works from your brief, routes the right specialist,
                  drafts the package, and never ships without your sign-off — the desk that talks to
                  the whole team.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Route work to specialists", "Draft multi-step plans", "Keep your brief current", "Approval queue", "Skills playbooks"].map((cap) => (
                    <span key={cap} className="rounded-full border border-[color:var(--color-border)] px-2.5 py-0.5 font-mono text-[10px] text-[color:var(--color-text-dim)]">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
              <span className="shrink-0 rounded-lg bg-[color:var(--color-gold)] px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.1em] text-[color:var(--color-black)]">
                ALWAYS ON
              </span>
            </div>
          </div>
        </Reveal>

        {/* Specialist grid */}
        <RevealStagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mt-4">
          {AGENT_CARDS.map((a) => (
            <RevealItem key={a.name}>
              <article className="group h-full rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 transition-all duration-200 hover:border-[color:var(--color-gold)]/60 hover:bg-[color:var(--color-card)]">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-card)] group-hover:bg-[color:var(--color-gold)]/10 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      {a.icon.split(" M").map((seg, i) => (
                        <path key={i} d={i === 0 ? seg : "M" + seg} />
                      ))}
                    </svg>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-[9.5px] font-bold tracking-wider ${
                    a.gate === "FREE"
                      ? "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]"
                      : "bg-[color:var(--color-gold)]/10 text-[color:var(--color-gold)]"
                  }`}>
                    {a.gate}
                  </span>
                </div>
                <h3 className="font-heading text-[17px] text-[color:var(--color-text-primary)] mb-2">
                  {a.name}
                </h3>
                <p className="text-sm leading-relaxed text-[color:var(--color-text-muted)]">{a.desc}</p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

/* ─── ROI Comparison ───────────────────────────────────────────────────────── */
function RoiComparisonSection() {
  return (
    <section className="section bg-[color:var(--color-bg-page)]">
      <div className="container-page">
        <Reveal className="mb-12 max-w-2xl">
          <p className="type-overline mb-2.5">The Math</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            What artists pay
            <br />
            <span className="text-[color:var(--color-gold)]">without an agent team.</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[color:var(--color-text-muted)]">
            The industry standard: hire a manager, lawyer, accountant, and publicist separately.
            Or get all of it in one workspace for $79/month.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-card)]">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-4 md:grid-cols-4">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-dim)]">
                Service
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-dim)]">
                Industry Rate
              </div>
              <div className="hidden font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-gold)] md:block">
                With Agent
              </div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-success)]">
                You Save
              </div>
            </div>

            {/* Rows */}
            {ROI_COMPARISON.map((row, i) => (
              <div
                key={row.task}
                className={`grid grid-cols-3 gap-4 px-6 py-4 md:grid-cols-4 ${
                  i < ROI_COMPARISON.length - 1 ? "border-b border-[color:var(--color-border)]" : ""
                }`}
              >
                <div className="text-sm font-medium text-[color:var(--color-text-primary)]">
                  {row.task}
                </div>
                <div className="text-sm text-[color:var(--color-text-muted)] line-through opacity-70">
                  {row.without}
                </div>
                <div className="hidden text-sm font-semibold text-[color:var(--color-gold)] md:block">
                  {row.withAgent}
                </div>
                <div className="text-sm font-semibold text-[color:var(--color-success)]">
                  {row.savings}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-gold)]/30 bg-[color:var(--color-gold)]/5 px-6 py-5">
              <div>
                <p className="font-heading text-xl text-[color:var(--color-text-primary)]">
                  Total potential savings:{" "}
                  <span className="text-[color:var(--color-gold)]">$40,000+/year</span>
                </p>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  Workspace plan: $79/month ($948/year)
                </p>
              </div>
              <a href="/signup?next=/onboarding" className="btn btn--primary btn--md">
                Start Saving Now
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Dashboard preview ────────────────────────────────────────────────────── */
function DashboardPreviewSection() {
  return (
    <section className="section bg-[color:var(--color-surface)] overflow-hidden">
      <div className="container-page">
        <Reveal className="mb-12 max-w-xl">
          <p className="type-overline mb-2.5">Mission Control</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Your business,
            <br />
            <span className="text-[color:var(--color-gold)]">on one screen.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--color-text-muted)]">
            The dashboard surfaces your roadmap, agent outputs, and approval queue — while
            Your Agent runs tasks in the background.
          </p>
          <a
            href="/signup?next=/onboarding"
            className="btn btn--primary btn--md mt-7 inline-flex"
          >
            Open your workspace
          </a>
        </Reveal>

        {/* Dashboard mockup */}
        <Reveal delay={0.1}>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-page)] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <div className="mx-3 flex-1 rounded-md bg-[color:var(--color-surface)] px-3 py-1 font-mono text-[10px] text-[color:var(--color-text-dim)]">
                agent.artispreneur.com/dashboard
              </div>
            </div>
            {/* Dashboard layout */}
            <div className="flex h-[480px]">
              {/* Sidebar */}
              <div className="w-52 shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-card)] flex flex-col">
                <div className="flex items-center gap-2.5 border-b border-[color:var(--color-border)] px-4 py-3.5">
                  <div className="h-7 w-7 rounded-lg bg-[color:var(--color-gold)]/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <span className="font-heading text-[13px] text-[color:var(--color-text-primary)]">Artispreneur</span>
                </div>
                <nav className="flex-1 space-y-0.5 px-2 py-3">
                  {[
                    { label: "Home", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", active: true },
                    { label: "Master Agent", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", active: false },
                    { label: "Business Center", icon: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z", active: false },
                    { label: "Brand Center", icon: "M12 2a10 10 0 100 20c1.1 0 2-.9 2-2v-.5c0-.3.2-.5.5-.5H17a3 3 0 000-6h-1.4A10 10 0 0012 2z", active: false },
                    { label: "Booking & CRM", icon: "M22 2L11 13 M22 2l-7 20-4-9-9-4z", active: false },
                    { label: "Academy", icon: "M22 10v6M2 10l10-5 10 5-10 5z", active: false },
                    { label: "Cataba Catalog", icon: "M9 18V5l12-2v13", active: false },
                    { label: "Skills Library", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z", active: false },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${item.active ? "bg-[color:var(--color-gold)]/10 text-[color:var(--color-gold)]" : "text-[color:var(--color-text-dim)]"}`}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                      <span className="text-[11px] font-medium truncate">{item.label}</span>
                    </div>
                  ))}
                </nav>
                <div className="border-t border-[color:var(--color-border)] p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[color:var(--color-gold)]/20 flex items-center justify-center font-heading text-[10px] text-[color:var(--color-gold)]">A</div>
                    <div>
                      <p className="text-[11px] font-semibold text-[color:var(--color-text-primary)]">Artist</p>
                      <p className="text-[9px] text-[color:var(--color-text-dim)]">Workspace Plan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 overflow-hidden p-5">
                {/* Welcome banner */}
                <div className="relative mb-4 overflow-hidden rounded-xl bg-[color:var(--color-card)] border border-[color:var(--color-border)] px-5 py-4">
                  <div aria-hidden className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-[color:var(--color-gold)]/[0.06]" />
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[color:var(--color-gold)] mb-1">Welcome back</p>
                  <h4 className="font-heading text-base text-[color:var(--color-text-primary)]">Your Dashboard</h4>
                  <p className="text-[11px] text-[color:var(--color-text-dim)] mt-0.5">Art Means Business. 4 tasks awaiting action.</p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-lg bg-[color:var(--color-gold)] px-3 py-1 font-mono text-[9px] font-bold text-[color:var(--color-black)]">Continue Onboarding</span>
                    <span className="rounded-lg border border-[color:var(--color-border)] px-3 py-1 font-mono text-[9px] text-[color:var(--color-text-dim)]">Open workspace</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Quick links */}
                  <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
                    <p className="font-heading text-[12px] text-[color:var(--color-text-primary)] mb-3">Quick Links</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Business Center", color: "#c9a227" },
                        { label: "Brand Center", color: "#c9a227" },
                        { label: "Booking & CRM", color: "#c9a227" },
                        { label: "Academy", color: "#c9a227" },
                      ].map((q) => (
                        <div key={q.label} className="rounded-lg border border-[color:var(--color-border)] p-2.5">
                          <div className="mb-1.5 h-5 w-5 rounded bg-[color:var(--color-gold)]/15" />
                          <p className="text-[10px] font-semibold text-[color:var(--color-text-primary)]">{q.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent outputs */}
                  <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
                    <p className="font-heading text-[12px] text-[color:var(--color-text-primary)] mb-3">Recent Outputs</p>
                    {[
                      "Artist Business Plan Draft",
                      "EIN Application Summary",
                      "Social Media Strategy",
                    ].map((label) => (
                      <div key={label} className="flex items-center gap-2 border-b border-[color:var(--color-border)] py-2 last:border-0">
                        <div className="h-6 w-6 shrink-0 rounded bg-[color:var(--color-surface)] flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-dim)" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
                        </div>
                        <p className="flex-1 truncate text-[10px] text-[color:var(--color-text-muted)]">{label}</p>
                        <span className="shrink-0 rounded bg-[color:var(--color-surface)] px-1.5 py-0.5 font-mono text-[8px] text-[color:var(--color-text-dim)]">Doc</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Roadmap */}
                <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-heading text-[12px] text-[color:var(--color-text-primary)]">Your Roadmap</p>
                    <span className="rounded bg-[color:var(--color-gold)]/15 px-2 py-0.5 font-mono text-[8px] font-bold text-[color:var(--color-gold)]">4 Action Required</span>
                  </div>
                  {[
                    { label: "Complete Artist Onboarding", status: "in-progress", priority: "#ef4444" },
                    { label: "Register EIN", status: "pending", priority: "#ef4444" },
                    { label: "Set up Business Bank Account", status: "pending", priority: "#d97706" },
                    { label: "Upload music catalogue", status: "complete", priority: "#71717a" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-2.5 border-b border-[color:var(--color-border)] py-2 last:border-0">
                      <div className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${t.status === "complete" ? "border-[#22c55e] bg-[#22c55e]" : "border-[color:var(--color-border)]"}`}>
                        {t.status === "complete" && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                      <span className={`flex-1 text-[10px] font-medium ${t.status === "complete" ? "text-[color:var(--color-text-dim)] line-through" : "text-[color:var(--color-text-primary)]"}`}>{t.label}</span>
                      <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: t.priority }} />
                      <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[8px] font-semibold ${
                        t.status === "in-progress" ? "bg-blue-900/30 text-blue-400" :
                        t.status === "complete" ? "bg-green-900/30 text-green-400" :
                        "bg-[color:var(--color-surface)] text-[color:var(--color-text-dim)]"
                      }`}>
                        {t.status === "in-progress" ? "In Progress" : t.status === "complete" ? "Complete" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Problem ──────────────────────────────────────────────────────────────── */
function ProblemSection() {
  return (
    <section className="section bg-[color:var(--color-bg-page)]">
      <div className="container-page">
        <Reveal className="mb-12 max-w-xl md:ml-0">
          <p className="type-overline mb-2.5">The problem</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            The business side eats the art.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-muted)] md:text-base">
            You didn&apos;t start making music to become a part-time ops manager. Agent by
            Artispreneur is the operating system for the work that pays.
          </p>
        </Reveal>
        <RevealStagger className="grid gap-0 md:grid-cols-3">
          {PROBLEM_PAINS.map((p, i) => (
            <RevealItem key={p.title}>
              <article
                className={`h-full px-6 py-7 md:px-7 ${
                  i > 0 ? "border-t border-[color:var(--color-border)] md:border-l md:border-t-0" : ""
                }`}
              >
                <p className="type-mono-label mb-3 text-[color:var(--color-gold)]">{p.label}</p>
                <h3 className="font-heading text-xl text-[color:var(--color-text-primary)]">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--color-text-muted)]">
                  {p.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

/* ─── Approval ─────────────────────────────────────────────────────────────── */
function ApprovalSection() {
  return (
    <section className="section bg-[color:var(--color-surface)]">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <p className="type-mono-label mb-4 text-[color:var(--color-gold)]">
            Approval before impact
          </p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
          >
            Your agents draft.
            <br />
            <span className="text-[color:var(--color-gold)]">Only you send.</span>
          </h2>
          <ul className="mt-6 space-y-3">
            {TRUST_POINTS.map((t) => (
              <li
                key={t}
                className="flex gap-2.5 text-sm leading-relaxed text-[color:var(--color-text-muted)]"
              >
                <span className="font-bold text-[color:var(--color-gold)] shrink-0">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 md:translate-y-4">
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-dim)]">
              Approval queue
            </p>
            {[
              { title: "Venue outreach — Baby's All Right", status: "Ready", color: "text-[color:var(--color-success)]" },
              { title: "EPK one-sheet v2", status: "Ready", color: "text-[color:var(--color-success)]" },
              { title: "Split sheet — producer deal", status: "Needs review", color: "text-[color:var(--color-gold)]" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-b border-[color:var(--color-border)] py-3 last:border-0"
              >
                <span className="text-sm font-medium text-[color:var(--color-text-primary)]">
                  {item.title}
                </span>
                <span className={`shrink-0 rounded bg-[color:var(--color-surface)] px-2 py-0.5 font-mono text-[10px] font-semibold ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
            <p className="mt-4 font-mono text-[11px] text-[color:var(--color-text-dim)]">
              audit: approved by you · 2 of 3 drafts · PR &amp; Outreach Agent
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Modes ────────────────────────────────────────────────────────────────── */
function ModesSection() {
  return (
    <section className="section bg-[color:var(--color-bg-page)]">
      <div className="container-page">
        <Reveal className="mx-auto mb-14 max-w-[560px] text-center">
          <p className="type-overline mb-2.5">Modes</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
          >
            Artist. Agency. Label.
            <br />
            <span className="text-[color:var(--color-gold)]">One platform, three ways to run it.</span>
          </h2>
        </Reveal>
        <RevealStagger className="grid gap-4 md:grid-cols-3">
          {MODE_CARDS.map((m, i) => (
            <RevealItem key={m.tag}>
              <article className={`h-full rounded-[14px] p-7 transition-all duration-200 ${
                i === 1
                  ? "border border-[color:var(--color-gold)] bg-[color:var(--color-card)]"
                  : "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--color-gold)]/50 hover:bg-[color:var(--color-card)]"
              }`}>
                <p className="type-mono-label mb-3.5 text-[color:var(--color-gold)]">{m.tag}</p>
                <h3 className="font-heading text-xl text-[color:var(--color-text-primary)]">{m.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--color-text-muted)]">{m.desc}</p>
                <p className="mt-5 font-mono text-[12px] text-[color:var(--color-text-dim)]">{m.foot}</p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

/* ─── How it works ─────────────────────────────────────────────────────────── */
function HowSection() {
  return (
    <section id="how" className="section bg-[color:var(--color-surface)]">
      <div className="container-page">
        <Reveal className="mx-auto mb-14 max-w-[560px] md:ml-0 md:max-w-lg md:text-left">
          <p className="type-overline mb-2.5">The Process</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            From sign-up to a working business team
          </h2>
        </Reveal>
        <RevealStagger className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((s, i) => (
            <RevealItem key={s.num}>
              <article
                className={`px-7 py-6 ${
                  i === 0
                    ? ""
                    : "border-t border-[color:var(--color-border)] sm:border-t-0 lg:border-l"
                }`}
              >
                <p className="type-mono-label mb-3.5 text-[color:var(--color-gold)]">{s.num}</p>
                <h3 className="text-[15px] font-bold text-[color:var(--color-text-primary)]">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">
                  {s.desc}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

/* ─── Skills teaser ────────────────────────────────────────────────────────── */
function SkillsTeaser() {
  const featured = SKILLS_CATALOG.filter((s) => s.featured || s.popular).slice(0, 3);
  return (
    <section id="skills" className="section bg-[color:var(--color-bg-page)]">
      <div className="container-page">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-md">
            <p className="type-overline mb-2.5">Skills Marketplace</p>
            <h2
              className="font-heading text-[color:var(--color-text-primary)]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
            >
              Digital skills. Instant install.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-muted)]">
              Playbook packs you add to your workspace and put to work on the next ask — EPK,
              release strategy, outreach, rights management.
            </p>
          </div>
          <Link href="/skills" className="btn btn--primary btn--md">
            Open marketplace
          </Link>
        </Reveal>
        <RevealStagger className="grid gap-4 md:grid-cols-3">
          {featured.map((s) => (
            <RevealItem key={s.id}>
              <Link
                href={`/skills/${s.slug}`}
                className="group block overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-gold)]/60"
              >
                <p className="font-mono text-[10px] font-semibold tracking-wider text-[color:var(--color-gold)]">
                  FREE · DIGITAL DOWNLOAD
                </p>
                <h3 className="font-heading mt-3 text-[19px] text-[color:var(--color-text-primary)]">{s.name}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">{s.tagline}</p>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

/* ─── Pricing teaser ───────────────────────────────────────────────────────── */
function PricingTeaser() {
  return (
    <section id="pricing" className="section bg-[color:var(--color-surface)]">
      <div className="container-page">
        <Reveal className="mx-auto mb-12 max-w-[520px] text-center">
          <p className="type-overline mb-2.5">Pricing</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
          >
            Start free. Scale when the roster grows.
          </h2>
          <p className="mt-3 text-sm text-[color:var(--color-text-muted)]">
            Full detail on{" "}
            <Link href="/pricing" className="font-semibold text-[color:var(--color-gold)] hover:text-[color:var(--color-gold-light)]">
              the pricing page
            </Link>
            .
          </p>
        </Reveal>
        <PricingGrid showAddons={false} />
      </div>
    </section>
  );
}

/* ─── Academy ──────────────────────────────────────────────────────────────── */
function AcademySection() {
  return (
    <section id="academy" className="section bg-[color:var(--color-bg-page)]">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="type-mono-label mb-4 text-[color:var(--color-gold)]">
            Artispreneur Academy
          </p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}
          >
            Learn it. Then your agent executes it.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--color-text-muted)]">
            Courses become tasks. Tasks become drafts. Drafts wait for your approval.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {COURSE_CHIPS.slice(0, 4).map((c) => (
              <span
                key={c}
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1 text-[11px] font-medium text-[color:var(--color-text-muted)]"
              >
                {c}
              </span>
            ))}
          </div>
          <a
            href="/signup?next=/onboarding"
            className="btn btn--primary btn--md mt-7"
          >
            Start learning free
          </a>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5 font-mono text-[12px] lg:-translate-x-2">
            {[
              { tag: "LESSON", color: "text-[color:var(--color-text-dim)]", text: "How to register with a PRO" },
              { tag: "TASK", color: "text-[color:var(--color-gold)]", text: "Draft PRO registration checklist" },
              { tag: "TASK", color: "text-[color:var(--color-gold)]", text: "Prepare repertoire spreadsheet" },
              { tag: "DONE", color: "text-[color:var(--color-success)]", text: "profile updated · Finance on deck" },
            ].map((row) => (
              <div
                key={row.text}
                className="flex gap-3 border-b border-[color:var(--color-border)] py-3 last:border-0"
              >
                <span className={`w-[70px] shrink-0 font-semibold ${row.color}`}>{row.tag}</span>
                <span className="text-[color:var(--color-text-primary)]">{row.text}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── FAQ teaser ───────────────────────────────────────────────────────────── */
function FaqTeaser() {
  return (
    <section className="section bg-[color:var(--color-surface)]">
      <div className="container-page mx-auto max-w-[720px]">
        <Reveal>
          <h2
            className="font-heading mb-9 text-center text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}
          >
            Questions, answered.
          </h2>
        </Reveal>
        <FaqList limit={4} />
        <Reveal className="mt-8 text-center">
          <Link href="/faq" className="btn btn--outline btn--md">
            View all FAQ
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
