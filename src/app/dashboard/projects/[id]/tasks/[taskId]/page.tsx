"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus, TaskPriority, Subtask, Comment } from "@/types/task";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const PHASE_LABELS: Record<string, string> = {
  navigate: "Navigate",
  align: "Align",
  plan: "Plan",
  operate: "Operate",
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const taskId = params.taskId as string;

  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable state
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  // Fetch task data
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [taskRes, subtasksRes, commentsRes] = await Promise.all([
          fetch(`/api/tasks/${taskId}`),
          fetch(`/api/tasks/${taskId}/subtasks`),
          fetch(`/api/tasks/${taskId}/comments`),
        ]);

        if (taskRes.ok) {
          const taskData = await taskRes.json();
          setTask(taskData);
          setTitleDraft(taskData.title);
          setDescriptionDraft(taskData.description ?? "");
        }
        if (subtasksRes.ok) {
          const data = await subtasksRes.json();
          setSubtasks(data.subtasks ?? data);
        }
        if (commentsRes.ok) {
          const data = await commentsRes.json();
          setComments(data.comments ?? data);
        }
      } catch {
        // show empty state
      } finally {
        setLoading(false);
      }
    }
    if (taskId) fetchAll();
  }, [taskId]);

  // Patch task field
  const patchTask = useCallback(
    async (data: Partial<Task>) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setTask((prev) => (prev ? { ...prev, ...updated } : prev));
      }
    },
    [taskId]
  );

  // Title save
  const handleTitleSave = useCallback(() => {
    setEditingTitle(false);
    if (titleDraft.trim() && titleDraft.trim() !== task?.title) {
      patchTask({ title: titleDraft.trim() });
    }
  }, [titleDraft, task?.title, patchTask]);

  // Description save
  const handleDescriptionSave = useCallback(() => {
    setEditingDescription(false);
    if (descriptionDraft !== (task?.description ?? "")) {
      patchTask({ description: descriptionDraft || undefined });
    }
  }, [descriptionDraft, task?.description, patchTask]);

  // Toggle subtask
  const toggleSubtask = useCallback(
    async (subtask: Subtask) => {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subtask.id, done: !subtask.done }),
      });
      if (res.ok) {
        setSubtasks((prev) =>
          prev.map((s) => (s.id === subtask.id ? { ...s, done: !s.done } : s))
        );
      }
    },
    [taskId]
  );

  // Add subtask
  const addSubtask = useCallback(async () => {
    if (!newSubtask.trim()) return;
    const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newSubtask.trim() }),
    });
    if (res.ok) {
      const created = await res.json();
      setSubtasks((prev) => [...prev, created]);
      setNewSubtask("");
    }
  }, [taskId, newSubtask]);

  // Add comment
  const addComment = useCallback(async () => {
    if (!newComment.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newComment.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments((prev) => [...prev, created]);
        setNewComment("");
      }
    } finally {
      setPostingComment(false);
    }
  }, [taskId, newComment]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-96 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-48 animate-pulse rounded-lg bg-gray-100" />
          </div>
          <div className="space-y-4">
            <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Task not found</p>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="mt-3 inline-block text-sm text-[#CC0000] hover:underline"
          >
            Back to project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back link */}
      <Link
        href={`/dashboard/projects/${projectId}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title */}
          <div>
            {editingTitle ? (
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setTitleDraft(task.title);
                    setEditingTitle(false);
                  }
                }}
                autoFocus
                className="w-full border-0 bg-transparent text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CC0000] rounded px-1"
              />
            ) : (
              <h1
                onClick={() => setEditingTitle(true)}
                className="cursor-pointer text-2xl font-bold text-gray-900 hover:bg-gray-50 rounded px-1 py-0.5 -mx-1"
              >
                {task.title}
              </h1>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
              Description
            </h2>
            {editingDescription ? (
              <textarea
                value={descriptionDraft}
                onChange={(e) => setDescriptionDraft(e.target.value)}
                onBlur={handleDescriptionSave}
                autoFocus
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]"
                placeholder="Add a description..."
              />
            ) : (
              <p
                onClick={() => setEditingDescription(true)}
                className="min-h-[60px] cursor-pointer whitespace-pre-wrap rounded-lg border border-transparent px-3 py-2 text-sm text-gray-700 hover:border-gray-200 hover:bg-gray-50"
              >
                {task.description || "Click to add a description..."}
              </p>
            )}
          </div>

          {/* Subtasks */}
          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              Subtasks ({subtasks.filter((s) => s.done).length}/{subtasks.length})
            </h2>
            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  <button
                    onClick={() => toggleSubtask(subtask)}
                    className={cn(
                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors",
                      subtask.done
                        ? "border-[#CC0000] bg-[#CC0000] text-white"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {subtask.done && <Check className="h-3 w-3" />}
                  </button>
                  <span
                    className={cn(
                      "text-sm",
                      subtask.done ? "text-gray-400 line-through" : "text-gray-900"
                    )}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}

              {/* Add subtask input */}
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-200 px-3 py-2">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-gray-200">
                  <Plus className="h-3 w-3 text-gray-300" />
                </div>
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addSubtask();
                  }}
                  placeholder="Add a subtask..."
                  className="flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              Comments ({comments.length})
            </h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium text-white",
                      comment.authorType === "agent" ? "bg-[#CC0000]" : "bg-gray-600"
                    )}
                  >
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.authorName}
                      </span>
                      {comment.authorType === "agent" && (
                        <span className="rounded bg-[#CC0000]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#CC0000]">
                          AI
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}

              {/* Add comment */}
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                  Y
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim() || postingComment}
                      className="rounded-lg bg-[#CC0000] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#AA0000] disabled:opacity-50"
                    >
                      {postingComment ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-5 rounded-xl border border-gray-200 bg-white p-5">
            {/* Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium uppercase tracking-wide text-gray-500">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => {
                  const newStatus = e.target.value as TaskStatus;
                  setTask((prev) => (prev ? { ...prev, status: newStatus } : prev));
                  patchTask({ status: newStatus });
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-sm font-medium uppercase tracking-wide text-gray-500">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => {
                  const newPriority = e.target.value as TaskPriority;
                  setTask((prev) => (prev ? { ...prev, priority: newPriority } : prev));
                  patchTask({ priority: newPriority });
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="mb-1.5 block text-sm font-medium uppercase tracking-wide text-gray-500">
                Assignee
              </label>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium text-white",
                      task.assignee.type === "agent" ? "bg-[#CC0000]" : "bg-gray-600"
                    )}
                  >
                    {task.assignee.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-900">{task.assignee.name}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Unassigned</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1.5 block text-sm font-medium uppercase tracking-wide text-gray-500">
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate?.split("T")[0] ?? ""}
                onChange={(e) => {
                  const val = e.target.value || undefined;
                  setTask((prev) => (prev ? { ...prev, dueDate: val } : prev));
                  patchTask({ dueDate: val });
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]"
              />
            </div>

            {/* NPAO Phase */}
            {task.npaoPhase && (
              <div>
                <label className="mb-1.5 block text-sm font-medium uppercase tracking-wide text-gray-500">
                  NPAO Phase
                </label>
                <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                  {PHASE_LABELS[task.npaoPhase] ?? task.npaoPhase}
                </span>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div>
                <label className="mb-1.5 block text-sm font-medium uppercase tracking-wide text-gray-500">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="border-t border-gray-100 pt-4">
              <div className="space-y-2 text-xs text-gray-400">
                <p>
                  Created{" "}
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>
                  Updated{" "}
                  {new Date(task.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                {task.completedAt && (
                  <p>
                    Completed{" "}
                    {new Date(task.completedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
