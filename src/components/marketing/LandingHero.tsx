"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/lib/brand";

const ease = [0.16, 1, 0.3, 1] as const;

export function LandingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[color:var(--color-bg-dark)] text-white">
      <div className="absolute inset-0">
        <Image
          src="/hero-studio.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[color:var(--color-bg-dark)]/78"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg-dark)] via-transparent to-[color:var(--color-bg-dark)]/55"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-[color:var(--color-bg-dark)] via-[color:var(--color-bg-dark)]/85 to-transparent"
        />
      </div>

      <div className="container-page relative z-10 flex min-h-[100dvh] flex-col justify-end pb-16 pt-28 md:justify-center md:pb-24 md:pt-20">
        <div className="max-w-xl">
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
              <p className="type-mono-label mt-0.5 text-[color:var(--color-gold)]">Agent</p>
            </div>
          </motion.div>

          <motion.h1
            className="font-heading text-white"
            style={{ fontSize: "clamp(2.4rem, 6.5vw, 4rem)", lineHeight: 1.05 }}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            Hire your AI
            <br />
            business team.
          </motion.h1>

          <motion.p
            className="mt-5 max-w-md text-[clamp(1rem,2vw,1.125rem)] leading-relaxed text-white/65"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease }}
          >
            Tell your Agent what you&apos;re trying to accomplish. It drafts the plan and the work
            — you approve before anything ships.
          </motion.p>

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
            <a href="#how" className="btn btn--outline-on-dark btn--lg">
              See How It Works
            </a>
          </motion.div>

          <motion.p
            className="mt-6 font-heading text-sm italic text-white/45"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            {brand.tagline}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
