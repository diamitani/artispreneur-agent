"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/use-tasks";
import { KanbanView } from "@/components/projects/kanban-view";
import { ListView } from "@/components/projects/list-view";
import { BoardView } from "@/components/projects/board-view";
import { CalendarView } from "@/components/projects/calendar-view";
import { NewTaskForm } from "@/components/projects/new-task-form";
import type { Project, ProjectView } from "@/types/project";
import type { Task, TaskStatus } from "@/types/task";

const viewOptions: { value: ProjectView; label: string }[] = [
  { value: "kanban", label: "Kanban" },
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTask } = useTasks(projectId);

  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [activeView, setActiveView] = useState<ProjectView>("kanban");
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
          setActiveView(data.defaultView ?? "kanban");
        }
      } catch {
        // handled by tasksError fallback
      } finally {
        setProjectLoading(false);
      }
    }
    if (projectId) fetchProject();
  }, [projectId]);

  const handleTaskClick = useCallback(
    (task: Task) => {
      router.push(`/dashboard/projects/${projectId}/tasks/${task.id}`);
    },
    [router, projectId]
  );

  const handleStatusChange = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      updateTask(taskId, { status: newStatus });
    },
    [updateTask]
  );

  const handleAddTask = useCallback((_status?: TaskStatus) => {
    setShowTaskForm(true);
  }, []);

  const handleTaskFormSubmit = useCallback(
    (data: { title: string; status?: TaskStatus; priority?: import("@/types/task").TaskPriority }) => {
      createTask(data);
      setShowTaskForm(false);
    },
    [createTask]
  );

  const handleDateClick = useCallback((_date: string) => {
    // Could open new task form with pre-filled date
    setShowTaskForm(true);
  }, []);

  if (projectLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-96 animate-pulse rounded bg-gray-100" />
        <div className="h-10 w-80 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {project?.name ?? "Project"}
          </h1>
          {project?.description && (
            <p className="mt-1 text-gray-600">{project.description}</p>
          )}
        </div>

        <button
          onClick={() => setShowTaskForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#AA0000]"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {viewOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveView(option.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeView === option.value
                ? "bg-[#CC0000] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* New Task Form */}
      {showTaskForm && (
        <NewTaskForm
          projectId={projectId}
          onSubmit={handleTaskFormSubmit}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {/* Error */}
      {tasksError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {tasksError}
        </div>
      )}

      {/* Loading */}
      {tasksLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#CC0000]" />
        </div>
      )}

      {/* View */}
      {!tasksLoading && !tasksError && (
        <>
          {activeView === "kanban" && (
            <KanbanView
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onStatusChange={handleStatusChange}
              onAddTask={handleAddTask}
            />
          )}
          {activeView === "list" && (
            <ListView
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onStatusChange={handleStatusChange}
            />
          )}
          {activeView === "board" && (
            <BoardView
              tasks={tasks}
              onTaskClick={handleTaskClick}
            />
          )}
          {activeView === "calendar" && (
            <CalendarView
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onDateClick={handleDateClick}
            />
          )}
        </>
      )}
    </div>
  );
}
