import type { Metadata } from "next";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { PageHero } from "@/components/marketing/PageHero";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Reveal, RevealItem, RevealStagger } from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "About — Agent by Artispreneur",
  description: brand.mission,
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageHero
        dark
        eyebrow="About"
        title="Art Means Business."
        body={brand.mission}
      >
        <a
          href="/api/auth/login?signup=1&return=/onboarding"
          className="btn btn--primary btn--lg"
        >
          Become an Artispreneur
        </a>
      </PageHero>

      <section className="section bg-white">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Image
              src={brand.logo.primaryPng}
              alt={brand.logo.alt}
              width={120}
              height={120}
              className="h-[120px] w-[120px]"
            />
            <p className="mt-6 font-heading text-2xl italic text-[color:var(--color-gray-mid)]">
              {brand.secondaryTagline}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="type-mono-label mb-3 text-[color:var(--color-crimson)]">
              Why Agent exists
            </p>
            <h2
              className="font-heading text-[color:var(--color-black)]"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)" }}
            >
              Independent artists deserve manager-grade ops — without giving up ownership.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-gray-mid)] md:text-base">
              Agent by Artispreneur is the Hermes workspace under the Artispreneur product family.
              It compiles your intent with PAL/ROSTR, runs specialists approval-first, and stores
              your Soul and Skills on the AWS instance hierarchy owned by Diamitani Industries.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-[color:var(--color-bg-surface)]">
        <div className="container-page">
          <Reveal className="mb-10 max-w-lg">
            <p className="type-overline mb-2.5">Pillars</p>
            <h2 className="font-heading text-2xl text-[color:var(--color-black)] md:text-3xl">
              What we stand on
            </h2>
          </Reveal>
          <RevealStagger className="grid gap-4 md:grid-cols-3">
            {brand.pillars.map((p) => (
              <RevealItem key={p.id}>
                <article className="h-full rounded-[12px] border border-[color:var(--color-border)] bg-white p-6">
                  <h3 className="font-heading text-xl text-[color:var(--color-black)]">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
                    {p.body}
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <Reveal className="mb-8 max-w-lg">
            <p className="type-overline mb-2.5">Ecosystem</p>
            <h2 className="font-heading text-2xl text-[color:var(--color-black)] md:text-3xl">
              One family. Six platforms.
            </h2>
          </Reveal>
          <RevealStagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brand.products.map((p) => (
              <RevealItem key={p.id}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] p-5 transition-colors hover:border-[color:var(--color-crimson)]/30 hover:bg-white"
                >
                  <p className="font-heading text-lg text-[color:var(--color-black)]">{p.name}</p>
                  <p className="mt-1 font-mono text-[10px] text-[color:var(--color-gray-subtle)]">
                    {p.host}
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--color-gray-mid)]">{p.line}</p>
                </a>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <FinalCta />
    </MarketingShell>
  );
}
