import Image from "next/image";
import Link from "next/link";

/**
 * Temporary marketing stub — full marketing site comes next.
 * Primary CTA routes into PAL onboarding (product decision: intake first).
 */
export default function HomePage() {
  return (
    <main className="min-h-[100dvh] bg-[color:var(--parchment)]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Image src="/artispreneur-logo.png" alt="Artispreneur" width={140} height={36} className="h-9 w-auto" />
          <span className="hidden rounded border border-[color:var(--gold)]/40 bg-[color:var(--gold-tint)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--ink)] sm:inline">
            Agent
          </span>
        </div>
        <Link
          href="/onboarding"
          className="rounded-lg bg-[color:var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a81f24]"
        >
          Get started
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--red)]">
          Agent by Artispreneur
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.15] text-[color:var(--ink)] sm:text-5xl">
          Your AI business team — compiled around how you actually work.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--muted)]">
          Sign up, answer a short PAL intake, and get a Master Soul.md plus a specialist roster
          that drafts EPK, contracts, releases, outreach, and booking — with approval-first control.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/onboarding"
            className="rounded-xl bg-[color:var(--red)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#a81f24]"
          >
            Start PAL onboarding
          </Link>
          <Link
            href="/onboarding"
            className="rounded-xl border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--ink)]"
          >
            Try Patrick Diamitani demo
          </Link>
        </div>
        <p className="mt-10 text-xs text-[color:var(--muted)]">
          Flow: Marketing → Onboarding (PAL Roster Agent) → Mission Control
        </p>
      </section>
    </main>
  );
}
