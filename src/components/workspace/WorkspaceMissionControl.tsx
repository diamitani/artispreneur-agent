"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PalCompilationResult } from "@/lib/rostr/pal-compiler";

/**
 * Lightweight Mission Control — loads PAL compilation.
 * Full Hermes shell (chat, projects, vault) lands next; this proves the intake → workspace handoff.
 */
export function WorkspaceMissionControl({ artistId }: { artistId?: string }) {
  const [result, setResult] = useState<PalCompilationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let id = artistId;
    if (!id && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("artispreneur.pal");
        if (raw) id = JSON.parse(raw).artist_id;
      } catch {
        /* ignore */
      }
    }
    if (!id) {
      setError("No compiled workspace yet. Run onboarding first.");
      return;
    }
    fetch(`/api/pal/intake/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) throw new Error(d.error || "Not found");
        setResult(d.result);
      })
      .catch((e) => setError(e.message));
  }, [artistId]);

  if (error) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[color:var(--parchment)] px-6">
        <p className="text-sm text-[color:var(--muted)]">{error}</p>
        <Link href="/onboarding" className="rounded-xl bg-[color:var(--red)] px-4 py-2 text-sm font-semibold text-white">
          Run PAL onboarding
        </Link>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[color:var(--parchment)] text-sm text-[color:var(--muted)]">
        Loading workspace config…
      </main>
    );
  }

  const name = String(result.workspace_config?.artist_profile?.stage_name ?? "Artist");
  const roster = result.workspace_config?.roster?.active ?? [];
  const plan = result.npao_plan ?? [];

  return (
    <div className="min-h-[100dvh] bg-[color:var(--parchment)] text-[color:var(--ink)]">
      <header className="border-b border-[color:var(--border)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/artispreneur-mark.svg" alt="" width={32} height={32} />
            <div>
              <p className="text-sm font-semibold">Mission Control</p>
              <p className="text-[11px] text-[color:var(--muted)]">
                {name} · {result.workspace_config.completeness}% complete · Agent by Artispreneur
              </p>
            </div>
          </div>
          <Link href="/onboarding" className="text-xs font-semibold text-[color:var(--red)]">
            Recompile Soul
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-[color:var(--border)] bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--gold)]">
              Command bar
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl">
              What should we work on, {name.split(" ")[0]}?
            </h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Master Agent routes through ROSTR. Specialists draft; you approve. Chat runtime (Bedrock) wires next.
            </p>
            <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--parchment)] px-3 py-3 text-sm text-[color:var(--muted)]">
              Try: “Prep my EPK and a 42-day plan for the next release”
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Next actions · N→A→P→O
            </p>
            <ul className="mt-3 space-y-2">
              {plan.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start gap-3 rounded-xl border border-[color:var(--border)] px-3 py-3"
                >
                  <span className="mt-0.5 rounded bg-[color:var(--gold-tint)] px-1.5 py-0.5 text-[10px] font-bold text-[color:var(--ink)]">
                    {t.npao}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-[color:var(--muted)]">
                      {t.agent} · {t.phase}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Active roster
            </p>
            <ul className="mt-3 space-y-2">
              {roster.map((s) => (
                <li key={s.id} className="text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="block text-xs text-[color:var(--muted)]">{s.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[color:var(--border)] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Artifacts
            </p>
            <ul className="mt-3 space-y-2 text-xs text-[color:var(--ink)]">
              {(result.artifacts ?? []).map((a) => (
                <li key={a.path} className="font-mono">
                  {a.path}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
