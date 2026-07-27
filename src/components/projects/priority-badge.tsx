"use client";

import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";
import type { TaskPriority } from "@/types/task";

const priorityConfig: Record<
  Exclude<TaskPriority, "none">,
  { label: string; color: string }
> = {
  urgent: { label: "Urgent", color: "#dc2626" },
  high: { label: "High", color: "#f97316" },
  medium: { label: "Medium", color: "#eab308" },
  low: { label: "Low", color: "#6b7280" },
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: "sm" | "md";
}

export function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  if (priority === "none") return null;

  const config = priorityConfig[priority];
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        size === "sm" ? "text-xs" : "text-xs"
      )}
      style={{ color: config.color }}
    >
      <Flag size={iconSize} style={{ color: config.color }} fill={config.color} />
      {size === "md" && <span>{config.label}</span>}
    </span>
  );
}
