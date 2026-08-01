"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { brand } from "@/lib/brand";

type StepStatus = "pending" | "running" | "done" | "failed" | "skipped";

type StepState = {
  id: string;
  label: string;
  status: StepStatus;
  detail: string | null;
  error: string | null;
};

type ProvisionState = {
  status: "pending" | "running" | "complete" | "failed";
  workspace_path: string;
  steps: StepState[];
};

/** Shown before the server responds, so the list never starts empty. */
const PLACEHOLDER_STEPS: StepState[] = [
  { id: "database", label: "Provision control-plane records", status: "pending", detail: null, error: null },
  { id: "storage", label: "Build workspace storage structure", status: "pending", detail: null, error: null },
  { id: "compute", label: "Bind agent compute", status: "pending", detail: null, error: null },
  { id: "agent_install", label: "Install agent (soul, tool scripts, knowledge base)", status: "pending", detail: null, error: null },
];

const REDIRECT_DELAY_MS = 1400;

export function DeployWorkspace({ nextHref = "/dashboard" }: { nextHref?: string }) {
  const router = useRouter();
  const [state, setState] = useState<ProvisionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  // Provisioning is not idempotent-safe to fire twice concurrently, and React
  // StrictMode double-invokes effects in dev — so the kickoff is guarded.
  const started = useRef(false);

  const run = useCallback(async (force: boolean) => {
    setError(null);
    setRetrying(true);
    try {
      const res = await fetch("/api/userops/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(force ? { force: true } : {}),
      });

      if (res.status === 401) {
        window.location.href = "/api/auth/login?return=/deploy";
        return;
      }

      const data = await res.json();
      if (data?.state) setState(data.state);
      if (!data?.ok) {
        const failed = (data?.state?.steps as StepState[] | undefined)?.find(
          (s) => s.status === "failed",
        );
        setError(failed?.error ?? data?.error ?? "Provisioning failed.");
      }
    } catch {
      setError("Network error while deploying your workspace.");
    } finally {
      setRetrying(false);
    }
  }, []);

  // Kick off on mount. If the workspace is already provisioned the API is a
  // no-op and returns the completed state immediately.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void run(false);
  }, [run]);

  // Hand off to the dashboard once everything is green.
  useEffect(() => {
    if (state?.status !== "complete") return;
    const t = setTimeout(() => router.push(nextHref), REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [state?.status, router, nextHref]);

  const steps = state?.steps?.length ? state.steps : PLACEHOLDER_STEPS;
  const done = steps.filter((s) => s.status === "done" || s.status === "skipped").length;
  const pct = Math.round((done / steps.length) * 100);
  const complete = state?.status === "complete";
  const failed = state?.status === "failed" || Boolean(error);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[color:var(--color-bg-surface)] px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center gap-2.5">
          <Image
            src={brand.logo.primaryPng}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="font-heading text-[16px] text-[color:var(--color-black)]">
            Artispreneur
          </span>
        </div>

        <p className="type-mono-label text-[color:var(--color-crimson)]">
          {complete ? "Workspace ready" : failed ? "Deployment halted" : "Deploying"}
        </p>
        <h1
          className="font-heading mt-3 text-[color:var(--color-black)]"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", lineHeight: 1.15 }}
        >
          {complete
            ? "Your workspace is live."
            : failed
              ? "We hit a snag setting things up."
              : "Setting up your workspace…"}
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--color-gray-mid)]">
          {complete
            ? "Everything is provisioned. Taking you to your dashboard…"
            : failed
              ? "Nothing was lost — deployment resumes from the step that failed."
              : "Provisioning your records, storage, agent compute, and knowledge base. This takes about a minute."}
        </p>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11.5px] text-[color:var(--color-gray-mid)]">
              {done} of {steps.length} steps
            </span>
            <span className="font-mono text-[11.5px] font-bold text-[color:var(--color-black)]">
              {pct}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Workspace deployment progress"
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--color-border)]"
          >
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${
                failed
                  ? "bg-[color:var(--color-crimson)]"
                  : complete
                    ? "bg-[color:var(--color-success)]"
                    : "bg-[color:var(--color-gold)]"
              }`}
              style={{ width: `${Math.max(pct, 4)}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <ul className="mt-6 overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
          {steps.map((s, i) => (
            <li
              key={s.id}
              className={`flex items-start gap-3.5 px-5 py-4 ${
                i > 0 ? "border-t border-[color:var(--color-border)]" : ""
              }`}
            >
              <StepIcon status={s.status} />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[14px] font-semibold ${
                    s.status === "pending"
                      ? "text-[color:var(--color-gray-subtle)]"
                      : "text-[color:var(--color-black)]"
                  }`}
                >
                  {s.label}
                </p>
                {(s.detail || s.error) && (
                  <p
                    className={`mt-0.5 font-mono text-[11.5px] leading-relaxed ${
                      s.error
                        ? "text-[color:var(--color-crimson)]"
                        : "text-[color:var(--color-gray-mid)]"
                    }`}
                  >
                    {s.error ?? s.detail}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {error && !state?.steps?.some((s) => s.status === "failed") && (
          <p className="mt-4 text-[13px] text-[color:var(--color-crimson)]">{error}</p>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          {complete ? (
            <a href={nextHref} className="btn btn--primary btn--md">
              Go to dashboard
            </a>
          ) : failed ? (
            <>
              <button
                type="button"
                onClick={() => run(true)}
                disabled={retrying}
                className="btn btn--primary btn--md"
              >
                {retrying ? "Retrying…" : "Retry deployment"}
              </button>
              <a href="/dashboard" className="btn btn--outline btn--md">
                Skip for now
              </a>
            </>
          ) : (
            <button type="button" disabled className="btn btn--primary btn--md">
              Deploying…
            </button>
          )}
        </div>

        {state?.workspace_path && (
          <p className="mt-6 break-all font-mono text-[10.5px] leading-relaxed text-[color:var(--color-gray-subtle)]">
            {state.workspace_path}
          </p>
        )}
      </div>
    </div>
  );
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "done" || status === "skipped") {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success)]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-crimson)]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="mt-0.5 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[color:var(--color-border)] border-t-[color:var(--color-crimson)]" />
    );
  }
  return (
    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-[color:var(--color-border)]" />
  );
}
