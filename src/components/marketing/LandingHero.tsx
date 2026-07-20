"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/lib/brand";
import { HeroChat } from "./HeroChat";

const ease = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { n: "7", l: "AI Agents" },
  { n: "PAL", l: "Soul Runtime" },
  { n: "$0", l: "To Start" },
];

const AUDIENCE_PILLS = [
  { label: "Independent Artists", desc: "Your AI business team — PROs, contracts, releases." },
  { label: "Labels & Rosters", desc: "Manage every artist workspace from one command center." },
];

export function LandingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[color:var(--color-bg-dark)] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-studio.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-bg-dark)] via-[color:var(--color-bg-dark)]/90 to-[color:var(--color-bg-dark)]/70"
        />
      </div>

      <div className="container-page relative z-10 flex min-h-[100dvh] flex-col justify-center pb-16 pt-28 md:pb-20">
        {/* Two-column split — left copy, right live chat widget */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_480px] xl:gap-16">

          {/* LEFT — copy */}
          <div className="max-w-xl">
            {/* Audience pills */}
            <motion.div
              className="mb-6 flex flex-wrap gap-2"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              {AUDIENCE_PILLS.map((p) => (
                <span
                  key={p.label}
                  title={p.desc}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-white/60"
                >
                  {p.label}
                </span>
              ))}
            </motion.div>

            {/* Logo + brand */}
            <motion.div
              className="mb-6 flex items-center gap-3"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <Image
                src={brand.logo.primaryPng}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12"
                priority
              />
              <div>
                <p className="font-heading text-2xl tracking-tight text-white md:text-3xl">
                  Artispreneur
                </p>
                <p className="mt-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-gold)]">
                  Agent
                </p>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-heading text-white"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", lineHeight: 1.04 }}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
            >
              Your music business
              <br />
              <span className="text-[color:var(--color-gold)]">runs itself.</span>
            </motion.h1>

            {/* Sub-copy — dual audience */}
            <motion.div
              className="mt-5 space-y-3"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease }}
            >
              <p className="max-w-md text-[clamp(1rem,1.8vw,1.125rem)] leading-relaxed text-white/65">
                <span className="font-semibold text-white">Independent artists:</span>{" "}
                AI agents handle your PROs, distribution, licensing, contracts, and finances —
                so you can focus on making music.
              </p>
              <p className="max-w-md text-[clamp(0.9rem,1.6vw,1rem)] leading-relaxed text-white/50">
                <span className="font-semibold text-white/70">Labels & rosters:</span>{" "}
                One command center to run agent tasks, approvals, and reporting across every
                artist workspace you manage.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease }}
            >
              <a
                href="/api/auth/login?signup=1&return=/onboarding"
                className="btn btn--primary btn--lg"
              >
                Start for Free
              </a>
              <a href="/pricing#agency" className="btn btn--outline-on-dark btn--lg">
                Label & Roster Plans
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-10 flex gap-8"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.32 }}
            >
              {STATS.map((s) => (
                <div key={s.l}>
                  <p className="font-heading text-[22px] text-white md:text-[26px]">{s.n}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
                    {s.l}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-6 font-heading text-sm italic text-white/35"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {brand.tagline}
            </motion.p>
          </div>

          {/* RIGHT — live chat widget */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease }}
          >
            <HeroChat />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
