export type ProjectStatus = "active" | "archived" | "completed";
export type ProjectView = "kanban" | "list" | "board" | "calendar";

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: ProjectStatus;
  defaultView: ProjectView;
  taskCount: number;
  createdAt: string;
  updatedAt: string;
}
