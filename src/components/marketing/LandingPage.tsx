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

export function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-bg-dark)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-[rgba(204,0,0,0.12)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 h-[350px] w-[350px] rounded-full bg-[rgba(254,208,1,0.07)]"
      />

      <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="type-mono-label mb-5 text-[color:var(--color-gold)]">
            Agent · by Artispreneur
          </p>
          <h1
            className="font-heading text-white"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", lineHeight: 1.12 }}
          >
            Hire your AI
            <br />
            business team.
          </h1>
          <p className="mt-5 max-w-md text-[clamp(1rem,2vw,1.125rem)] leading-relaxed text-white/60">
            Tell your Artispreneur Agent what you&apos;re trying to accomplish. It builds the plan,
            activates the right specialist, and returns finished work for your approval.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="/api/auth/login?signup=1&return=/onboarding" className="btn btn--primary btn--lg">
              Start for Free
            </a>
            <a href="#how" className="btn btn--outline-on-dark btn--lg">
              See How It Works
            </a>
          </div>
          <p className="mt-5 font-heading text-sm italic text-white/45">{brand.tagline}</p>
          <p className="mt-3 text-xs text-white/35">No credit card required · Free plan available</p>
        </div>

        <TerminalMock />
      </div>
    </section>
  );
}

function TerminalMock() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[#1a1a1a] shadow-[var(--shadow-xl)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-[color:var(--color-gray-mid)]">
          my-artispreneur-agent — /artispreneurs/patrick-diamitani
        </span>
      </div>
      <div className="space-y-0 px-5 py-5 font-mono text-[12.5px] leading-[2] text-white/80">
        <p>
          <span className="text-[color:var(--color-gold)]">you</span>
          <span className="text-white/30"> › </span>
          Build an EPK and book 3 rooms in NYC this quarter.
        </p>
        <p className="text-white/40">⋯ routing to EPK Builder + Directory Outreach</p>
        <p>
          <span className="text-[color:var(--color-crimson)]">master</span>
          <span className="text-white/30"> › </span>
          Drafted one-sheet + press bio. 12 venues matched. 3 outreach emails ready for approval.
        </p>
        <p className="text-[color:var(--color-success)]">
          ✓ awaiting your approval — nothing sent
          <span className="cursor-blink" />
        </p>
      </div>
    </div>
  );
}

function HowSection() {
  return (
    <section id="how" className="section bg-white">
      <div className="container-page">
        <div className="mx-auto mb-14 max-w-[560px] text-center">
          <p className="type-overline mb-2.5">The Process</p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.65rem, 4vw, 2.125rem)" }}
          >
            From sign-up to a working business team
          </h2>
        </div>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((s, i) => (
            <article
              key={s.num}
              className={`px-7 py-6 ${
                i === 0 ? "" : "border-t border-[color:var(--color-border)] sm:border-t-0 lg:border-l"
              }`}
            >
              <p className="type-mono-label mb-3.5 text-[color:var(--color-crimson)]">{s.num}</p>
              <h3 className="text-[15px] font-bold text-[color:var(--color-black)]">{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-gray-mid)]">
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentsSection() {
  return (
    <section id="agents" className="section bg-[color:var(--color-bg-surface)]">
      <div className="container-page">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-overline mb-2.5">Your Team</p>
            <h2
              className="font-heading text-[color:var(--color-black)]"
              style={{ fontSize: "clamp(1.65rem, 4vw, 2.125rem)" }}
            >
              Your AI business team
            </h2>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[10px] bg-[color:var(--color-bg-dark)] px-7 py-6 text-white">
          <div>
            <h3 className="font-heading text-[19px]">Artispreneur Master Agent</h3>
            <p className="mt-1 max-w-xl text-sm text-white/55">
              Your manager-grade chief of staff. Routes work, drafts plans, and keeps every
              specialist aligned to your soul.md.
            </p>
          </div>
          <span className="rounded bg-[color:var(--color-gold)] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.1em] text-[color:var(--color-black)]">
            EVERY WORKSPACE
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {AGENT_CARDS.map((a) => (
            <article
              key={a.name}
              className="rounded-[10px] bg-white p-6 shadow-[var(--shadow-sm)] transition-[box-shadow] duration-200 hover:shadow-[var(--shadow-lg)]"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}

function ApprovalSection() {
  return (
    <section className="section bg-white">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="type-mono-label mb-4 text-[color:var(--color-crimson)]">
            Approval before impact
          </p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.65rem, 4vw, 2rem)" }}
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
        </div>
        <div className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] p-6">
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
              <span className="text-sm font-medium text-[color:var(--color-black)]">{item.title}</span>
              <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[color:var(--color-crimson)]">
                {item.status}
              </span>
            </div>
          ))}
          <p className="mt-4 font-mono text-[11px] text-[color:var(--color-gray-mid)]">
            audit: approved by you · 2 of 3 drafts · PR &amp; Outreach Agent
          </p>
        </div>
      </div>
    </section>
  );
}

function ModesSection() {
  return (
    <section className="section bg-[color:var(--color-bg-dark)] text-white">
      <div className="container-page">
        <div className="mx-auto mb-14 max-w-[560px] text-center">
          <p className="type-overline type-overline--gold mb-2.5">Modes</p>
          <h2
            className="font-heading text-white"
            style={{ fontSize: "clamp(1.65rem, 4vw, 2.125rem)" }}
          >
            One platform. Three ways to run it.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {MODE_CARDS.map((m) => (
            <article
              key={m.tag}
              className="rounded-[10px] border border-white/10 bg-white/[0.03] p-7"
            >
              <p className="type-mono-label mb-3.5 text-[color:var(--color-gold)]">{m.tag}</p>
              <h3 className="font-heading text-xl text-white">{m.name}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/55">{m.desc}</p>
              <p className="mt-5 font-mono text-[12.5px] text-white/40">{m.foot}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsTeaser() {
  const featured = SKILLS_CATALOG.filter((s) => s.featured || s.popular).slice(0, 3);
  return (
    <section id="skills" className="section bg-white">
      <div className="container-page">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="type-overline mb-2.5">Skills Marketplace</p>
            <h2
              className="font-heading text-[color:var(--color-black)]"
              style={{ fontSize: "clamp(1.65rem, 4vw, 2.125rem)" }}
            >
              Digital skills. Instant install.
            </h2>
            <p className="mt-3 max-w-md text-sm text-[color:var(--color-gray-mid)]">
              Browse skill packs like a store — free during launch. Stripe + HubSpot ready when you
              go paid.
            </p>
          </div>
          <Link href="/skills" className="btn btn--primary btn--md">
            Open marketplace
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((s) => (
            <Link
              key={s.id}
              href={`/skills/${s.slug}`}
              className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] p-6 transition-shadow hover:shadow-[var(--shadow-lg)]"
            >
              <p className="font-mono text-[10px] font-semibold tracking-wider text-[color:var(--color-crimson)]">
                FREE · DIGITAL DOWNLOAD
              </p>
              <h3 className="font-heading mt-2 text-[17px]">{s.name}</h3>
              <p className="mt-2 text-sm text-[color:var(--color-gray-mid)]">{s.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="section bg-[color:var(--color-bg-surface)]">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-[520px] text-center">
          <p className="type-overline mb-2.5">Pricing</p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.65rem, 4vw, 2.125rem)" }}
          >
            Start free. Add agents as you grow.
          </h2>
          <p className="mt-3 text-[15px] text-[color:var(--color-gray-mid)]">
            Invest in your music business — not another generic chatbot.
          </p>
        </div>

        <div className="mx-auto grid max-w-[900px] gap-4 md:grid-cols-3">
          {PRICE_TOP.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-[10px] p-7 ${
                plan.featured
                  ? "border-[1.5px] border-[color:var(--color-crimson)] bg-[color:var(--color-bg-dark)] text-white"
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
          ))}
        </div>

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
        <div>
          <p className="type-mono-label mb-4 text-[color:var(--color-crimson)]">
            Artispreneur Academy
          </p>
          <h2
            className="font-heading text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 1.875rem)" }}
          >
            Learn it. Then your agent executes it.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
            Courses become tasks. Tasks become drafts. Drafts wait for your approval. Education that
            turns into shipped work.
          </p>
          <a href="/api/auth/login?signup=1&return=/onboarding" className="btn btn--primary btn--md mt-7">
            Start learning free
          </a>
        </div>
        <div className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] p-5 font-mono text-[12px]">
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
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section bg-[color:var(--color-bg-surface)]">
      <div className="container-page mx-auto max-w-[720px]">
        <h2
          className="font-heading mb-9 text-center text-[color:var(--color-black)]"
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 1.875rem)" }}
        >
          Questions, answered.
        </h2>
        <div className="space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-[10px] border border-[color:var(--color-border)] bg-white px-5 py-4"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section bg-[color:var(--color-bg-brand)] text-center text-white">
      <div className="container-page mx-auto max-w-[600px]">
        <Image
          src={brand.logo.primaryPng}
          alt=""
          width={56}
          height={56}
          className="mx-auto mb-5 h-14 w-14"
        />
        <h2
          className="font-heading text-white"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.375rem)" }}
        >
          Build your music business.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/75">
          Join independent musicians running real careers with an AI business team — approval-first.
        </p>
        <a href="/api/auth/login?signup=1&return=/onboarding" className="btn btn--gold btn--lg mt-9">
          Become an Artispreneur
        </a>
      </div>
    </section>
  );
}
