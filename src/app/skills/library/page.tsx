"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/brand";

type Owned = {
  skill_id: string;
  slug: string;
  name: string;
  acquired_at: string;
  source: string;
  installed: boolean;
  hermes_active?: boolean;
  product?: {
    tagline?: string;
    format?: string;
    version?: string;
    agent?: string;
    specialistId?: string;
    category?: string;
  } | null;
};

type HermesSnap = {
  soul_loaded: boolean;
  pal_loaded: boolean;
  completeness: number | null;
  active_skills: { slug: string; name: string; specialist_id?: string }[];
  runtime: string;
  owned_count: number;
  aws_instance?: {
    hub_backend: string;
    s3_bucket: string | null;
    dynamodb_table: string | null;
    dynamodb_enabled: boolean;
    region: string;
  };
};

export default function SkillsLibraryPage() {
  const [skills, setSkills] = useState<Owned[]>([]);
  const [hermes, setHermes] = useState<HermesSnap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/skills/library")
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/api/auth/login?return=/skills/library";
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (!d.ok) throw new Error(d.error || "Failed to load");
        setSkills(d.skills || []);
        setHermes(d.hermes || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setInstall(skillId: string, install: boolean) {
    setBusyId(skillId);
    try {
      const r = await fetch("/api/skills/library", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, install }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || "Update failed");
      setSkills((prev) =>
        prev.map((s) =>
          s.skill_id === skillId
            ? { ...s, installed: install, hermes_active: install }
            : s,
        ),
      );
      if (d.active_skills) {
        setHermes((h) =>
          h
            ? {
                ...h,
                active_skills: d.active_skills,
                owned_count: skills.length,
              }
            : h,
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = skills.filter((s) => s.installed).length;

  return (
    <div className="min-h-[100dvh] bg-[color:var(--color-bg-surface)]">
      <header className="border-b border-[color:var(--color-border)] bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/skills" className="flex items-center gap-2">
            <Image src={brand.logo.primaryPng} alt="" width={32} height={32} />
            <span className="font-heading text-[15px]">Skills Library</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/skills" className="btn btn--outline btn--sm">
              Marketplace
            </Link>
            <Link href="/workspace" className="btn btn--primary btn--sm">
              Open workspace
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        <p className="type-mono-label text-[color:var(--color-crimson)]">
          YOUR WORKSPACE · SKILLS
        </p>
        <h1 className="mt-2 font-heading text-3xl text-[color:var(--color-black)]">
          Your Skills Library
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-gray-mid)]">
          Packs you own live here. Active packs are ready for your Agent — EPK, deals, release,
          outreach, and more.
        </p>

        {hermes && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Owned" value={String(skills.length)} />
            <Stat label="Active" value={String(activeCount)} />
            <Stat
              label="Artist profile"
              value={hermes.soul_loaded ? "Ready" : "Needs setup"}
              warn={!hermes.soul_loaded}
            />
            <Stat
              label="Setup"
              value={
                hermes.completeness != null ? `${hermes.completeness}%` : "—"
              }
            />
          </div>
        )}

        {loading && (
          <p className="mt-10 text-sm text-[color:var(--color-gray-mid)]">
            Loading library…
          </p>
        )}
        {error && (
          <p className="mt-10 text-sm text-[color:var(--color-crimson)]">{error}</p>
        )}

        {!loading && !error && skills.length === 0 && (
          <div className="mt-12 border border-dashed border-[color:var(--color-border)] bg-white p-10 text-center">
            <p className="font-heading text-xl">Your library is empty</p>
            <p className="mt-2 text-sm text-[color:var(--color-gray-mid)]">
              Claim free packs from the marketplace — they activate in your workspace
              automatically.
            </p>
            <Link href="/skills" className="btn btn--primary btn--md mt-6">
              Browse marketplace
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {skills.map((s) => {
            const active = s.installed || s.hermes_active;
            return (
              <article
                key={s.skill_id}
                className="flex flex-wrap items-center justify-between gap-4 border border-[color:var(--color-border)] bg-white p-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading text-lg">{s.name}</h2>
                    {active ? (
                      <span className="rounded bg-[color:var(--color-gold-light)] px-2 py-0.5 font-mono text-[10px] font-bold text-[color:var(--color-black)]">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="rounded bg-[color:var(--color-bg-surface)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--color-gray-mid)]">
                        OWNED · OFF
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--color-gray-mid)]">
                    {s.product?.tagline}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-[color:var(--color-gray-subtle)]">
                    {s.product?.agent}
                    {s.product?.category ? ` · ${s.product.category}` : ""} · v
                    {s.product?.version} ·{" "}
                    {new Date(s.acquired_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/skills/${s.slug}`} className="btn btn--ghost btn--sm">
                    Details
                  </Link>
                  {active ? (
                    <>
                      <Link
                        href={`/workspace?skill=${s.slug}`}
                        className="btn btn--gold btn--sm"
                      >
                        Use with Agent
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === s.skill_id}
                        onClick={() => setInstall(s.skill_id, false)}
                        className="btn btn--outline btn--sm"
                      >
                        {busyId === s.skill_id ? "…" : "Turn off"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === s.skill_id}
                      onClick={() => setInstall(s.skill_id, true)}
                      className="btn btn--primary btn--sm"
                    >
                      {busyId === s.skill_id ? "…" : "Activate"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {!hermes?.soul_loaded && skills.length > 0 && (
          <p className="mt-8 text-sm text-[color:var(--color-gray-mid)]">
            Tip: finish{" "}
            <Link href="/onboarding" className="text-[color:var(--color-crimson)] underline">
              your setup brief
            </Link>{" "}
            so your Agent knows your story — skills land harder with it.
          </p>
        )}
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="border border-[color:var(--color-border)] bg-white px-4 py-3">
      <p className="type-mono-label text-[color:var(--color-gray-mid)]">{label}</p>
      <p
        className={`mt-1 font-heading text-xl ${
          warn ? "text-[color:var(--color-crimson)]" : "text-[color:var(--color-black)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
