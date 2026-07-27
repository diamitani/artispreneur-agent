"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TaskStatus, TaskPriority } from "@/types/task";

interface NewTaskFormProps {
  projectId: string;
  onSubmit: (data: {
    title: string;
    status?: TaskStatus;
    priority?: TaskPriority;
  }) => void;
  onCancel?: () => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export function NewTaskForm({ projectId, onSubmit, onCancel }: NewTaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);
  const [priority, setPriority] = useState<TaskPriority | undefined>(undefined);

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      status,
      priority,
    });
    setTitle("");
    setStatus(undefined);
    setPriority(undefined);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel?.();
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title..."
        autoFocus
        className="w-full border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />

      <div className="mt-2 flex items-center gap-2">
        <select
          value={status ?? ""}
          onChange={(e) =>
            setStatus(e.target.value ? (e.target.value as TaskStatus) : undefined)
          }
          className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 focus:border-gray-300 focus:outline-none"
        >
          <option value="">Status</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={priority ?? ""}
          onChange={(e) =>
            setPriority(
              e.target.value ? (e.target.value as TaskPriority) : undefined
            )
          }
          className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 focus:border-gray-300 focus:outline-none"
        >
          <option value="">Priority</option>
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-1.5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium text-white transition-colors",
              title.trim()
                ? "bg-[#CC0000] hover:bg-[#b00000]"
                : "cursor-not-allowed bg-gray-300"
            )}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
