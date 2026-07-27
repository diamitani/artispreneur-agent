/**
 * Task executor — the agent that actually does the work.
 *
 * The task board tracks what needs doing; this runs it. For one task it:
 *   1. loads the artist's Soul, workspace context, and active skills
 *   2. retrieves relevant vault files and prior memory
 *   3. runs the task through the agent model
 *   4. writes the deliverable to `04-deliverables/drafts-awaiting-approval/`
 *   5. moves the task to `needs_approval` (gated) or `done` (safe)
 *
 * The executor never sends, publishes, spends, signs, or files. It produces
 * artifacts. Anything consequential stops at the approval queue — that
 * boundary is enforced here *and* in the task board, so neither alone is a
 * single point of failure.
 */

import { generateText } from "ai";
import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { hubWriteText } from "@/lib/hub/store";
import {
  createBedrockProvider,
  getAgentModelId,
  isBedrockConfigured,
} from "@/lib/agent/bedrock";
import { buildHermesSystemPrompt } from "@/lib/hermes/runtime";
import { searchVault } from "@/lib/vault/ingest";
import { recallMemory, rememberTurns, runtimeSessionId } from "@/lib/agentcore";
import { recordArtifact, recordAudit } from "@/lib/rostr/reference-hub";
import {
  readBoard,
  transitionTask,
  type BoardTask,
} from "@/lib/rostr/task-board";
import { getAgent } from "@/lib/rostr/agent-registry";

const MAX_OUTPUT_TOKENS = 4096;
const DELIVERABLE_DIR = "04-deliverables/drafts-awaiting-approval";

export type ExecutionResult = {
  ok: true;
  task_id: string;
  title: string;
  status: BoardTask["status"];
  deliverable_path: string;
  chars: number;
  requires_approval: boolean;
  sources: string[];
  model_id: string;
};

export type ExecutionFailure = {
  ok: false;
  task_id: string;
  reason: "not_configured" | "not_found" | "not_runnable" | "error";
  detail: string;
};

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "deliverable"
  );
}

/** Tasks in these states are not eligible to run. */
function runnable(task: BoardTask): boolean {
  return task.status === "planned" || task.status === "in_progress";
}

/**
 * Execute a single task.
 *
 * `actor` is the authenticated user on whose behalf work is produced. It is
 * recorded on every transition and audit entry — the executor drafts, but a
 * named human owns the result.
 */
export async function executeTask(input: {
  scope: WorkspaceScope;
  taskId: string;
  actor: string;
  /** Optional custom agent to run as, instead of the Master Agent. */
  agentId?: string;
}): Promise<ExecutionResult | ExecutionFailure> {
  const { scope, taskId, actor } = input;

  if (!isBedrockConfigured()) {
    return {
      ok: false,
      task_id: taskId,
      reason: "not_configured",
      detail:
        "Bedrock is not configured. Set AWS_BEARER_TOKEN_BEDROCK (or AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY).",
    };
  }

  const board = await readBoard(scope);
  const task = board?.tasks.find((t) => t.id === taskId);
  if (!board || !task) {
    return { ok: false, task_id: taskId, reason: "not_found", detail: `Unknown task: ${taskId}` };
  }
  if (!runnable(task)) {
    return {
      ok: false,
      task_id: taskId,
      reason: "not_runnable",
      detail: `Task is ${task.status}; only planned or in_progress tasks can be executed.`,
    };
  }

  // Dependencies are enforced by the board — this surfaces the failure cleanly.
  if (task.status === "planned") {
    try {
      await transitionTask({ scope, taskId, next: "in_progress", actor });
    } catch (e) {
      return {
        ok: false,
        task_id: taskId,
        reason: "not_runnable",
        detail: (e as Error)?.message ?? "Task could not be started.",
      };
    }
  }

  // Context: Soul + roster + installed skills, then vault files and memory.
  const { system } = await buildHermesSystemPrompt(scope.userId, scope.projectId);
  const query = `${task.title} ${task.instructions}`;
  const [vaultHits, memories] = await Promise.all([
    searchVault(scope, query, 4).catch(() => []),
    recallMemory({ scope, query: task.title, limit: 4 }).catch(() => []),
  ]);

  // Running as a registered custom agent narrows the instructions.
  const customAgent = input.agentId ? await getAgent(scope, input.agentId) : null;

  const contextParts: string[] = [system];

  if (customAgent) {
    contextParts.push("", "## Acting as custom agent", customAgent.system_instructions);
  }

  if (vaultHits.length) {
    contextParts.push(
      "",
      "## Knowledge Vault sources (cite these)",
      ...vaultHits.map((f) => `### ${f.name} (\`${f.path}\`)\n${f.excerpt ?? ""}`),
    );
  }

  if (memories.length) {
    contextParts.push(
      "",
      "## Prior context from this workspace",
      ...memories.map((m) => `- ${m.text.slice(0, 300)}`),
    );
  }

  contextParts.push(
    "",
    "## Execution rules",
    "You are executing one task from an approved build plan. Produce the actual artifact — not a description of it.",
    "Output well-structured Markdown that the artist can use as-is.",
    "Cite the vault sources you used. State assumptions explicitly instead of inventing facts.",
    task.requires_approval
      ? "This task is APPROVAL-GATED. Produce the complete draft and clearly state what action the artist would be approving. Do not describe the action as taken."
      : "This task is not approval-gated, but you still only produce artifacts — never claim an external action occurred.",
  );

  const prompt = [
    `# Task: ${task.title}`,
    "",
    `**Owner:** ${task.owner} · **NPAO:** ${task.npao} · **Phase:** ${task.phase}`,
    "",
    "## Instructions",
    task.instructions,
    "",
    task.note ? `## Artist note\n${task.note}\n` : "",
    "Produce the deliverable now.",
  ]
    .filter(Boolean)
    .join("\n");

  let text: string;
  const modelId = getAgentModelId();
  try {
    const bedrock = createBedrockProvider();
    const result = await generateText({
      model: bedrock(modelId),
      system: contextParts.join("\n"),
      prompt,
      temperature: 0.5,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });
    text = result.text?.trim() ?? "";
  } catch (e) {
    console.error("[executor:generate]", e);
    return {
      ok: false,
      task_id: taskId,
      reason: "error",
      detail: (e as Error)?.message ?? "Model invocation failed.",
    };
  }

  if (!text) {
    return { ok: false, task_id: taskId, reason: "error", detail: "Model returned no content." };
  }

  // Persist the deliverable as a draft.
  const sources = vaultHits.map((f) => f.path);
  const deliverablePath = `${DELIVERABLE_DIR}/${task.id}-${slugify(task.title)}.md`;
  const document = [
    `# ${task.title}`,
    "",
    `> Drafted by ${customAgent?.name ?? task.owner} · task \`${task.id}\` · ${new Date().toISOString()}`,
    task.requires_approval
      ? "> **Approval required** — this is a draft. Nothing has been sent, published, or filed."
      : "> Draft artifact.",
    "",
    "---",
    "",
    text,
    "",
    "---",
    "",
    sources.length ? `**Sources used:** ${sources.map((s) => `\`${s}\``).join(", ")}` : "**Sources used:** none — workspace vault was empty.",
  ].join("\n");

  await hubWriteText(scope, deliverablePath, document);

  // Gated work stops for approval; safe work completes.
  const next = task.requires_approval ? "needs_approval" : "done";
  await transitionTask({
    scope,
    taskId,
    next,
    actor,
    note: `Draft written to ${deliverablePath}`,
  });

  await recordArtifact(scope, {
    task_id: task.id,
    path: deliverablePath,
    kind: "deliverable",
    summary: task.title,
  }).catch((e) => console.error("[executor:artifact]", e));

  await recordAudit(scope, {
    event: "executor.produced",
    actor,
    task_id: task.id,
    workspace_path: board.workspace_path,
    detail: {
      path: deliverablePath,
      chars: text.length,
      model_id: modelId,
      agent: customAgent?.id ?? "master",
      requires_approval: task.requires_approval,
    },
  }).catch((e) => console.error("[executor:audit]", e));

  await rememberTurns({
    scope,
    sessionId: runtimeSessionId(scope),
    turns: [
      { role: "artist", text: `Task: ${task.title}` },
      { role: "agent", text: text.slice(0, 2000) },
    ],
  }).catch((e) => console.error("[executor:memory]", e));

  return {
    ok: true,
    task_id: task.id,
    title: task.title,
    status: next,
    deliverable_path: deliverablePath,
    chars: text.length,
    requires_approval: task.requires_approval,
    sources,
    model_id: modelId,
  };
}

/**
 * Run the next runnable task, or up to `limit` of them in dependency order.
 * Stops at the first failure so a broken step doesn't cascade.
 */
export async function executeNext(input: {
  scope: WorkspaceScope;
  actor: string;
  limit?: number;
  agentId?: string;
}): Promise<(ExecutionResult | ExecutionFailure)[]> {
  const limit = input.limit ?? 1;
  const results: (ExecutionResult | ExecutionFailure)[] = [];

  for (let i = 0; i < limit; i++) {
    const board = await readBoard(input.scope);
    if (!board) break;

    const next = board.tasks
      .filter(runnable)
      .sort((a, b) => a.order - b.order)
      .find((task) =>
        task.depends_on.every(
          (dep) => board.tasks.find((t) => t.id === dep)?.status === "done",
        ),
      );
    if (!next) break;

    const result = await executeTask({
      scope: input.scope,
      taskId: next.id,
      actor: input.actor,
      agentId: input.agentId,
    });
    results.push(result);
    if (!result.ok) break;
  }

  return results;
}
