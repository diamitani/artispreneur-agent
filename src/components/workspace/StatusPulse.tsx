import { cn } from "@/lib/utils";

const map = {
  online: { color: "var(--ok)", label: "Online" },
  working: { color: "var(--gold)", label: "Working" },
  idle: { color: "var(--muted)", label: "Idle" },
} as const;

export function StatusPulse({
  status,
  className,
}: {
  status: "online" | "working" | "idle";
  className?: string;
}) {
  const s = map[status];
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)} title={s.label}>
      {status !== "idle" && (
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ background: s.color, animation: "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite" }}
        />
      )}
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
    </span>
  );
}
