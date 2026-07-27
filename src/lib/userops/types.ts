/**
 * UserOps — provisioning types.
 *
 * Per the AWS Backend Infrastructure spec (step 4), UserOps provisions the
 * artist's account in AWS: database, S3 storage structure, compute, and the
 * agent install (Soul.md, tool scripts, knowledge base).
 */

export type ProvisionStepId =
  | "database"
  | "storage"
  | "compute"
  | "agent_install";

export type StepStatus = "pending" | "running" | "done" | "failed" | "skipped";

export type StepState = {
  id: ProvisionStepId;
  label: string;
  status: StepStatus;
  /** Human-readable outcome, safe to surface in Mission Control. */
  detail: string | null;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
  /** Structured result for downstream steps and debugging. */
  output: Record<string, unknown> | null;
};

export type ProvisionStatus = "pending" | "running" | "complete" | "failed";

export type ProvisionState = {
  version: 1;
  workspace_path: string;
  user_id: string;
  project_id: string;
  status: ProvisionStatus;
  /** Compile whose build package seeded this provision, when any. */
  compile_id: string | null;
  steps: StepState[];
  created_at: string;
  updated_at: string;
};

export type ProvisionContext = {
  userId: string;
  projectId: string;
  workspacePath: string;
  compileId: string | null;
  /**
   * Session email, used only when the control plane has no profile yet.
   * Never overwrites an existing stored email.
   */
  email?: string;
};
