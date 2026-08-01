"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FormError, fieldClass } from "./AuthShell";

/** Mirrors PASSWORD_RULES in cognito-direct.ts, for live client-side feedback. */
const RULES = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
  { label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
];

export function SignUpForm({ returnTo = "/onboarding" }: { returnTo?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passed = RULES.filter((r) => r.test(password)).length;
  const ready = Boolean(email) && passed === RULES.length;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !ready) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Sign-up failed.");
        setBusy(false);
        return;
      }

      // A pool set to auto-confirm skips the code step entirely.
      if (!data.needsConfirmation) {
        const signin = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (signin.ok) {
          router.push(returnTo);
          router.refresh();
          return;
        }
      }

      router.push(
        `/signup/confirm?email=${encodeURIComponent(email)}&next=${encodeURIComponent(returnTo)}`,
      );
    } catch {
      setError("Network error. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <FormError>{error}</FormError>}

      <Field label="Artist or band name">
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          placeholder="How you're credited"
          className={fieldClass}
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          placeholder="you@example.com"
          className={fieldClass}
        />
      </Field>

      <Field label="Password">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            placeholder="Create a password"
            className={`${fieldClass} pr-16`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[color:var(--color-gray-mid)] hover:text-[color:var(--color-black)]"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </Field>

      {/* Live requirements — no surprise rejections from Cognito. */}
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {RULES.map((r) => {
          const ok = r.test(password);
          return (
            <li
              key={r.label}
              className={`flex items-center gap-1.5 text-[12px] ${
                ok
                  ? "text-[color:var(--color-success)]"
                  : "text-[color:var(--color-gray-subtle)]"
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ok ? <path d="M20 6L9 17l-5-5" /> : <circle cx="12" cy="12" r="9" />}
              </svg>
              {r.label}
            </li>
          );
        })}
      </ul>

      <button
        type="submit"
        disabled={busy || !ready}
        className="btn btn--primary btn--md btn--block !mt-6"
      >
        {busy ? "Creating your account…" : "Create account"}
      </button>

      <p className="text-center text-[12px] leading-relaxed text-[color:var(--color-gray-subtle)]">
        We&apos;ll deploy your workspace right after you verify your email.
      </p>

      <p className="pt-1 text-center text-[13.5px] text-[color:var(--color-gray-mid)]">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-[color:var(--color-crimson)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
