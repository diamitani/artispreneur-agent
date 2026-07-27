import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-[var(--font-display)] font-bold tracking-tight", className)}>
      <span className="text-crimson">Artis</span>
      <span>preneur</span>
    </span>
  );
}
