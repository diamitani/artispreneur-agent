"use client";

import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/task";

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "#94a3b8" },
  todo: { label: "Todo", color: "#3b82f6" },
  in_progress: { label: "In Progress", color: "#f59e0b" },
  in_review: { label: "In Review", color: "#8b5cf6" },
  done: { label: "Done", color: "#22c55e" },
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
      style={{
        backgroundColor: `${config.color}15`,
        color: config.color,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
