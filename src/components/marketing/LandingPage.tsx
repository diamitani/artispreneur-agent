"use client";

import { useState } from "react";
import Link from "next/link";
import { ArtispreneurMark } from "@/components/brand/ArtispreneurMark";
import { brand } from "@/lib/brand";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

const HOW = [
  {
    n: "01",
    title: "Sign up",
    body: "Create your account. We provision a private workspace namespace — not a shared chatbot thread.",
  },
  {
    n: "02",
    title: "PAL intake → Master Soul.md",
    body: "Answer a short ROSTR questionnaire. The PAL Roster Agent compiles your identity, goals, voice, and approval rules.",
  },
  {
    n: "03",
    title: "Enter Mission Control",
    body: "Your Master Agent + specialists draft EPK, contracts, releases, and outreach. You approve before anything ships.",
  },
];

const FAQ = [
  {
    q: "Is this a distributor or a label?",
    a: "No. Artispreneur is the operating system and AI team that helps independents run the business side — rights, docs, outreach, learning, and catalog — without signing you or replacing DistroKid.",
  },
  {
    q: "What is PAL / Master Soul.md?",
    a: "PAL is our Prompt Abstraction Layer. Onboarding answers are compiled into Master Soul.md — the file every specialist reads so they sound like your team, not a generic bot.",
  },
  {
    q: "Will agents send emails or distribute music without me?",
    a: "No. Default mode is approval-first. Agents research and draft freely; rights, outbound, and money actions require your named approval.",
  },
  {
    q: "Who is Agent for?",
    a: "Independent artists first. Agency and Label modes unlock the same stack for managers and small rosters.",
  },
  {
    q: "What is Cataba?",
    a: "Cataba is the catalog layer — upload discography, track splits and identifiers, and prep publishing registration with a specialist agent.",
  },
];

export function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <TeamSection />
        <ProductsSection />
        <ModesSection />
        <TrustSection />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[min(92dvh,880px)] overflow-hidden bg-[color:var(--color-red)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="mark-glow absolute -right-[12%] top-[10%] hidden h-[520px] w-[520px] md:block"
      >
        <ArtispreneurMark size={520} variant="reversed" className="opacity-90" />
      </div>

      <div className="container-page relative z-10 flex min-h-[min(92dvh,880px)] flex-col justify-center py-20 md:py-28">
        <p className="eyebrow eyebrow-gold animate-fade-up">Agent by Artispreneur</p>
        <h1
          className="font-heading animate-fade-up delay-1 mt-5 max-w-[14ch] text-white"
          style={{ fontSize: "clamp(2.75rem, 7vw, 5.25rem)" }}
        >
          Artispreneur
        </h1>
        <p className="animate-fade-up delay-2 mt-2 font-heading text-[clamp(1.35rem,3vw,2rem)] text-[color:var(--color-gold)]">
          {brand.tagline}
        </p>
        <p className="animate-fade-up delay-2 mt-6 max-w-xl text-lg leading-relaxed text-white/90">
          Your AI business team — compiled around your career. Tell us where you are; get a private
          workspace, Master Soul, and specialists that draft the next move.
        </p>
        <div className="animate-fade-up delay-3 mt-10 flex flex-wrap gap-3">
          <Link href="/onboarding" className="btn btn--gold btn--lg btn--pill">
            Start PAL onboarding
          </Link>
          <a href="#how" className="btn btn--outline-on-red btn--lg btn--pill">
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="section bg-[color:var(--color-parchment)]">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="font-heading mt-3" style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
            Signup → Soul.md → Workspace
          </h2>
          <p className="mt-4 text-[color:var(--color-warm-gray)] leading-relaxed">
            Same ease as modern agent tools — with Artispreneur branding and ROSTR structure so new AI
            users always see how intake connects to the team that executes.
          </p>
        </div>
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {HOW.map((step) => (
            <li key={step.n} className="relative border-t border-[color:var(--color-red)]/25 pt-6">
              <span className="font-heading text-3xl text-[color:var(--color-red)]">{step.n}</span>
              <h3 className="font-heading mt-3 text-xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-warm-gray)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section id="team" className="section bg-[color:var(--color-charcoal)] text-white">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-gold">Your AI business team</p>
          <h2 className="font-heading mt-3" style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
            Seven specialists. One Master Agent.
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Ask in plain language. Master Agent routes through ROSTR — PAL to interpret, NPAO to
            prioritize, specialists to draft. You stay in the approval seat.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brand.specialists.map((s) => (
            <article
              key={s.name}
              className="border border-white/10 bg-white/[0.03] px-5 py-5 transition-colors hover:border-[color:var(--color-gold)]/40"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-gold)]">
                {s.role}
              </p>
              <h3 className="font-heading mt-2 text-xl text-white">{s.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section id="products" className="section bg-white">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">The toolkit</p>
          <h2 className="font-heading mt-3" style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
            Five products. One Agent workspace.
          </h2>
          <p className="mt-4 text-[color:var(--color-warm-gray)] leading-relaxed">
            Contract, EPK, Directory, Academy, and Cataba — modular tools that feed the same Soul and
            approval queue.
          </p>
        </div>
        <div className="mt-12 divide-y divide-[color:var(--color-border)] border-y border-[color:var(--color-border)]">
          {brand.products.map((p, i) => (
            <article
              key={p.id}
              className="grid gap-3 py-8 md:grid-cols-[140px_1fr_auto] md:items-end md:gap-8"
            >
              <span className="font-heading text-sm text-[color:var(--color-red)]">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-heading text-2xl">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[color:var(--color-charcoal)]">
                  {p.line}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--color-warm-gray)]">
                  {p.body}
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-warm-gray)]">
                {p.priceNote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModesSection() {
  return (
    <section id="modes" className="section bg-[color:var(--color-parchment)]">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">Built for how you operate</p>
          <h2 className="font-heading mt-3" style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
            Artist. Agency. Label.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {brand.modes.map((m) => (
            <article key={m.id} className="bg-white px-6 py-8 shadow-[var(--shadow-md,0_4px_12px_rgba(0,0,0,0.06))]">
              <h3 className="font-heading text-2xl text-[color:var(--color-red)]">{m.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-warm-gray)]">
                {m.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="section bg-white">
      <div className="container-page grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">Trust & safety</p>
          <h2 className="font-heading mt-3" style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
            Approval-first. Always.
          </h2>
          <p className="mt-4 text-[color:var(--color-warm-gray)] leading-relaxed">
            Agents draft. You decide. Rights, money, and outbound never auto-execute — the same
            discipline majors expect, without the label deal.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-[color:var(--color-charcoal)]">
            {[
              "Named approval before send, publish, or distribute",
              "No invented ownership, splits, or clearances",
              "No promises of playlist adds, sync wins, or stream counts",
              "Master Soul + audit trail for every major handoff",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 text-[color:var(--color-red)]" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden bg-[color:var(--color-charcoal)] px-8 py-10 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-gold)]">
            Hermes-clear · ROSTR-structured
          </p>
          <p className="font-heading mt-4 text-2xl leading-snug">
            Familiar agent UX. Your brand. Your Soul. Your roster.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/65">
            If you already use tools like Claude Code or Hermes, Agent feels like home — with music
            business specialists and Artispreneur guardrails instead of a blank prompt.
          </p>
          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
            <ArtispreneurMark size={48} variant="reversed" />
            <div>
              <p className="text-sm font-semibold">Master Agent online</p>
              <p className="text-xs text-white/50">Waiting on your PAL intake</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const tiers = [brand.pricing.free, brand.pricing.premium, brand.pricing.pro] as const;
  return (
    <section id="pricing" className="section bg-[color:var(--color-parchment)]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pricing</p>
          <h2 className="font-heading mt-3" style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
            Start free. Grow with the team.
          </h2>
          <p className="mt-4 text-[color:var(--color-warm-gray)]">
            Draft prices — correct them anytime. Roadmap assessment available as a $10 one-time add-on.
          </p>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col bg-white px-6 py-8 ${
                t.featured
                  ? "ring-2 ring-[color:var(--color-gold)] shadow-[0_12px_40px_rgba(245,193,0,0.18)]"
                  : "border border-[color:var(--color-border)]"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[color:var(--color-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-charcoal)]">
                  Most popular
                </span>
              )}
              <h3 className="font-heading text-2xl">{t.name}</h3>
              <p className="mt-2 text-sm text-[color:var(--color-warm-gray)]">{t.blurb}</p>
              <p className="mt-6">
                <span className="font-heading text-4xl text-[color:var(--color-red)]">
                  {t.price === 0 ? "$0" : `$${t.price}`}
                </span>
                <span className="ml-1 text-sm text-[color:var(--color-warm-gray)]">/{t.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-[color:var(--color-charcoal)]">
                    <span className="text-[color:var(--color-success)]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/onboarding"
                className={`btn btn--md btn--block mt-8 ${
                  t.featured ? "btn--gold" : t.name === "Pro" ? "btn--primary" : "btn--secondary"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section bg-white">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">FAQ</p>
        <h2 className="font-heading mt-3" style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
          Straight answers
        </h2>
        <div className="mt-10 divide-y divide-[color:var(--color-border)] border-y border-[color:var(--color-border)]">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-lg">{item.q}</span>
                  <span className="text-[color:var(--color-red)]" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-relaxed text-[color:var(--color-warm-gray)]">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section relative overflow-hidden bg-[color:var(--color-red)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 opacity-40 md:opacity-70"
      >
        <ArtispreneurMark size={280} variant="reversed" />
      </div>
      <div className="container-page relative z-10 grid items-center gap-10 md:grid-cols-[1.2fr_auto]">
        <div>
          <p className="eyebrow eyebrow-gold">Ready when you are</p>
          <h2 className="font-heading mt-3 max-w-xl" style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
            Run your career like a business.
          </h2>
          <p className="mt-4 max-w-lg text-white/90 leading-relaxed">
            Start with PAL onboarding. Walk out with Master Soul.md, a specialist roster, and a clear
            next-action plan.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link href="/onboarding" className="btn btn--gold btn--lg btn--pill">
            Get started free →
          </Link>
          <Link href="/onboarding" className="btn btn--outline-on-red btn--lg btn--pill">
            Try Patrick Diamitani demo
          </Link>
        </div>
      </div>
    </section>
  );
}
