"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/lib/constants";

type VaultFile = {
  name?: string;
  path?: string;
  category?: string;
  size?: number;
  updated_at?: string;
};

type VaultResponse = {
  ok: boolean;
  error?: string;
  categories?: string[];
  files?: VaultFile[];
  counts?: { total: number; indexed: number };
};

/** Human labels for the knowledge-base folder slugs. */
const CATEGORY_LABELS: Record<string, string> = {
  "music-and-artist-assets": "Music & artist assets",
  "courses-and-guides": "Courses & guides",
  "contracts-and-templates": "Contracts & templates",
  "outreach-directories": "Outreach directories",
  "approved-reference-material": "Approved reference material",
};

function formatSize(bytes?: number) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function KnowledgePage() {
  const [data, setData] = useState<VaultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/vault/files")
      .then((r) => r.json())
      .then((d: VaultResponse) => {
        if (!alive) return;
        if (!d.ok) throw new Error(d.error ?? "Failed to load knowledge vault");
        setData(d);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const files = data?.files ?? [];
  const categories = data?.categories ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Knowledge vault"
        title="Knowledge"
        subtitle="What your agent reads before it drafts. Masters, contracts, directories, and reference material — scoped to your workspace only."
      />

      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Counts */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat label="Files" value={String(data?.counts?.total ?? 0)} />
            <Stat label="Indexed" value={String(data?.counts?.indexed ?? 0)} />
            <Stat label="Categories" value={String(categories.length)} />
          </div>

          {/* Category shelves */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const inCategory = files.filter((f) => f.category === c);
              return (
                <div
                  key={c}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {CATEGORY_LABELS[c] ?? c}
                    </h3>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                      {inCategory.length}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10.5px] text-gray-400">
                    01-knowledge-base/{c}
                  </p>
                  {inCategory.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {inCategory.slice(0, 4).map((f, i) => (
                        <li
                          key={f.path ?? i}
                          className="flex items-center justify-between gap-2 text-[12.5px] text-gray-600"
                        >
                          <span className="truncate">{f.name ?? f.path}</span>
                          {formatSize(f.size) && (
                            <span className="shrink-0 text-[11px] text-gray-400">
                              {formatSize(f.size)}
                            </span>
                          )}
                        </li>
                      ))}
                      {inCategory.length > 4 && (
                        <li className="text-[11.5px] text-gray-400">
                          +{inCategory.length - 4} more
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {files.length === 0 && (
            <EmptyState
              icon={BookOpen}
              title="Your vault is empty"
              description="Upload masters, contracts, and reference material so your agent works from your real context instead of guessing."
              actionLabel="Open Mission Control to upload"
              actionHref={ROUTES.workspace}
            />
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
