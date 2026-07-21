"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PalCompilationResult } from "@/lib/rostr/pal-compiler";
import { brand } from "@/lib/brand";
import { MasterAgentChat } from "./MasterAgentChat";
import { AgentSelector } from "./AgentSelector";

type HermesSnap = {
  soul_loaded: boolean;
  active_skills: { slug: string; name: string; specialist_id?: string }[];
  runtime: string;
  aws_instance?: { hub_backend: string; dynamodb_enabled: boolean };
};

/**
 * Mission Control — Hermes shell powered by PAL/ROSTR + Skills Library.
 */
export function WorkspaceMissionControl({ artistId }: { artistId?: string }) {
  const [result, setResult] = useState<PalCompilationResult | null>(null);
  const [hermes, setHermes] = useState<HermesSnap | null>(null);
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

    fetch("/api/hermes/runtime")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok) setHermes(d.hermes);
      })
      .catch(() => undefined);
  }, [artistId]);

  if (error) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[color:var(--color-bg-page)] px-6">
        <Image src={brand.logo.primaryPng} alt="" width={48} height={48} />
        <p className="text-sm text-[color:var(--color-text-muted)]">{error}</p>
        <Link href="/onboarding" className="btn btn--primary btn--sm">
          Run PAL onboarding
        </Link>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[color:var(--color-bg-page)] text-sm text-[color:var(--color-text-muted)]">
        Loading workspace config…
      </main>
    );
  }

  const name = String(result.workspace_config?.artist_profile?.stage_name ?? "Artist");
  const roster = result.workspace_config?.roster?.active ?? [];
  const plan = result.npao_plan ?? [];
  const first = name.split(" ")[0];

  return (
    <div className="min-h-[100dvh] bg-[color:var(--color-bg-page)] text-[color:var(--color-text-primary)]">
      <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src={brand.logo.primaryPng} alt="" width={32} height={32} />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-heading text-[15px] text-[color:var(--color-text-primary)]">Artispreneur</p>
                <span className="badge-agent">AGENT</span>
              </div>
              <p className="font-mono text-[10px] text-[color:var(--color-text-dim)]">
                Diamitani → Artispreneur → Agent · {name} ·{" "}
                {result.workspace_config.completeness}% · hub:{" "}
                {hermes?.aws_instance?.hub_backend || "fs"}
                {hermes?.aws_instance?.dynamodb_enabled ? " · DDB" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/skills/library"
              className="text-xs font-semibold text-[color:var(--color-gold)] hover:text-[color:var(--color-gold-light)]"
            >
              Skills Library
              {hermes?.active_skills?.length
                ? ` · ${hermes.active_skills.length}`
                : ""}
            </Link>
            <Link href="/skills" className="text-xs font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
              Marketplace
            </Link>
            <Link href="/onboarding" className="text-xs font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
              Recompile Soul
            </Link>
            <AgentSelector className="mr-2" />
            <a href="/api/auth/logout" className="text-xs text-[color:var(--color-text-dim)] hover:text-[color:var(--color-gold)]">
              Sign out
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-7 lg:grid-cols-[1fr_300px]">
        <section className="space-y-5">
          <div className="relative overflow-hidden rounded-[10px] bg-[color:var(--color-surface)] px-7 py-6 border border-[color:var(--color-border)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-5 -top-5 h-44 w-44 rounded-full bg-[color:var(--color-gold-muted)]"
            />
            <p className="type-mono-label relative mb-1.5 text-[color:var(--color-gold)]">
              Welcome back
            </p>
            <h1 className="font-heading relative text-2xl text-[color:var(--color-text-primary)]">
              What should we work on, {first}?
            </h1>
            <p className="relative mt-2 max-w-lg text-sm text-[color:var(--color-text-muted)]">
              Hermes on Bedrock DeepSeek — PAL/ROSTR Soul + installed Skills.
              Specialists draft; you approve. {brand.tagline}
            </p>
          </div>

          <MasterAgentChat artistId={result.workspace_config.artist_id} />

          <div className="rounded-[8px] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] p-5 shadow-[var(--shadow-sm)]">
            <p className="type-overline mb-3">Next actions · N→A→P→O</p>
            <ul className="space-y-2">
              {plan.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start gap-3 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-3"
                >
                  <span className="mt-0.5 rounded bg-[color:var(--color-gold-muted)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[color:var(--color-gold)]">
                    {t.npao}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{t.title}</p>
                    <p className="text-xs text-[color:var(--color-text-dim)]">
                      {t.agent} · {t.phase}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[8px] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] p-4 shadow-[var(--shadow-sm)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="type-overline">Skills in Hermes</p>
              <Link
                href="/skills/library"
                className="font-mono text-[10px] text-[color:var(--color-gold)] hover:text-[color:var(--color-gold-light)]"
              >
                Manage
              </Link>
            </div>
            {hermes?.active_skills?.length ? (
              <ul className="space-y-2.5">
                {hermes.active_skills.map((s) => (
                  <li key={s.slug} className="text-sm">
                    <span className="font-semibold text-[color:var(--color-text-primary)]">
                      {s.name}
                    </span>
                    <span className="block font-mono text-[10px] text-[color:var(--color-text-dim)]">
                      {s.specialist_id || "general"} · active
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[color:var(--color-text-muted)]">
                No packs installed.{" "}
                <Link href="/skills" className="text-[color:var(--color-gold)] hover:text-[color:var(--color-gold-light)] underline">
                  Claim skills
                </Link>{" "}
                to unlock Hermes capabilities.
              </p>
            )}
          </div>

          <div className="rounded-[8px] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] p-4 shadow-[var(--shadow-sm)]">
            <p className="type-overline mb-3">Active roster</p>
            <ul className="space-y-2.5">
              {roster.map((s) => (
                <li key={s.id} className="text-sm">
                  <span className="font-semibold text-[color:var(--color-text-primary)]">{s.name}</span>
                  <span className="block text-xs text-[color:var(--color-text-muted)]">{s.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[8px] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] p-4 shadow-[var(--shadow-sm)]">
            <p className="type-overline mb-3">Artifacts</p>
            <ul className="space-y-2 font-mono text-[11px] text-[color:var(--color-text-muted)]">
              {(result.artifacts ?? []).map((a) => (
                <li key={a.path}>{a.path}</li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
