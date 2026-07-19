import type { ReactNode } from "react";
import { PHASE_COLORS, type Phase } from "@/lib/brand";
import type { NpaoClass } from "@/lib/agents";
import { cn } from "@/lib/utils";

const NPAO_META: Record<NpaoClass, { label: string; color: string }> = {
  N: { label: "Necessity", color: "#e0503a" },
  A: { label: "Anxiety", color: "#f5c100" },
  P: { label: "Priority", color: "#4fb6e8" },
  O: { label: "Opportunity", color: "#4fd18b" },
};

export function NpaoTag({ npao, withLabel = false }: { npao: NpaoClass; withLabel?: boolean }) {
  const m = NPAO_META[npao];
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
      style={{ color: m.color, background: `${m.color}1a`, border: `1px solid ${m.color}33` }}
      title={`${m.label} — NPAO class ${npao}`}
    >
      {npao}
      {withLabel && <span className="font-medium normal-case tracking-normal opacity-80">{m.label}</span>}
    </span>
  );
}

export function PhasePill({ phase }: { phase: Phase }) {
  const color = PHASE_COLORS[phase];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
      style={{ color, background: `${color}14`, border: `1px solid ${color}30` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {phase}
    </span>
  );
}

export function Chip({
  children,
  color = "var(--muted)",
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
      style={{ color, background: `${color}14`, border: `1px solid ${color}2e` }}
    >
      {children}
    </span>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--line)] px-6 py-5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]/80">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-outfit)] text-xl font-semibold tracking-tight text-[color:var(--cream)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[color:var(--muted)]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 100 ? "var(--ok)" : score >= 80 ? "var(--gold)" : "var(--block)";
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
