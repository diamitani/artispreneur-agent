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

/**
 * Two-step signup that never leaves the page.
 *
 * The verification step stays in this component on purpose. Navigating to a
 * separate /signup/confirm route drops the password, which forced the user to
 * sign in again after verifying — a second sign-in form immediately after
 * creating an account. Keeping both steps here means the password is still in
 * React state when the code is confirmed, so `/api/auth/confirm` can create the
 * session in the same request and drop the artist straight into onboarding.
 *
 * The password lives in component memory for one page lifetime only: it is
 * never written to sessionStorage, localStorage, or a URL.
 */
export function SignUpForm({ returnTo = "/onboarding" }: { returnTo?: string }) {
  const router = useRouter();
  const [stage, setStage] = useState<"details" | "verify">("details");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  const passed = RULES.filter((r) => r.test(password)).length;
  const ready = Boolean(email) && passed === RULES.length;

  function finish() {
    window.location.href = returnTo;
  }

  async function createAccount(e: React.FormEvent) {
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

      // A pool set to auto-confirm skips verification entirely — POST directly
      // so the browser handles the 303 + Set-Cookie natively (fetch drops cookies on redirects).
      if (!data.needsConfirmation) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/api/auth/signin";
        const pairs: [string, string][] = [["email", email], ["password", password], ["returnTo", returnTo ?? "/onboarding"]];
        pairs.forEach(([k, v]) => {
          const inp = document.createElement("input");
          inp.type = "hidden"; inp.name = k; inp.value = v;
          form.appendChild(inp);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }

      setDestination(data.destination ?? null);
      setStage("verify");
      setBusy(false);
    } catch {
      setError("Network error. Check your connection and try again.");
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (busy || code.length < 4) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      // Passing the password lets the route confirm and sign in atomically.
      const res = await fetch("/api/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Confirmation failed.");
        setBusy(false);
        return;
      }

      if (data.signedIn) {
        finish();
        return;
      }

      // Confirmed but the sign-in leg did not take — send them to sign in
      // rather than stranding them on a form that now does nothing.
      window.location.href = `/signin?verified=1&email=${encodeURIComponent(email)}&next=${encodeURIComponent(returnTo)}`;
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
      setNotice(data.destination ? `New code sent to ${data.destination}.` : "New code sent.");
    } catch {
      setError("Network error. Try again.");
    }
  }

  // ── Step 2: verification ──────────────────────────────────────────────
  if (stage === "verify") {
    return (
      <form onSubmit={verify} className="space-y-4" noValidate>
        {error && <FormError>{error}</FormError>}
        {notice && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5 text-[13px] text-green-700">
            {notice}
          </p>
        )}

        <p className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] px-3.5 py-2.5 text-[13px] leading-relaxed text-[color:var(--color-gray-dark)]">
          We sent a code to{" "}
          <span className="font-semibold text-[color:var(--color-black)]">
            {destination ?? email}
          </span>
          . Enter it and you&apos;re in — no need to sign in again.
        </p>

        <Field label="Verification code">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
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
          {busy ? "Verifying…" : "Verify and continue"}
        </button>

        <div className="flex items-center justify-between pt-2 text-[13px]">
          <button
            type="button"
            onClick={resend}
            className="font-semibold text-[color:var(--color-crimson)] hover:underline"
          >
            Resend code
          </button>
          <button
            type="button"
            onClick={() => {
              setStage("details");
              setCode("");
              setError(null);
              setNotice(null);
            }}
            className="text-[color:var(--color-gray-mid)] hover:underline"
          >
            Use a different email
          </button>
        </div>
      </form>
    );
  }

  // ── Step 1: details ───────────────────────────────────────────────────
  return (
    <form onSubmit={createAccount} className="space-y-4" noValidate>
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
