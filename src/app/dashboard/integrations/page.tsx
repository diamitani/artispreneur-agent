"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";

type Integration = {
  id: string;
  name: string;
  category: string;
  provider: "aws" | "composio" | "mcp" | "affiliate";
  status: "live" | "available" | "planned";
  purpose: string;
  handle: string | null;
  configured: boolean;
  connected: boolean;
  connectable: boolean;
  /** Config problems detected at runtime (currently Cognito only). */
  issues?: string[];
};

type Payload = {
  ok: boolean;
  error?: string;
  composio_configured: boolean;
  composio_error: string | null;
  mcp_servers: { id: string; name: string; endpoint: string; transport: string }[];
  counts: { total: number; connected: number; planned: number };
  integrations: Integration[];
};

const PROVIDER_LABEL: Record<Integration["provider"], string> = {
  aws: "AWS native",
  composio: "Composio",
  mcp: "Custom MCP",
  affiliate: "Partner link",
};

const PROVIDER_STYLE: Record<Integration["provider"], string> = {
  aws: "bg-amber-50 text-amber-700",
  composio: "bg-blue-50 text-blue-700",
  mcp: "bg-purple-50 text-purple-700",
  affiliate: "bg-gray-100 text-gray-600",
};

const PROVIDER_ORDER: Integration["provider"][] = ["aws", "mcp", "composio", "affiliate"];

const PROVIDER_BLURB: Record<Integration["provider"], string> = {
  aws: "Runs in our own AWS account. Your records, files, and agent memory never leave it.",
  mcp: "Music-domain systems Composio doesn't cover, served by our own MCP server — so the same tools work for our agents and any external MCP client.",
  composio: "Mainstream OAuth apps. Composio holds the tokens, so we never store your credentials.",
  affiliate: "No usable public API. The agent prepares the work and hands you a link to finish the filing.",
};

export default function IntegrationsPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/integrations")
      .then((r) => r.json())
      .then((d: Payload) => {
        if (!alive) return;
        if (!d.ok) throw new Error(d.error ?? "Failed to load integrations");
        setData(d);
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
        eyebrow="Connections"
        title="Integrations"
        subtitle="What your agents can reach. Every outbound action still passes through your approval queue."
      />

      {loading && (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Stat label="Available" value={String(data.counts.total - data.counts.planned)} />
            <Stat label="Connected" value={String(data.counts.connected)} />
            <Stat label="On the roadmap" value={String(data.counts.planned)} />
          </div>

          {!data.composio_configured && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Composio isn&apos;t configured on this deployment, so the OAuth apps
              below can&apos;t be connected yet. Set{" "}
              <code className="font-mono text-[12px]">COMPOSIO_API_KEY</code> to enable
              them.
            </div>
          )}
          {data.composio_error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Composio lookup failed: {data.composio_error}
            </div>
          )}

          {/* MCP servers we run */}
          <section className="mb-8 rounded-xl border border-purple-200 bg-purple-50/40 p-5">
            <h2 className="text-sm font-bold text-gray-900">MCP servers</h2>
            <p className="mt-1 text-[13px] text-gray-600">
              Tool servers we host. Any MCP client can point at these.
            </p>
            <ul className="mt-3 space-y-2">
              {data.mcp_servers.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg bg-white px-4 py-2.5"
                >
                  <span className="text-[13.5px] font-semibold text-gray-900">
                    {s.name}
                  </span>
                  <code className="font-mono text-[11.5px] text-gray-500">
                    {s.endpoint}
                  </code>
                  <span className="ml-auto rounded bg-purple-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-purple-700">
                    {s.transport}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Grouped by provider */}
          {PROVIDER_ORDER.map((provider) => {
            const group = data.integrations.filter((i) => i.provider === provider);
            if (!group.length) return null;
            return (
              <section key={provider} className="mb-8">
                <div className="mb-3">
                  <h2 className="text-sm font-bold text-gray-900">
                    {PROVIDER_LABEL[provider]}
                  </h2>
                  <p className="mt-0.5 max-w-2xl text-[12.5px] leading-relaxed text-gray-500">
                    {PROVIDER_BLURB[provider]}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.map((i) => (
                    <IntegrationCard key={i.id} integration={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}

function IntegrationCard({ integration: i }: { integration: Integration }) {
  const planned = i.status === "planned";
  return (
    <div
      className={`rounded-xl border bg-white p-5 ${
        planned ? "border-dashed border-gray-200 opacity-70" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-semibold text-gray-900">{i.name}</h3>
          <p className="mt-0.5 text-[11.5px] text-gray-400">{i.category}</p>
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PROVIDER_STYLE[i.provider]}`}
        >
          {PROVIDER_LABEL[i.provider]}
        </span>
      </div>

      <p className="mt-2.5 text-[13px] leading-relaxed text-gray-600">{i.purpose}</p>

      {i.issues && i.issues.length > 0 && (
        <ul className="mt-3 space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 p-3">
          {i.issues.map((msg) => (
            <li key={msg} className="text-[12px] leading-relaxed text-amber-800">
              {msg}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center gap-2">
        {planned ? (
          <span className="text-[12px] font-medium text-gray-400">On the roadmap</span>
        ) : i.connected ? (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            {i.provider === "composio" ? "Connected" : "Active"}
          </span>
        ) : i.connectable ? (
          <a
            href={`/api/composio/connections?app=${encodeURIComponent(i.handle ?? i.id)}`}
            className="text-[12px] font-semibold text-crimson hover:underline"
          >
            Connect →
          </a>
        ) : i.provider === "affiliate" && i.handle ? (
          <a
            href={i.handle}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] font-semibold text-crimson hover:underline"
          >
            Open partner →
          </a>
        ) : (
          <span className="text-[12px] text-gray-400">Not configured</span>
        )}
      </div>
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
