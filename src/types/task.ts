export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "none" | "low" | "medium" | "high" | "urgent";
export type NpaoPhase = "navigate" | "align" | "plan" | "operate";

export interface TaskAssignee {
  type: "human" | "agent";
  id: string;
  name: string;
}

export interface Task {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: TaskAssignee;
  dueDate?: string;
  tags: string[];
  npaoPhase?: NpaoPhase;
  subtaskCount: number;
  subtasksDone: number;
  commentCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  done: boolean;
  sortOrder: number;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorType: "human" | "agent";
  body: string;
  createdAt: string;
}
