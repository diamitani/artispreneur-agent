/** Shared client types for the Agent Workspace. */

export type TaskStatus =
  | "planned"
  | "in_progress"
  | "needs_approval"
  | "approved"
  | "done"
  | "blocked"
  | "rejected";

export type BoardTask = {
  id: string;
  order: number;
  title: string;
  instructions: string;
  npao: "N" | "A" | "P" | "O";
  phase: string;
  owner: string;
  requires_approval: boolean;
  depends_on: string[];
  status: TaskStatus;
  decided_by: string | null;
  decided_at: string | null;
  note: string | null;
};

export type BoardSummary = {
  total: number;
  done: number;
  needs_approval: number;
  in_progress: number;
  blocked: number;
};

export type VaultFile = {
  id: string;
  name: string;
  path: string;
  category: string;
  bytes: number;
  indexed: boolean;
  uploaded_at: string;
};

export type PromptEntry = {
  id: string;
  title: string;
  outcome: string;
  category: string;
  prompt: string;
  fills: string[];
  featured?: boolean;
};

export type Deliverable = {
  path: string;
  kind: string;
  summary: string;
  at: string;
};

export type CustomAgent = {
  id: string;
  name: string;
  purpose: string;
  status: "proposed" | "active" | "disabled";
};

export type ProvisionSummary = {
  status: "pending" | "running" | "complete" | "failed";
  done: number;
  total: number;
  next: string | null;
};

/** Plain language for artists — no pipeline jargon reaches the UI. */
export const STATUS_LABEL: Record<TaskStatus, string> = {
  planned: "Up next",
  in_progress: "Working",
  needs_approval: "Your call",
  approved: "Approved",
  done: "Done",
  blocked: "Waiting",
  rejected: "Sent back",
};

export const STATUS_TONE: Record<TaskStatus, string> = {
  planned: "text-[color:var(--color-text-dim)] border-[color:var(--color-border)]",
  in_progress: "text-[color:var(--color-gold)] border-[color:var(--color-gold)]",
  needs_approval: "text-[color:var(--color-crimson)] border-[color:var(--color-crimson)]",
  approved: "text-[color:var(--color-success)] border-[color:var(--color-success)]",
  done: "text-[color:var(--color-success)] border-[color:var(--color-border)]",
  blocked: "text-[color:var(--color-warning)] border-[color:var(--color-warning)]",
  rejected: "text-[color:var(--color-crimson)] border-[color:var(--color-crimson)]",
};
