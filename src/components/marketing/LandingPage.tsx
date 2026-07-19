import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import {
  AGENT_CARDS,
  FAQS,
  HOW_STEPS,
  MODE_CARDS,
  PRICE_BOTTOM,
  PRICE_TOP,
  TRUST_POINTS,
} from "@/lib/marketing-data";
import { SKILLS_CATALOG } from "@/lib/skills/catalog";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { LandingHero } from "./LandingHero";
import { TerminalShowcase } from "./TerminalShowcase";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

export function LandingPage() {
  return (
    <div className="grain">
      <Nav />
      <main>
        <LandingHero />
        <div className="bg-white pb-8 pt-2 md:pb-12">
          <TerminalShowcase />
        </div>
        <HowSection />
        <AgentsSection />
        <ApprovalSection />
        <ModesSection />
        <SkillsTeaser />
        <PricingSection />
        <AcademySection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function HowSection() {
  return (
    <section id="how" className="section bg-white">
      <div className="container-page">
        <Reveal className="mx-auto mb-14 max-w-[560px] md:ml-0 md:max-w-lg md:text-left">
          <p className="type-overline mb-2.5">The Process</p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
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
                <p className="type-mono-label mb-3.5 text-[color:var(--color-crimson)]">{s.num}</p>
                <h3 className="text-[15px] font-bold text-[color:var(--color-black)]">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-gray-mid)]">
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
    <section id="agents" className="section bg-[color:var(--color-bg-surface)]">
      <div className="container-page">
        <Reveal className="mb-10 max-w-xl">
          <p className="type-overline mb-2.5">Your Team</p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Your AI business team
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[12px] bg-[color:var(--color-bg-dark)] px-7 py-7 text-white">
            <div>
              <h3 className="font-heading text-[22px]">Artispreneur Master Agent</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                Manager-grade chief of staff. Routes work, drafts plans, keeps every specialist
                aligned to your soul.md.
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
              <article className="h-full rounded-[10px] border border-transparent bg-white p-6 shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] duration-200 hover:border-[color:var(--color-crimson)]/25 hover:shadow-[var(--shadow-lg)]">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-heading text-[17px] text-[color:var(--color-black)]">
                    {a.name}
                  </h3>
                  <span className="shrink-0 rounded bg-[color:var(--color-bg-surface)] px-2 py-0.5 font-mono text-[9.5px] font-semibold tracking-wider text-[color:var(--color-gray-mid)]">
                    {a.gate}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[color:var(--color-gray-mid)]">{a.desc}</p>
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
    <section className="section bg-white">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <p className="type-mono-label mb-4 text-[color:var(--color-crimson)]">
            Approval before impact
          </p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
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
                className="flex gap-2.5 text-sm leading-relaxed text-[color:var(--color-gray-dark)]"
              >
                <span className="font-bold text-[color:var(--color-crimson)]">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] p-6 md:translate-y-4">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[color:var(--color-gray-mid)]">
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
                <span className="text-sm font-medium text-[color:var(--color-black)]">
                  {item.title}
                </span>
                <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[color:var(--color-crimson)]">
                  {item.status}
                </span>
              </div>
            ))}
            <p className="mt-4 font-mono text-[11px] text-[color:var(--color-gray-mid)]">
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
    <section className="section bg-[color:var(--color-bg-dark)] text-white">
      <div className="container-page">
        <Reveal className="mx-auto mb-14 max-w-[560px] text-center">
          <p className="type-overline type-overline--gold mb-2.5">Modes</p>
          <h2
            className="font-heading text-white"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
          >
            One platform. Three ways to run it.
          </h2>
        </Reveal>
        <RevealStagger className="grid gap-4 md:grid-cols-3">
          {MODE_CARDS.map((m) => (
            <RevealItem key={m.tag}>
              <article className="h-full rounded-[12px] border border-white/10 bg-white/[0.03] p-7 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.05]">
                <p className="type-mono-label mb-3.5 text-[color:var(--color-gold)]">{m.tag}</p>
                <h3 className="font-heading text-xl text-white">{m.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/55">{m.desc}</p>
                <p className="mt-5 font-mono text-[12.5px] text-white/40">{m.foot}</p>
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
    <section id="skills" className="section bg-white">
      <div className="container-page">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-md">
            <p className="type-overline mb-2.5">Skills Marketplace</p>
            <h2
              className="font-heading text-[color:var(--color-black)]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
            >
              Digital skills. Instant install.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
              Browse skill packs like a store — free during launch.
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
                className="group block overflow-hidden rounded-[12px] bg-[color:var(--color-bg-dark)] p-6 text-white transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="font-mono text-[10px] font-semibold tracking-wider text-[color:var(--color-gold)]">
                  FREE · DIGITAL DOWNLOAD
                </p>
                <h3 className="font-heading mt-3 text-[19px]">{s.name}</h3>
                <p className="mt-2 text-sm text-white/55">{s.tagline}</p>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="section bg-[color:var(--color-bg-surface)]">
      <div className="container-page">
        <Reveal className="mx-auto mb-12 max-w-[520px] text-center">
          <p className="type-overline mb-2.5">Pricing</p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
          >
            Start free. Add agents as you grow.
          </h2>
        </Reveal>

        <RevealStagger className="mx-auto grid max-w-[900px] gap-4 md:grid-cols-3">
          {PRICE_TOP.map((plan) => (
            <RevealItem key={plan.name}>
              <article
                className={`relative flex h-full flex-col rounded-[12px] p-7 ${
                  plan.featured
                    ? "border-[1.5px] border-[color:var(--color-crimson)] bg-[color:var(--color-bg-dark)] text-white md:-translate-y-2"
                    : "border-[1.5px] border-[color:var(--color-border)] bg-white"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[color:var(--color-crimson)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-white">
                    Most popular
                  </span>
                )}
                <p
                  className={`text-[13px] font-bold uppercase tracking-[0.06em] ${
                    plan.featured ? "text-white/50" : "text-[color:var(--color-gray-mid)]"
                  }`}
                >
                  {plan.name}
                </p>
                <p className="mt-2">
                  <span
                    className={`font-heading text-4xl ${
                      plan.featured ? "text-white" : "text-[color:var(--color-black)]"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`ml-1 text-[13px] ${
                      plan.featured ? "text-white/40" : "text-[color:var(--color-gray-subtle)]"
                    }`}
                  >
                    {plan.per}
                  </span>
                </p>
                <p
                  className={`mt-3 text-sm ${
                    plan.featured ? "text-white/70" : "text-[color:var(--color-gray-mid)]"
                  }`}
                >
                  {plan.sub}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.feats.map((f) => (
                    <li
                      key={f}
                      className={`flex gap-2 text-[13px] ${
                        plan.featured ? "text-white/70" : "text-[color:var(--color-gray-dark)]"
                      }`}
                    >
                      <span className="font-bold text-[color:var(--color-crimson)]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/api/auth/login?signup=1&return=/onboarding"
                  className={`btn btn--md btn--block mt-6 ${
                    plan.featured ? "btn--primary" : "btn--outline"
                  }`}
                >
                  {plan.cta}
                </a>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mx-auto mt-6 grid max-w-[900px] gap-3 sm:grid-cols-2">
          {PRICE_BOTTOM.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between rounded-[10px] border border-[color:var(--color-border)] bg-white px-5 py-4"
            >
              <span className="text-sm font-semibold text-[color:var(--color-black)]">{p.name}</span>
              <span className="font-heading text-[19px] text-[color:var(--color-crimson)]">
                {p.price}
                <span className="ml-1 font-sans text-[11px] font-normal text-[color:var(--color-gray-mid)]">
                  {p.per}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AcademySection() {
  return (
    <section id="academy" className="section bg-white">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="type-mono-label mb-4 text-[color:var(--color-crimson)]">
            Artispreneur Academy
          </p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}
          >
            Learn it. Then your agent executes it.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
            Courses become tasks. Tasks become drafts. Drafts wait for your approval.
          </p>
          <a
            href="/api/auth/login?signup=1&return=/onboarding"
            className="btn btn--primary btn--md mt-7"
          >
            Start learning free
          </a>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] p-5 font-mono text-[12px] lg:-translate-x-2">
            {[
              { tag: "LESSON", color: "text-[color:var(--color-gray-mid)]", text: "How to register with a PRO" },
              { tag: "TASK", color: "text-[color:var(--color-crimson)]", text: "Draft PRO registration checklist" },
              { tag: "TASK", color: "text-[color:var(--color-crimson)]", text: "Prepare repertoire spreadsheet" },
              { tag: "DONE", color: "text-[color:var(--ok-ink)]", text: "soul.md updated · Finance Manager notified" },
            ].map((row) => (
              <div
                key={row.text}
                className="flex gap-3 border-b border-[color:var(--color-border)] py-3 last:border-0"
              >
                <span className={`w-[70px] shrink-0 font-semibold ${row.color}`}>{row.tag}</span>
                <span className="text-[color:var(--color-black)]">{row.text}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section bg-[color:var(--color-bg-surface)]">
      <div className="container-page mx-auto max-w-[720px]">
        <Reveal>
          <h2
            className="font-heading mb-9 text-center text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}
          >
            Questions, answered.
          </h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.04}>
              <details className="group rounded-[10px] border border-[color:var(--color-border)] bg-white px-5 py-4">
                <summary className="cursor-pointer list-none text-[15px] font-semibold text-[color:var(--color-black)] marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-[color:var(--color-crimson)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section bg-[color:var(--color-bg-brand)] text-center text-white">
      <Reveal className="container-page mx-auto max-w-[600px]">
        <Image
          src={brand.logo.primaryPng}
          alt=""
          width={56}
          height={56}
          className="mx-auto mb-5 h-14 w-14"
        />
        <h2
          className="font-heading text-white"
          style={{ fontSize: "clamp(1.85rem, 4vw, 2.6rem)" }}
        >
          Build your music business.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/75">
          Join independent musicians running real careers with an AI business team —
          approval-first.
        </p>
        <a
          href="/api/auth/login?signup=1&return=/onboarding"
          className="btn btn--gold btn--lg mt-9"
        >
          Become an Artispreneur
        </a>
      </Reveal>
    </section>
  );
}
