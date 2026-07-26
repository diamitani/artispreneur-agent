"use client";

import { cn } from "@/lib/utils";
import { Calendar, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import type { Task } from "@/types/task";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  variant?: "kanban" | "board";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskCard({ task, onClick, variant = "kanban" }: TaskCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md",
        variant === "kanban" ? "p-3" : "p-4"
      )}
    >
      {/* Header: title + priority */}
      <div className="flex items-start justify-between gap-2">
        <h4
          className={cn(
            "font-medium text-gray-900",
            variant === "kanban" ? "text-sm" : "text-base",
            variant === "kanban" && "line-clamp-2"
          )}
        >
          {task.title}
        </h4>
        <PriorityBadge priority={task.priority} size="sm" />
      </div>

      {/* Board variant: description + tags */}
      {variant === "board" && (
        <>
          {task.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">
              {task.description}
            </p>
          )}
          {task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer: status, assignee, due date, subtasks */}
      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
        <StatusBadge status={task.status} size="sm" />

        {task.subtaskCount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <CheckSquare size={12} />
            {task.subtasksDone}/{task.subtaskCount}
          </span>
        )}

        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        )}

        {task.assignee && (
          <span
            className={cn(
              "ml-auto flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium text-white",
              task.assignee.type === "agent" ? "bg-purple-500" : "bg-gray-600"
            )}
            title={task.assignee.name}
          >
            {getInitials(task.assignee.name)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
