"use client";

import { useEffect, useState } from "react";
import { UpgradeButton } from "./UpgradeButton";

type Upgradeable = {
  key: "workspace" | "agency";
  name: string;
  price: number;
  interval: string;
  description: string;
};

type Status = {
  ok: boolean;
  billing_configured: boolean;
  plan: string;
  plan_name: string;
  subscription_status: string | null;
  active: boolean;
  current_period_end: string | null;
  can_manage: boolean;
  upgradeable: Upgradeable[];
};

export function BillingPanel() {
  const [data, setData] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/billing/status")
      .then((r) => r.json())
      .then((d: Status) => alive && d.ok && setData(d))
      .catch(() => alive && setError("Could not load your plan."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  async function manage() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const d = await res.json();
      if (!res.ok || !d.url) {
        setError(d.error ?? "Could not open the billing portal.");
        setBusy(false);
        return;
      }
      window.location.href = d.url;
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl border border-gray-200 bg-white" />;
  }
  if (!data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error ?? "Could not load your plan."}
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Plan</h2>
          <p className="font-heading mt-1 text-[22px] text-[color:var(--color-black)]">
            {data.plan_name}
          </p>
          {data.subscription_status && (
            <p className="mt-1 text-[12.5px] text-gray-500">
              Subscription {data.subscription_status}
              {data.current_period_end
                ? ` · renews ${new Date(data.current_period_end).toLocaleDateString()}`
                : ""}
            </p>
          )}
        </div>
        {data.can_manage && (
          <button
            type="button"
            onClick={manage}
            disabled={busy}
            className="btn btn--outline btn--sm"
          >
            {busy ? "Opening…" : "Manage subscription"}
          </button>
        )}
      </div>

      {data.subscription_status === "past_due" && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-800">
          Your last payment failed. Update your card to keep your plan — we
          won&apos;t cut you off while Stripe is still retrying.
        </p>
      )}

      {!data.billing_configured ? (
        <p className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-600">
          Billing isn&apos;t configured on this deployment, so upgrades are
          unavailable. Set <code className="font-mono text-[12px]">STRIPE_SECRET_KEY</code>{" "}
          and <code className="font-mono text-[12px]">STRIPE_WEBHOOK_SECRET</code>.
        </p>
      ) : (
        data.upgradeable.length > 0 && (
          <div className="mt-6">
            <p className="text-[12.5px] font-semibold text-gray-500">
              {data.active ? "Change plan" : "Upgrade"}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {data.upgradeable.map((p) => (
                <div key={p.key} className="rounded-lg border border-gray-200 p-4">
                  <p className="text-[14px] font-bold text-gray-900">{p.name}</p>
                  <p className="mt-0.5 text-[13px] text-gray-500">
                    ${p.price}/{p.interval}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-gray-600">
                    {p.description}
                  </p>
                  <div className="mt-3">
                    <UpgradeButton
                      plan={p.key}
                      label={`Switch to ${p.name}`}
                      className="btn btn--primary btn--sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {error && (
        <p role="alert" className="mt-4 text-[12.5px] text-[color:var(--color-crimson)]">
          {error}
        </p>
      )}
    </section>
  );
}
