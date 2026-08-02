"use client";

import { useState } from "react";

/**
 * Starts a subscription Checkout for a plan.
 *
 * The plan key is sent, never a price — the amount is resolved server-side from
 * PRICING so a tampered request cannot change what is charged.
 */
export function UpgradeButton({
  plan,
  label,
  className = "btn btn--primary btn--md",
}: {
  plan: "workspace" | "agency";
  label: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (res.status === 401) {
        // Send them to sign up, then straight back to finish the purchase.
        window.location.href = `/signup?next=${encodeURIComponent(`/pricing?plan=${plan}`)}`;
        return;
      }

      const data = await res.json();

      // Already subscribed — the API points at the portal instead.
      if (res.status === 409 && data.portal) {
        window.location.href = "/dashboard/settings";
        return;
      }

      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout.");
        setBusy(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      <button type="button" onClick={start} disabled={busy} className={`${className} btn--block`}>
        {busy ? "Opening checkout…" : label}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] text-[color:var(--color-crimson)]">
          {error}
        </p>
      )}
    </div>
  );
}
