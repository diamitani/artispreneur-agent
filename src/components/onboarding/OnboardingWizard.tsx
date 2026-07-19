"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ONBOARDING_STEPS, type OnboardingField } from "@/lib/rostr/onboarding-questions";
import type { PalCompilationResult } from "@/lib/rostr/pal-compiler";
import { cn } from "@/lib/utils";

type Answers = Record<string, string | string[]>;

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: OnboardingField;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={field.placeholder}
        className="w-full rounded-lg border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--red)]"
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--red)]"
      >
        <option value="">Select…</option>
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "multiselect" || field.type === "chips") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-wrap gap-2">
        {field.options?.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                if (on) onChange(selected.filter((x) => x !== o.value));
                else onChange([...selected, o.value]);
              }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                on
                  ? "border-[color:var(--red)] bg-[color:var(--red)] text-white"
                  : "border-[color:var(--border)] bg-white text-[color:var(--ink)] hover:border-[color:var(--red)]/40",
              )}
            >
              {o.label}
            </button>
          );
        })}
        {field.type === "chips" && (
          <input
            value=""
            placeholder={field.placeholder || "Add custom…"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const v = (e.target as HTMLInputElement).value.trim().toLowerCase();
                if (v && !selected.includes(v)) onChange([...selected, v]);
                (e.target as HTMLInputElement).value = "";
              }
            }}
            className="min-w-[140px] flex-1 rounded-full border border-dashed border-[color:var(--border)] bg-white px-3 py-1.5 text-xs outline-none"
          />
        )}
      </div>
    );
  }

  return (
    <input
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className="w-full rounded-lg border border-[color:var(--border)] bg-white px-3 py-2.5 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--red)]"
    />
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PalCompilationResult | null>(null);

  const step = ONBOARDING_STEPS[stepIdx];
  const progress = ((stepIdx + (result ? 1 : 0)) / (ONBOARDING_STEPS.length + 1)) * 100;

  const missingRequired = useMemo(() => {
    return step.fields
      .filter((f) => f.required)
      .filter((f) => {
        const v = answers[f.id];
        return Array.isArray(v) ? v.length === 0 : !v?.toString().trim();
      })
      .map((f) => f.id);
  }, [step, answers]);

  async function runPal(payload: { answers?: Answers; seed?: string }) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/pal/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, persist: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "PAL compilation failed");
      setResult(data.result as PalCompilationResult);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "artispreneur.pal",
          JSON.stringify({
            artist_id: data.result.workspace_config.artist_id,
            compiled_at: data.result.compiled_at,
            completeness: data.result.workspace_config.completeness,
          }),
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onContinue() {
    if (missingRequired.length) {
      setError(`Complete required fields: ${missingRequired.join(", ")}`);
      return;
    }
    setError(null);
    if (stepIdx < ONBOARDING_STEPS.length - 1) {
      setStepIdx((i) => i + 1);
      return;
    }
    await runPal({ answers });
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Header progress={100} />
        <div className="mt-8 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--red)]">
            PAL compiled · Roster ready
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[color:var(--ink)]">
            {String(result.workspace_config.artist_profile.stage_name)}&apos;s workspace is live
          </h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Completeness {result.workspace_config.completeness}% · Mode {result.workspace_config.mode} ·{" "}
            {result.workspace_config.roster.active.length} specialists activated
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {result.workspace_config.roster.active.map((s) => (
              <div key={s.id} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--parchment)] px-3 py-3">
                <p className="text-sm font-semibold text-[color:var(--ink)]">{s.name}</p>
                <p className="text-xs text-[color:var(--muted)]">{s.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Next actions (NPAO)
            </p>
            <ol className="mt-2 space-y-1.5">
              {result.next_actions.map((a) => (
                <li key={a} className="text-sm text-[color:var(--ink)]">
                  → {a}
                </li>
              ))}
            </ol>
          </div>

          <details className="mt-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--parchment)] p-4">
            <summary className="cursor-pointer text-sm font-semibold text-[color:var(--ink)]">
              Preview Master Soul.md
            </summary>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[color:var(--ink)]/80">
              {result.master_soul_md}
            </pre>
          </details>

          <button
            type="button"
            onClick={() =>
              router.push(`/workspace?artist=${result.workspace_config.artist_id}`)
            }
            className="mt-8 w-full rounded-xl bg-[color:var(--red)] px-4 py-3 text-sm font-semibold text-white hover:bg-[#a81f24]"
          >
            Enter Mission Control
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Header progress={progress} />

      <div className="mt-8 rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--gold)]">
              Step {stepIdx + 1} of {ONBOARDING_STEPS.length} · NPAO {step.npao}
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[color:var(--ink)]">
              {step.title}
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">{step.subtitle}</p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => runPal({ seed: "patrick" })}
            className="shrink-0 rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-[11px] font-semibold text-[color:var(--muted)] hover:border-[color:var(--gold)] hover:text-[color:var(--ink)]"
          >
            Use Patrick demo
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {step.fields.map((field) => (
            <label key={field.id} className="block">
              <span className="text-sm font-medium text-[color:var(--ink)]">
                {field.label}
                {field.required && <span className="text-[color:var(--red)]"> *</span>}
              </span>
              {field.help && (
                <span className="mt-0.5 block text-xs text-[color:var(--muted)]">{field.help}</span>
              )}
              <div className="mt-1.5">
                <FieldInput
                  field={field}
                  value={answers[field.id]}
                  onChange={(v) => setAnswers((a) => ({ ...a, [field.id]: v }))}
                />
              </div>
            </label>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={stepIdx === 0 || busy}
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            className="rounded-xl border border-[color:var(--border)] px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onContinue}
            className="rounded-xl bg-[color:var(--red)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a81f24] disabled:opacity-60"
          >
            {busy
              ? "Running PAL Roster Agent…"
              : stepIdx === ONBOARDING_STEPS.length - 1
                ? "Compile with PAL"
                : "Continue"}
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-[color:var(--muted)]">
        Intake runs through ROSTR PAL · webhook <code className="font-mono">/api/pal/intake</code>
      </p>
    </div>
  );
}

function Header({ progress }: { progress: number }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Image src="/artispreneur-mark.svg" alt="Artispreneur" width={36} height={36} />
        <div>
          <p className="text-sm font-semibold text-[color:var(--ink)]">Agent by Artispreneur</p>
          <p className="text-xs text-[color:var(--muted)]">PAL-compiled onboarding</p>
        </div>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[color:var(--border)]">
        <div
          className="h-full rounded-full bg-[color:var(--red)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
