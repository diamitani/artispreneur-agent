import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { PRICING } from "@/lib/constants";
import { HeroChat } from "@/components/marketing/HeroChat";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { LandingNav } from "./LandingNav";
import { FaqAccordion } from "./FaqAccordion";
import { AGENT_SPECS, TOTAL_SKILL_COUNT } from "@/lib/agents/roster";
import { WORKSPACE_FOLDER_COUNT } from "@/lib/userops/workspace-tree";
import {
  AGENT_ROSTER,
  FOOTER_SECTIONS,
  HERO_STAT_LABELS,
  HOW_IT_WORKS,
  PRODUCT_SURFACES,
  REPLACES,
  TRUST_POINTS,
} from "./landing-data";

const SIGNUP_HREF = "/signup?next=/onboarding";
const TIERS = Object.values(PRICING);

const HERO_STATS = [
  { value: String(AGENT_SPECS.length), label: HERO_STAT_LABELS.agents },
  { value: String(TOTAL_SKILL_COUNT), label: HERO_STAT_LABELS.skills },
  { value: String(WORKSPACE_FOLDER_COUNT), label: HERO_STAT_LABELS.folders },
  { value: "60s", label: HERO_STAT_LABELS.deploy },
];

export function Landing() {
  return (
    <div className="bg-white">
      <LandingNav />
      <main>
        <Hero />
        <StatStrip />
        <HowItWorks />
        <ProductSection />
        <RosterSection />
        <ReplacesSection />
        <DeploySection />
        <TrustSection />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="demo" className="relative overflow-hidden bg-[#0b0b0b] pt-16 text-white">
      {/* Ambient brand glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full bg-[rgba(204,0,0,0.22)] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 left-[8%] h-[420px] w-[420px] rounded-full bg-[rgba(254,208,1,0.10)] blur-[120px]"
      />

      <div className="container-page relative grid items-center gap-10 py-16 sm:py-20 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-gold)]" />
            <span className="type-mono-label text-white/70">
              The music business operating system
            </span>
          </div>

          <h1
            className="font-heading mt-6 text-white"
            style={{ fontSize: "clamp(2rem, 5.4vw, 3.9rem)", lineHeight: 1.06 }}
          >
            Your record label,
            <br />
            <span className="text-[color:var(--color-gold)]">run by agents.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-[16.5px]">
            Artispreneur gives independent artists a full AI business team — formation
            and PROs, EPKs and press, booking and releases. The agents draft the work.
            You approve what ships.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a href={SIGNUP_HREF} className="btn btn--primary btn--lg">
              Start free — deploy your workspace
            </a>
            <a href="#demo" className="btn btn--outline-on-dark btn--lg">
              Try the agent
            </a>
          </div>

          <p className="mt-4 text-[13px] text-white/40">
            No credit card. Your workspace deploys in about a minute.
          </p>

          {/* Capability ticker */}
          <div className="relative mt-8 hidden overflow-hidden md:block">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0b0b0b] to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0b0b0b] to-transparent"
            />
            <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                "Register my songs with BMI",
                "Draft my EPK",
                "Find venues in Atlanta",
                "Plan my next release",
                "Start my LLC",
                "Who owns what on this track?",
              ].map((q) => (
                <span
                  key={q}
                  className="whitespace-nowrap rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] text-white/55"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live demo chat — hidden on small mobile, shown from sm up */}
        <div className="hidden justify-center sm:flex lg:justify-end">
          <HeroChat />
        </div>
      </div>
    </section>
  );
}

function StatStrip() {
  return (
    <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]">
      <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:py-10">
        {HERO_STATS.map((s) => (
          <div key={s.label}>
            <p className="font-heading text-[28px] leading-none text-[color:var(--color-crimson)] sm:text-[30px]">
              {s.value}
            </p>
            <p className="mt-2 text-[13px] text-[color:var(--color-gray-mid)]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="section">
      <div className="container-page">
        <SectionHead
          eyebrow="How it works"
          title="From signup to a working agent in three steps."
          blurb="No setup call, no implementation project. You answer a few questions and the platform builds the rest."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {HOW_IT_WORKS.map((s) => (
            <div
              key={s.step}
              className="relative rounded-[10px] border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-[34px] leading-none text-[color:var(--color-border-dark)]">
                  {s.step}
                </span>
                <span className="type-mono-label rounded bg-[color:var(--color-bg-surface)] px-2 py-1 text-[color:var(--color-gray-mid)]">
                  {s.surface}
                </span>
              </div>
              <h3 className="font-heading mt-5 text-[18px] text-[color:var(--color-black)]">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[color:var(--color-gray-mid)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  return (
    <section
      id="product"
      className="section border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]"
    >
      <div className="container-page">
        <SectionHead
          eyebrow="The product"
          title="Four centers. One command surface."
          blurb="Every part of the business an independent artist actually has to run — with an agent already assigned to it."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PRODUCT_SURFACES.map((p) => {
            const accent =
              p.accent === "gold" ? "var(--color-gold)" : "var(--color-crimson)";
            return (
              <div
                key={p.id}
                className="group rounded-[10px] border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-8 w-1 shrink-0 rounded-full"
                    style={{ background: accent }}
                  />
                  <h3 className="font-heading text-[19px] text-[color:var(--color-black)]">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--color-gray-mid)]">
                  {p.body}
                </p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-2 text-[13px] text-[color:var(--color-gray-dark)]"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={accent}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RosterSection() {
  return (
    <section className="section">
      <div className="container-page">
        <SectionHead
          eyebrow="The roster"
          title="Six specialists. You only ever talk to one."
          blurb="The Day to Day Manager reads your request, loads your context, and routes it to whoever should actually handle it. You never pick an agent from a menu."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {AGENT_ROSTER.map((a) => (
            <div
              key={a.name}
              className={`p-6 ${
                "master" in a && a.master
                  ? "bg-[color:var(--color-black)]"
                  : "bg-white"
              }`}
            >
              <span
                className={`type-mono-label ${
                  "master" in a && a.master
                    ? "text-[color:var(--color-gold)]"
                    : "text-[color:var(--color-gray-subtle)]"
                }`}
              >
                {"master" in a && a.master ? "Master" : "Specialist"}
              </span>
              <h3
                className={`mt-3 text-[15px] font-bold ${
                  "master" in a && a.master ? "text-white" : "text-[color:var(--color-black)]"
                }`}
              >
                {a.name}
              </h3>
              <p
                className={`mt-1.5 text-[13px] leading-relaxed ${
                  "master" in a && a.master
                    ? "text-white/55"
                    : "text-[color:var(--color-gray-mid)]"
                }`}
              >
                {a.role}
              </p>
            </div>
          ))}

          {/* Fills the trailing grid cell */}
          <Link
            href="/skills#capabilities"
            className="group flex flex-col justify-between bg-[color:var(--color-bg-surface)] p-6 transition-colors hover:bg-white"
          >
            <div>
              <span className="type-mono-label text-[color:var(--color-crimson)]">
                {TOTAL_SKILL_COUNT} skills
              </span>
              <h3 className="mt-3 text-[15px] font-bold text-[color:var(--color-black)]">
                See what each one can do
              </h3>
            </div>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--color-crimson)]">
              Full capability index
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReplacesSection() {
  return (
    <section className="section">
      <div className="container-page">
        <SectionHead
          eyebrow="The math"
          title="What a team like this normally costs."
          blurb="Independent artists pay for this expertise piecemeal, or go without it and lose money quietly. Typical US market rates — not quotes, and not a promise you can fire anyone."
        />

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <ul className="overflow-hidden rounded-[10px] border border-[color:var(--color-border)]">
            {REPLACES.map((r, i) => (
              <li
                key={r.role}
                className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-white px-5 py-4 sm:px-6 sm:py-5 ${
                  i > 0 ? "border-t border-[color:var(--color-border)]" : ""
                }`}
              >
                <span className="text-[14px] font-bold text-[color:var(--color-black)] sm:text-[15px]">
                  {r.role}
                </span>
                <span className="font-mono text-[13px] text-[color:var(--color-crimson)]">
                  {r.rate}
                </span>
                <span className="ml-auto text-[12px] text-[color:var(--color-gray-mid)] sm:text-[12.5px]">
                  {r.note}
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-[10px] bg-[color:var(--color-black)] p-7 text-white sm:p-8">
            <p className="type-mono-label text-[color:var(--color-gold)]">
              Artispreneur
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-[42px] leading-none text-white sm:text-[46px]">
                ${PRICING.workspace.price}
              </span>
              <span className="text-[14px] text-white/50">
                /{PRICING.workspace.period}
              </span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-white/60">
              Every agent, every skill, unlimited projects. It will not replace a
              lawyer when you need one — it tells you when that is.
            </p>
            <a href={SIGNUP_HREF} className="btn btn--gold btn--md btn--block mt-7">
              Start free
            </a>
            <p className="mt-3 text-center text-[12px] text-white/35">
              Free plan available forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEPLOY_STEPS = [
  {
    label: "Provision control-plane records",
    detail: "USER# / PROJECT# / AGENT# created",
  },
  {
    label: "Build workspace storage structure",
    detail: "17 folders — knowledge base, operations, deliverables, memory",
  },
  {
    label: "Bind agent compute",
    detail: "Model, memory, and identity attached to your workspace",
  },
  {
    label: "Install agent",
    detail: "Soul file, tool scripts, and knowledge base indexed",
  },
] as const;

function DeploySection() {
  return (
    <section className="section border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHead
            align="left"
            eyebrow="Workspace deployment"
            title="You get infrastructure, not a chat window."
            blurb="Signing up provisions a real, isolated workspace on AWS. You watch each step complete, then land in a dashboard with an agent that already has your context."
          />
          <a href={SIGNUP_HREF} className="btn btn--primary btn--md mt-9">
            Deploy yours free
          </a>
        </div>

        <div className="overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-md)]">
          <div className="flex items-center gap-2 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-crimson)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-gold)]" />
            <span className="h-2.5 w-2.5 rounded-full border border-[color:var(--color-border-dark)]" />
            <span className="ml-1.5 font-mono text-[11.5px] text-[color:var(--color-gray-dark)]">
              deploying workspace
            </span>
            <span className="ml-auto rounded bg-[color:var(--color-success)]/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-success)]">
              complete
            </span>
          </div>
          <ul className="divide-y divide-[color:var(--color-border)]">
            {DEPLOY_STEPS.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3.5 px-5 py-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success)]">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[color:var(--color-black)]">
                    {i + 1}. {s.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[11.5px] leading-relaxed text-[color:var(--color-gray-mid)]">
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="section bg-[#0b0b0b] text-white">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="type-mono-label text-[color:var(--color-gold)]">
            How it stays safe
          </p>
          <h2
            className="font-heading mt-4 text-white"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)", lineHeight: 1.14 }}
          >
            Agents that draft. Never agents that decide.
          </h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3 md:gap-10">
          {TRUST_POINTS.map((t) => (
            <div key={t.title}>
              <h3 className="font-heading text-[18px] text-white">{t.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/55">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="section">
      <div className="container-page">
        <SectionHead
          eyebrow="Pricing"
          title="Start free. Upgrade when it pays for itself."
          blurb="Every plan deploys a real workspace and runs approval-first. No credit card to start."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-[12px] border bg-white p-7 ${
                tier.featured
                  ? "border-[color:var(--color-crimson)] shadow-[var(--shadow-lg)]"
                  : "border-[color:var(--color-border)] shadow-[var(--shadow-sm)]"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-[color:var(--color-crimson)] px-3 py-1 text-[11px] font-bold text-white">
                  Most popular
                </span>
              )}
              <h3 className="font-heading text-[20px] text-[color:var(--color-black)]">
                {tier.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-heading text-[38px] leading-none text-[color:var(--color-black)]">
                  ${tier.price}
                </span>
                <span className="text-[13px] text-[color:var(--color-gray-mid)]">
                  /{tier.period}
                </span>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[color:var(--color-gray-mid)]">
                {tier.description}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[13px] text-[color:var(--color-gray-dark)]"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-crimson)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 shrink-0"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {/* Paid tiers open Stripe Checkout rather than repeating the
                  free-signup link. All three used to point at the same
                  /signup, so the $0 and $99 buttons differed only in label. */}
              {tier.price > 0 ? (
                <div className="mt-7">
                  <UpgradeButton
                    plan={tier === PRICING.workspace ? "workspace" : "agency"}
                    label={tier.cta}
                    className={`btn btn--md btn--block ${tier.featured ? "btn--primary" : "btn--outline"}`}
                  />
                </div>
              ) : (
                <a
                  href={SIGNUP_HREF}
                  className={`btn btn--md btn--block mt-7 ${
                    tier.featured ? "btn--primary" : "btn--outline"
                  }`}
                >
                  {tier.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] text-[color:var(--color-gray-mid)]">
          Compare every feature on the{" "}
          <Link
            href="/pricing"
            className="font-semibold text-[color:var(--color-crimson)] underline underline-offset-2"
          >
            full pricing page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]">
      <div className="container-page">
        <SectionHead eyebrow="Questions" title="Straight answers." />
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-crimson)] py-20 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-white/10 blur-[100px]"
      />
      <div className="container-page relative text-center">
        <h2
          className="font-heading mx-auto max-w-2xl text-white"
          style={{ fontSize: "clamp(1.7rem, 4vw, 2.9rem)", lineHeight: 1.1 }}
        >
          Every artist is an entrepreneur.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/80 sm:text-[16px]">
          Get the business side handled so you can get back to the work only you can do.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={SIGNUP_HREF}
            className="btn btn--lg bg-white text-[color:var(--color-crimson)] hover:bg-white/90"
          >
            Deploy your workspace free
          </a>
          <a href="#pricing" className="btn btn--outline-on-dark btn--lg">
            See pricing
          </a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[#0b0b0b] py-14 text-white sm:py-16">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-12">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src={brand.logo.primaryPng}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="font-heading text-[15px] text-white">Artispreneur</span>
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/45">
              {brand.tagline} The AI operating system for independent musicians,
              agencies, and labels.
            </p>
          </div>

          {FOOTER_SECTIONS.map((sec) => (
            <div key={sec.title}>
              <p className="type-mono-label text-white/35">{sec.title}</p>
              <ul className="mt-4 space-y-2.5">
                {sec.links.map((l) => (
                  <li key={l.href + l.label}>
                    <a
                      href={l.href}
                      className="text-[13.5px] text-white/60 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7">
          <p className="text-[12.5px] text-white/35">
            © {new Date().getFullYear()} Artispreneur. All rights reserved.
          </p>
          <p className="text-[12.5px] text-white/35">
            Educational guidance — not legal, tax, or financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

function SectionHead({
  eyebrow,
  title,
  blurb,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p className="type-mono-label text-[color:var(--color-crimson)]">{eyebrow}</p>
      <h2
        className="font-heading mt-4 text-[color:var(--color-black)]"
        style={{ fontSize: "clamp(1.65rem, 3.2vw, 2.5rem)", lineHeight: 1.14 }}
      >
        {title}
      </h2>
      {blurb && (
        <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-gray-mid)] sm:text-[15.5px]">
          {blurb}
        </p>
      )}
    </div>
  );
}
