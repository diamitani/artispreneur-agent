import Link from "next/link";
import {
  AGENT_CARDS,
  COURSE_CHIPS,
  HOW_STEPS,
  MODE_CARDS,
  PROBLEM_PAINS,
  SOCIAL_PROOF,
  SOLUTION_PILLARS,
  TRUST_POINTS,
} from "@/lib/marketing-data";
import { SKILLS_CATALOG } from "@/lib/skills/catalog";
import { MarketingShell } from "./MarketingShell";
import { LandingHero } from "./LandingHero";
import { TerminalShowcase } from "./TerminalShowcase";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import { PricingGrid } from "./PricingGrid";
import { FaqList } from "./FaqList";
import { FinalCta } from "./FinalCta";

export function LandingPage() {
  return (
    <MarketingShell>
      <LandingHero />
      <ProofStrip />
      <div className="bg-white pb-8 pt-2 md:pb-12">
        <TerminalShowcase />
      </div>
      <ProblemSection />
      <SolutionSection />
      <HowSection />
      <AgentsSection />
      <ApprovalSection />
      <ModesSection />
      <SkillsTeaser />
      <PricingTeaser />
      <AcademySection />
      <FaqTeaser />
      <FinalCta />
    </MarketingShell>
  );
}

function ProofStrip() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:gap-4 md:py-10">
        {SOCIAL_PROOF.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.05} className="text-center md:text-left">
            <p className="font-heading text-3xl text-[color:var(--color-gold)] md:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-dim)]">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

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

function SolutionSection() {
  return (
    <section className="section bg-[color:var(--color-surface)]">
      <div className="container-page">
        <Reveal className="mb-12 max-w-xl">
          <p className="type-overline mb-2.5">The runtime</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            PAL compiles. Hermes runs. Skills unlock.
          </h2>
        </Reveal>
        <RevealStagger className="grid gap-4 lg:grid-cols-3">
          {SOLUTION_PILLARS.map((s, i) => (
            <RevealItem key={s.tag}>
              <article
                className={`h-full p-7 ${
                  i === 1
                    ? "rounded-[12px] bg-[color:var(--color-card)] border-2 border-[color:var(--color-gold)]"
                    : "rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-page)]"
                }`}
              >
                <p className="type-mono-label mb-3 text-[color:var(--color-gold)]">
                  {s.tag}
                </p>
                <h3 className="font-heading text-xl text-[color:var(--color-text-primary)]">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--color-text-muted)]">
                  {s.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
        <Reveal delay={0.1} className="mt-8 text-center">
          <Link href="/features" className="btn btn--outline btn--md">
            Explore the product
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function HowSection() {
  return (
    <section id="how" className="section bg-[color:var(--color-bg-page)]">
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

function AgentsSection() {
  return (
    <section id="agents" className="section bg-[color:var(--color-surface)]">
      <div className="container-page">
        <Reveal className="mb-10 max-w-xl">
          <p className="type-overline mb-2.5">Your Team</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Your AI business team
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[12px] bg-[color:var(--color-card)] border border-[color:var(--color-gold)] px-7 py-7">
            <div>
              <h3 className="font-heading text-[22px] text-[color:var(--color-text-primary)]">Hermes · Master Agent</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--color-text-muted)]">
                Manager-grade chief of staff. Routes work, drafts plans, keeps every specialist
                aligned to your soul.md — on AWS Bedrock DeepSeek.
              </p>
            </div>
            <span className="rounded bg-[color:var(--color-gold)] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.1em] text-[color:var(--color-black)]">
              EVERY WORKSPACE
            </span>
          </div>
        </Reveal>

        <RevealStagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {AGENT_CARDS.map((a) => (
            <RevealItem key={a.name}>
              <article className="h-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-page)] p-6 transition-[border-color,box-shadow] duration-200 hover:border-[color:var(--color-gold)] hover:bg-[color:var(--color-card)] hover:shadow-[var(--shadow-lg)]">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-heading text-[17px] text-[color:var(--color-text-primary)]">
                    {a.name}
                  </h3>
                  <span className="shrink-0 rounded bg-[color:var(--color-surface)] px-2 py-0.5 font-mono text-[9.5px] font-semibold tracking-wider text-[color:var(--color-text-dim)]">
                    {a.gate}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[color:var(--color-text-muted)]">{a.desc}</p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

function ApprovalSection() {
  return (
    <section className="section bg-[color:var(--color-bg-page)]">
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
            Only you send.
          </h2>
          <ul className="mt-6 space-y-3">
            {TRUST_POINTS.map((t) => (
              <li
                key={t}
                className="flex gap-2.5 text-sm leading-relaxed text-[color:var(--color-text-muted)]"
              >
                <span className="font-bold text-[color:var(--color-gold)]">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:translate-y-4">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-dim)]">
              Approval queue
            </p>
            {[
              { title: "Venue outreach — Baby's All Right", status: "Ready" },
              { title: "EPK one-sheet v2", status: "Ready" },
              { title: "Split sheet — producer deal", status: "Needs review" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-b border-[color:var(--color-border)] py-3 last:border-0"
              >
                <span className="text-sm font-medium text-[color:var(--color-text-primary)]">
                  {item.title}
                </span>
                <span className="rounded bg-[color:var(--color-card)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[color:var(--color-gold)]">
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

function ModesSection() {
  return (
    <section className="section bg-[color:var(--color-surface)]">
      <div className="container-page">
        <Reveal className="mx-auto mb-14 max-w-[560px] text-center">
          <p className="type-overline mb-2.5">Modes</p>
          <h2
            className="font-heading text-[color:var(--color-text-primary)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
          >
            One platform. Three ways to run it.
          </h2>
        </Reveal>
        <RevealStagger className="grid gap-4 md:grid-cols-3">
          {MODE_CARDS.map((m) => (
            <RevealItem key={m.tag}>
              <article className="h-full rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-page)] p-7 transition-colors duration-200 hover:border-[color:var(--color-gold)] hover:bg-[color:var(--color-card)]">
                <p className="type-mono-label mb-3.5 text-[color:var(--color-gold)]">{m.tag}</p>
                <h3 className="font-heading text-xl text-[color:var(--color-text-primary)]">{m.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--color-text-muted)]">{m.desc}</p>
                <p className="mt-5 font-mono text-[12.5px] text-[color:var(--color-text-dim)]">{m.foot}</p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

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
              Browse skill packs like a store — free during launch. Install into Hermes on your AWS
              instance.
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
                className="group block overflow-hidden rounded-[12px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-gold)]"
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
            href="/api/auth/login?signup=1&return=/onboarding"
            className="btn btn--primary btn--md mt-7"
          >
            Start learning free
          </a>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 font-mono text-[12px] lg:-translate-x-2">
            {[
              { tag: "LESSON", color: "text-[color:var(--color-text-muted)]", text: "How to register with a PRO" },
              { tag: "TASK", color: "text-[color:var(--color-gold)]", text: "Draft PRO registration checklist" },
              { tag: "TASK", color: "text-[color:var(--color-gold)]", text: "Prepare repertoire spreadsheet" },
              { tag: "DONE", color: "text-[color:var(--color-success)]", text: "soul.md updated · Finance notified" },
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
