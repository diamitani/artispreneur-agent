"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FormError, fieldClass } from "./AuthShell";

export function ConfirmForm({
  email,
  returnTo = "/onboarding",
}: {
  email: string;
  returnTo?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !code) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch("/api/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Confirmation failed.");
        setBusy(false);
        return;
      }

      // The password isn't held across the redirect, so confirmation hands
      // off to sign-in rather than silently creating a session.
      router.push(
        `/signin?verified=1&email=${encodeURIComponent(email)}&next=${encodeURIComponent(returnTo)}`,
      );
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not resend the code.");
        return;
      }
      setNotice(
        data.destination
          ? `New code sent to ${data.destination}.`
          : "New code sent.",
      );
    } catch {
      setError("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <FormError>{error}</FormError>}
      {notice && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5 text-[13px] text-green-700">
          {notice}
        </p>
      )}

      <Field label="Verification code">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
          disabled={busy}
          placeholder="123456"
          className={`${fieldClass} text-center font-mono text-[20px] tracking-[0.4em]`}
        />
      </Field>

      <button
        type="submit"
        disabled={busy || code.length < 4}
        className="btn btn--primary btn--md btn--block !mt-6"
      >
        {busy ? "Verifying…" : "Verify email"}
      </button>

      <div className="flex items-center justify-between pt-2 text-[13px]">
        <button
          type="button"
          onClick={resend}
          className="font-semibold text-[color:var(--color-crimson)] hover:underline"
        >
          Resend code
        </button>
        <Link href="/signup" className="text-[color:var(--color-gray-mid)] hover:underline">
          Use a different email
        </Link>
      </div>
    </form>
  );
}
