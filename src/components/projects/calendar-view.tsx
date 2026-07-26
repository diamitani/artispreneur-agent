"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "@/types/task";

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDateClick: (date: string) => void;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusColors: Record<string, string> = {
  backlog: "#94a3b8",
  todo: "#3b82f6",
  in_progress: "#f59e0b",
  in_review: "#8b5cf6",
  done: "#22c55e",
} as const;

function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0] as string;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Pad start with days from previous month
  const startDow = firstDay.getDay();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(d);
  }

  // Days of this month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Pad end to complete last week
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }

  return days;
}

export function CalendarView({ tasks, onTaskClick, onDateClick }: CalendarViewProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (task.dueDate) {
        const key = task.dueDate.split("T")[0] ?? task.dueDate;
        if (!map[key]) map[key] = [];
        map[key]!.push(task);
      }
    }
    return map;
  }, [tasks]);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  const todayKey = toDateKey(today);
  const monthName = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <button
          onClick={prevMonth}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-sm font-semibold text-gray-900">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dateKey = toDateKey(day);
          const isCurrentMonth = day.getMonth() === month;
          const isToday = dateKey === todayKey;
          const dayTasks = tasksByDate[dateKey] ?? [];
          const visibleTasks = dayTasks.slice(0, 3);
          const extraCount = dayTasks.length - 3;

          return (
            <div
              key={idx}
              onClick={() => onDateClick(dateKey)}
              className={cn(
                "min-h-[80px] cursor-pointer border-b border-r border-gray-100 p-1.5 transition-colors hover:bg-gray-50",
                !isCurrentMonth && "bg-gray-50/50"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday && "ring-2 ring-[#CC0000] text-[#CC0000] font-bold",
                  isCurrentMonth ? "text-gray-900" : "text-gray-400"
                )}
              >
                {day.getDate()}
              </span>

              {/* Task dots */}
              <div className="mt-1 flex flex-col gap-0.5">
                {visibleTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                    className="flex items-center gap-1 rounded px-1 py-0.5 text-left hover:bg-gray-100"
                  >
                    <span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: statusColors[task.status] }}
                    />
                    <span className="truncate text-[10px] text-gray-600">
                      {task.title}
                    </span>
                  </button>
                ))}
                {extraCount > 0 && (
                  <span className="px-1 text-[10px] text-gray-400">
                    +{extraCount} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
