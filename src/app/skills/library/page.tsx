"use client";

import { useEffect, useState } from "react";
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
  product?: { tagline?: string; format?: string; version?: string } | null;
};

export default function SkillsLibraryPage() {
  const [skills, setSkills] = useState<Owned[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function install(skillId: string) {
    await fetch("/api/skills/library", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId, install: true }),
    });
    setSkills((prev) =>
      prev.map((s) => (s.skill_id === skillId ? { ...s, installed: true } : s)),
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[color:var(--color-bg-surface)]">
      <header className="border-b border-[color:var(--color-border)] bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/skills" className="flex items-center gap-2">
            <Image src={brand.logo.primaryPng} alt="" width={32} height={32} />
            <span className="font-heading text-[15px]">My Skills Library</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/skills" className="btn btn--outline btn--sm">
              Marketplace
            </Link>
            <Link href="/workspace" className="btn btn--primary btn--sm">
              Workspace
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        <h1 className="font-heading text-3xl text-[color:var(--color-black)]">
          Your digital skill packs
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-gray-mid)]">
          Installed under your Agent workspace · Diamitani → Artispreneur → Agent
        </p>

        {loading && (
          <p className="mt-10 text-sm text-[color:var(--color-gray-mid)]">Loading library…</p>
        )}
        {error && <p className="mt-10 text-sm text-[color:var(--color-crimson)]">{error}</p>}

        {!loading && !error && skills.length === 0 && (
          <div className="mt-12 rounded-[10px] border border-dashed border-[color:var(--color-border)] bg-white p-10 text-center">
            <p className="font-heading text-xl">Your library is empty</p>
            <p className="mt-2 text-sm text-[color:var(--color-gray-mid)]">
              Browse the marketplace and add free skills during launch.
            </p>
            <Link href="/skills" className="btn btn--primary btn--md mt-6">
              Browse marketplace
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {skills.map((s) => (
            <article
              key={s.skill_id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-[color:var(--color-border)] bg-white p-5"
            >
              <div>
                <h2 className="font-heading text-lg">{s.name}</h2>
                <p className="mt-1 text-sm text-[color:var(--color-gray-mid)]">
                  {s.product?.tagline}
                </p>
                <p className="mt-2 font-mono text-[11px] text-[color:var(--color-gray-subtle)]">
                  {s.source} · {new Date(s.acquired_at).toLocaleDateString()} · v
                  {s.product?.version}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/skills/${s.slug}`} className="btn btn--ghost btn--sm">
                  Details
                </Link>
                {s.installed ? (
                  <span className="btn btn--secondary btn--sm pointer-events-none">Installed</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => install(s.skill_id)}
                    className="btn btn--primary btn--sm"
                  >
                    Mark installed
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
