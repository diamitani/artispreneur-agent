/**
 * UserOps provisioner — idempotent, resumable workspace provisioning.
 *
 * State lives in the workspace itself (`00-config/provision-state.json`), so a
 * run that fails midway can be resumed without redoing completed steps, and
 * Mission Control can show exactly where a workspace stands.
 */

import { agentProjectScope, workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import { hubReadJson, hubWriteJson } from "@/lib/hub/store";
import { PROVISION_STEPS } from "./steps";
import type {
  ProvisionContext,
  ProvisionState,
  ProvisionStepId,
  StepState,
} from "./types";

const STATE_PATH = "00-config/provision-state.json";

function emptyState(input: {
  userId: string;
  projectId: string;
  workspacePath: string;
  compileId: string | null;
}): ProvisionState {
  const now = new Date().toISOString();
  return {
    version: 1,
    workspace_path: input.workspacePath,
    user_id: input.userId,
    project_id: input.projectId,
    status: "pending",
    compile_id: input.compileId,
    steps: PROVISION_STEPS.map((s) => ({
      id: s.id,
      label: s.label,
      status: "pending" as const,
      detail: null,
      error: null,
      started_at: null,
      completed_at: null,
      output: null,
    })),
    created_at: now,
    updated_at: now,
  };
}

/**
 * Merge stored state onto the current step definitions. Steps added since the
 * stored run appear as pending rather than being silently dropped.
 */
function reconcile(stored: ProvisionState | null, fresh: ProvisionState): ProvisionState {
  if (!stored) return fresh;
  const byId = new Map<ProvisionStepId, StepState>(stored.steps.map((s) => [s.id, s]));
  return {
    ...fresh,
    status: stored.status,
    compile_id: fresh.compile_id ?? stored.compile_id,
    created_at: stored.created_at,
    steps: fresh.steps.map((step) => {
      const prior = byId.get(step.id);
      // A previously failed step is retried on the next run.
      if (!prior || prior.status === "failed") return step;
      return { ...step, ...prior, label: step.label };
    }),
  };
}

export async function readProvisionState(
  userId: string,
  projectId: string,
): Promise<ProvisionState | null> {
  const scope = agentProjectScope(userId, projectId);
  return hubReadJson<ProvisionState>(scope, STATE_PATH).catch(() => null);
}

/**
 * Run provisioning. Completed steps are skipped unless `force` is set.
 * A step failure halts the run and marks the workspace `failed`; the next
 * call resumes from that step.
 */
export async function provisionWorkspace(input: {
  userId: string;
  projectId: string;
  compileId?: string | null;
  email?: string;
  force?: boolean;
}): Promise<ProvisionState> {
  const { userId, projectId } = input;
  const scope = agentProjectScope(userId, projectId);
  const workspacePath = workspaceLogicalPath(scope);
  const compileId = input.compileId ?? null;

  const stored = await readProvisionState(userId, projectId);
  const state = reconcile(
    input.force ? null : stored,
    emptyState({ userId, projectId, workspacePath, compileId }),
  );

  const ctx: ProvisionContext = {
    userId,
    projectId,
    workspacePath,
    compileId: compileId ?? state.compile_id,
    email: input.email,
  };

  state.status = "running";
  state.updated_at = new Date().toISOString();
  await hubWriteJson(scope, STATE_PATH, state).catch(() => undefined);

  for (const definition of PROVISION_STEPS) {
    const step = state.steps.find((s) => s.id === definition.id);
    if (!step) continue;
    if (step.status === "done" && !input.force) {
      continue;
    }

    step.status = "running";
    step.started_at = new Date().toISOString();
    step.error = null;
    state.updated_at = step.started_at;
    await hubWriteJson(scope, STATE_PATH, state).catch(() => undefined);

    try {
      const result = await definition.run(ctx);
      step.status = result.skipped ? "skipped" : "done";
      step.detail = result.detail;
      step.output = result.output;
      step.completed_at = new Date().toISOString();
    } catch (e) {
      step.status = "failed";
      step.error = (e as Error)?.message ?? String(e);
      step.completed_at = new Date().toISOString();
      state.status = "failed";
      state.updated_at = step.completed_at;
      await hubWriteJson(scope, STATE_PATH, state).catch(() => undefined);
      console.error(`[userops:${definition.id}]`, e);
      return state;
    }

    state.updated_at = step.completed_at;
    await hubWriteJson(scope, STATE_PATH, state).catch(() => undefined);
  }

  state.status = state.steps.every((s) => s.status === "done" || s.status === "skipped")
    ? "complete"
    : "failed";
  state.updated_at = new Date().toISOString();
  await hubWriteJson(scope, STATE_PATH, state).catch(() => undefined);

  return state;
}

/** Compact summary for Mission Control. */
export function provisionSummary(state: ProvisionState | null) {
  if (!state) {
    return { status: "pending" as const, done: 0, total: PROVISION_STEPS.length, next: PROVISION_STEPS[0].label };
  }
  const done = state.steps.filter((s) => s.status === "done" || s.status === "skipped").length;
  const next = state.steps.find((s) => s.status !== "done" && s.status !== "skipped");
  return {
    status: state.status,
    done,
    total: state.steps.length,
    next: next?.label ?? null,
  };
}
