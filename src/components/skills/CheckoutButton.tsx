"use client";

import { useState } from "react";

export function CheckoutButton({
  slug,
  free,
  className = "btn btn--primary btn--lg",
}: {
  slug: string;
  free: boolean;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/skills/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = `/api/auth/login?signup=1&return=/skills/${slug}`;
        return;
      }
      if (!res.ok || !data.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={start} disabled={busy} className={className}>
        {busy ? "Working…" : free ? "Add to library — Free" : "Buy with Stripe"}
      </button>
      {error && <p className="mt-2 text-sm text-[color:var(--color-crimson)]">{error}</p>}
    </div>
  );
}
