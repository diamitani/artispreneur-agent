"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FormError, fieldClass } from "./AuthShell";

const RULES = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
  { label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
];

/** Two steps in one component: request a code, then set the new password. */
export function ResetPasswordForm() {
  const router = useRouter();
  const [stage, setStage] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  const strong = RULES.every((r) => r.test(password));

  async function request(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !email) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not start a reset.");
        setBusy(false);
        return;
      }
      setDestination(data.destination ?? null);
      setStage("reset");
      setBusy(false);
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !code || !strong) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not reset your password.");
        setBusy(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  if (stage === "request") {
    return (
      <form onSubmit={request} className="space-y-4" noValidate>
        {error && <FormError>{error}</FormError>}
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </Field>
        <button
          type="submit"
          disabled={busy || !email}
          className="btn btn--primary btn--md btn--block !mt-6"
        >
          {busy ? "Sending…" : "Send reset code"}
        </button>
        <p className="pt-2 text-center text-[13.5px] text-[color:var(--color-gray-mid)]">
          <Link href="/signin" className="font-semibold text-[color:var(--color-crimson)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={reset} className="space-y-4" noValidate>
      {error && <FormError>{error}</FormError>}
      <p className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] px-3.5 py-2.5 text-[13px] text-[color:var(--color-gray-dark)]">
        If an account exists for {email}
        {destination ? `, a code went to ${destination}` : ", a code is on its way"}.
      </p>

      <Field label="Reset code">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
          disabled={busy}
          placeholder="123456"
          className={`${fieldClass} text-center font-mono text-[18px] tracking-[0.35em]`}
        />
      </Field>

      <Field label="New password">
        <input
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
          placeholder="Create a new password"
          className={fieldClass}
        />
      </Field>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {RULES.map((r) => {
          const ok = r.test(password);
          return (
            <li
              key={r.label}
              className={`text-[12px] ${
                ok ? "text-[color:var(--color-success)]" : "text-[color:var(--color-gray-subtle)]"
              }`}
            >
              {ok ? "✓" : "○"} {r.label}
            </li>
          );
        })}
      </ul>

      <button
        type="submit"
        disabled={busy || code.length < 4 || !strong}
        className="btn btn--primary btn--md btn--block !mt-6"
      >
        {busy ? "Resetting…" : "Reset password and sign in"}
      </button>
    </form>
  );
}
