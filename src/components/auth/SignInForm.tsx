"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, FormError, fieldClass } from "./AuthShell";

export function SignInForm({
  returnTo = "/dashboard",
  initialEmail = "",
}: {
  returnTo?: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        // An unverified account isn't a dead end — send them to the code screen.
        if (data.code === "unconfirmed") {
          router.push(
            `/signup/confirm?email=${encodeURIComponent(email)}&next=${encodeURIComponent(returnTo)}`,
          );
          return;
        }
        setError(data.error ?? "Sign-in failed.");
        setBusy(false);
        return;
      }

      router.push(returnTo);
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {error && <FormError>{error}</FormError>}

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

      <Field
        label="Password"
        hint={
          <Link
            href="/forgot-password"
            className="text-[12.5px] font-medium text-[color:var(--color-crimson)] hover:underline"
          >
            Forgot?
          </Link>
        }
      >
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            placeholder="Your password"
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

      <button
        type="submit"
        disabled={busy || !email || !password}
        className="btn btn--primary btn--md btn--block !mt-6"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      {/* The pool runs with PreventUserExistenceErrors enabled, so Cognito
          masks UserNotConfirmedException behind a generic failure. Without a
          standing link here, someone who abandoned signup mid-way would see
          only "incorrect email or password" and have no route forward. */}
      <p className="pt-1 text-center text-[12.5px] text-[color:var(--color-gray-mid)]">
        Signed up but never got the code?{" "}
        <Link
          href={`/signup/confirm?email=${encodeURIComponent(email)}`}
          className="font-medium text-[color:var(--color-crimson)] hover:underline"
        >
          Verify your email
        </Link>
      </p>

      <p className="pt-1 text-center text-[13.5px] text-[color:var(--color-gray-mid)]">
        New here?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[color:var(--color-crimson)] hover:underline"
        >
          Create your workspace
        </Link>
      </p>
    </form>
  );
}
