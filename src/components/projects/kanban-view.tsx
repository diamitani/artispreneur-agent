"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./task-card";
import { NewTaskForm } from "./new-task-form";

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "backlog", label: "Backlog", color: "#94a3b8" },
  { status: "todo", label: "Todo", color: "#3b82f6" },
  { status: "in_progress", label: "In Progress", color: "#f59e0b" },
  { status: "in_review", label: "In Review", color: "#8b5cf6" },
  { status: "done", label: "Done", color: "#22c55e" },
];

export function KanbanView({
  tasks,
  onTaskClick,
  onStatusChange,
  onAddTask,
}: KanbanViewProps) {
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, status: TaskStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  }

  function handleDragLeave() {
    setDragOverColumn(null);
  }

  function handleDrop(e: React.DragEvent, status: TaskStatus) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onStatusChange(taskId, status);
    }
    setDragOverColumn(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className={cn(
              "flex min-w-[280px] flex-shrink-0 snap-start flex-col rounded-lg bg-gray-50 p-3 transition-colors",
              dragOverColumn === col.status && "bg-gray-100 ring-2 ring-gray-300"
            )}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <h3 className="text-sm font-semibold text-gray-700">
                  {col.label}
                </h3>
                <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-500">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => {
                  setAddingTo(col.status);
                  onAddTask(col.status);
                }}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-2 flex-1">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <TaskCard
                    task={task}
                    variant="kanban"
                    onClick={() => onTaskClick(task)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
