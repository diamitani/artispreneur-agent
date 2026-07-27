"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import type { Task, TaskStatus, TaskPriority } from "@/types/task";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

type SortField = "title" | "status" | "priority" | "assignee" | "dueDate" | "npaoPhase";
type SortDirection = "asc" | "desc";

const priorityOrder: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

const statusOrder: Record<TaskStatus, number> = {
  backlog: 0,
  todo: 1,
  in_progress: 2,
  in_review: 3,
  done: 4,
};

const phaseLabels: Record<string, string> = {
  navigate: "Navigate",
  align: "Align",
  plan: "Plan",
  operate: "Operate",
};

export function ListView({ tasks, onTaskClick, onStatusChange }: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "status":
          cmp = statusOrder[a.status] - statusOrder[b.status];
          break;
        case "priority":
          cmp = (priorityOrder[a.priority] ?? 0) - (priorityOrder[b.priority] ?? 0);
          break;
        case "assignee":
          cmp = (a.assignee?.name ?? "").localeCompare(b.assignee?.name ?? "");
          break;
        case "dueDate":
          cmp = (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
          break;
        case "npaoPhase":
          cmp = (a.npaoPhase ?? "").localeCompare(b.npaoPhase ?? "");
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [tasks, sortField, sortDirection]);

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp size={14} className="text-gray-400" />
    ) : (
      <ChevronDown size={14} className="text-gray-400" />
    );
  }

  function handleMarkDone(e: React.MouseEvent, task: Task) {
    e.stopPropagation();
    onStatusChange(
      task.id,
      task.status === "done" ? "todo" : "done"
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="w-10 px-3 py-2.5" />
            <th
              className="cursor-pointer px-3 py-2.5 font-medium text-gray-600 hover:text-gray-900"
              onClick={() => handleSort("title")}
            >
              <span className="inline-flex items-center gap-1">
                Title <SortIcon field="title" />
              </span>
            </th>
            <th
              className="cursor-pointer px-3 py-2.5 font-medium text-gray-600 hover:text-gray-900"
              onClick={() => handleSort("status")}
            >
              <span className="inline-flex items-center gap-1">
                Status <SortIcon field="status" />
              </span>
            </th>
            <th
              className="cursor-pointer px-3 py-2.5 font-medium text-gray-600 hover:text-gray-900"
              onClick={() => handleSort("priority")}
            >
              <span className="inline-flex items-center gap-1">
                Priority <SortIcon field="priority" />
              </span>
            </th>
            <th
              className="cursor-pointer px-3 py-2.5 font-medium text-gray-600 hover:text-gray-900"
              onClick={() => handleSort("assignee")}
            >
              <span className="inline-flex items-center gap-1">
                Assignee <SortIcon field="assignee" />
              </span>
            </th>
            <th
              className="cursor-pointer px-3 py-2.5 font-medium text-gray-600 hover:text-gray-900"
              onClick={() => handleSort("dueDate")}
            >
              <span className="inline-flex items-center gap-1">
                Due Date <SortIcon field="dueDate" />
              </span>
            </th>
            <th
              className="cursor-pointer px-3 py-2.5 font-medium text-gray-600 hover:text-gray-900"
              onClick={() => handleSort("npaoPhase")}
            >
              <span className="inline-flex items-center gap-1">
                Phase <SortIcon field="npaoPhase" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => (
            <tr
              key={task.id}
              className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
              onClick={() => onTaskClick(task)}
            >
              <td className="px-3 py-2.5">
                <button
                  onClick={(e) => handleMarkDone(e, task)}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                    task.status === "done"
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                >
                  {task.status === "done" && <Check size={12} />}
                </button>
              </td>
              <td className="px-3 py-2.5 font-medium text-gray-900">
                {task.title}
              </td>
              <td className="px-3 py-2.5">
                <StatusBadge status={task.status} size="sm" />
              </td>
              <td className="px-3 py-2.5">
                <PriorityBadge priority={task.priority} size="sm" />
              </td>
              <td className="px-3 py-2.5 text-gray-600">
                {task.assignee?.name ?? "—"}
              </td>
              <td className="px-3 py-2.5 text-gray-600">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </td>
              <td className="px-3 py-2.5 text-gray-600">
                {task.npaoPhase ? phaseLabels[task.npaoPhase] : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
