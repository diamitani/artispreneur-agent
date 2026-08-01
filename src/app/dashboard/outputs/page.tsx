"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileOutput } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/lib/constants";

type Deliverable = {
  id?: string;
  name?: string;
  title?: string;
  path?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-50 text-green-700",
  sent: "bg-blue-50 text-blue-700",
  published: "bg-blue-50 text-blue-700",
  draft: "bg-amber-50 text-amber-700",
  pending: "bg-amber-50 text-amber-700",
};

export default function OutputsPage() {
  const [items, setItems] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/rostr/deliverables")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (!d.ok) throw new Error(d.error ?? "Failed to load outputs");
        setItems(d.deliverables ?? []);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Deliverables"
        title="Outputs"
        subtitle="Everything your agents have produced — drafts awaiting approval, approved work, and what has shipped."
      />

      {loading && (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={FileOutput}
          title="No outputs yet"
          description="Ask your agent to draft something — an EPK, a pitch, a release plan — and it will show up here for approval."
          actionLabel="Chat with your agent"
          actionHref={ROUTES.chat}
        />
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-3">
          {items.map((d, i) => {
            const status = (d.status ?? "draft").toLowerCase();
            return (
              <div
                key={d.id ?? d.path ?? i}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    {d.title ?? d.name ?? d.path ?? "Untitled deliverable"}
                  </p>
                  {d.path && (
                    <p className="mt-1 truncate font-mono text-[11px] text-gray-400">
                      {d.path}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                      STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {status}
                  </span>
                  {(d.updated_at ?? d.created_at) && (
                    <span className="text-xs text-gray-400">
                      {new Date(d.updated_at ?? d.created_at!).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 text-sm text-gray-500">
        Approvals and the full audit trail live in{" "}
        <Link href={ROUTES.workspace} className="font-medium text-crimson hover:underline">
          Hermes Mission Control
        </Link>
        .
      </p>
    </div>
  );
}
