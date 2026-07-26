"use client";

import { useState, useEffect, useCallback } from "react";
import type { Task, TaskStatus, TaskPriority } from "@/types/task";

interface CreateTaskData {
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  description?: string;
  dueDate?: string;
  tags?: string[];
}

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/projects/${projectId}/tasks`);
      if (!res.ok) {
        throw new Error(`Failed to fetch tasks: ${res.statusText}`);
      }
      const data = await res.json();
      setTasks(data.tasks ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (data: CreateTaskData): Promise<Task> => {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to create task");
      }
      const task: Task = await res.json();
      await fetchTasks();
      return task;
    },
    [projectId, fetchTasks]
  );

  const updateTask = useCallback(
    async (id: string, data: Partial<Task>): Promise<void> => {
      // Optimistic update for status changes
      if (data.status) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...data } : t))
        );
      }

      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          // Revert optimistic update on failure
          await fetchTasks();
          throw new Error(err.error ?? "Failed to update task");
        }
        // Refresh to get the canonical state
        await fetchTasks();
      } catch (err) {
        // Revert on network error
        await fetchTasks();
        throw err;
      }
    },
    [fetchTasks]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to delete task");
      }
      await fetchTasks();
    },
    [fetchTasks]
  );

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refresh: fetchTasks,
  };
}
