/**
 * UserOps provisioning steps.
 *
 * Each step is idempotent: re-running against an already-provisioned
 * workspace converges rather than duplicating. Steps run in order and a
 * failure halts the run, leaving state resumable.
 */

import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { agentProjectScope, workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import {
  hubEnsureWorkspace,
  hubExists,
  hubReadJson,
  hubWriteJson,
  hubWriteText,
} from "@/lib/hub/store";
import {
  ensureAwsInstance,
  getAwsInstanceProfile,
  getAwsInstanceProject,
} from "@/lib/aws/instance-registry";
import { hubBackendLabel } from "@/lib/hub/store";
import { agentCoreStatus } from "@/lib/agentcore";
import type { ToolScript } from "@/lib/rostr/pipeline/types";
import type { ProvisionContext, ProvisionStepId } from "./types";
import { WORKSPACE_TREE } from "./workspace-tree";

export { WORKSPACE_TREE, WORKSPACE_FOLDER_COUNT } from "./workspace-tree";


export type StepResult = {
  detail: string;
  output: Record<string, unknown>;
  skipped?: boolean;
};

export type StepDefinition = {
  id: ProvisionStepId;
  label: string;
  run: (ctx: ProvisionContext) => Promise<StepResult>;
};

function scopeOf(ctx: ProvisionContext): WorkspaceScope {
  return agentProjectScope(ctx.userId, ctx.projectId);
}

/**
 * Step 1 — Database.
 * Control-plane records for the user, project, and agent. DynamoDB when
 * configured, hub-mirrored JSON otherwise (see instance-registry).
 */
const databaseStep: StepDefinition = {
  id: "database",
  label: "Provision control-plane records",
  async run(ctx) {
    const existing = await getAwsInstanceProject(ctx.userId, ctx.projectId);
    // ensureAwsInstance writes `email` unconditionally, so preserve whatever
    // the profile already holds rather than clobbering it with a placeholder.
    const existingProfile = await getAwsInstanceProfile(ctx.userId);
    const email = existingProfile?.email || ctx.email || `${ctx.userId}@users.noreply.artispreneur.com`;

    const { project, agent } = await ensureAwsInstance({
      userId: ctx.userId,
      email,
      projectId: ctx.projectId,
      workspacePath: ctx.workspacePath,
    });

    return {
      detail: existing
        ? `Refreshed control-plane records (plan: ${project.plan}).`
        : `Created USER#/PROJECT#/AGENT# records (plan: ${project.plan}).`,
      output: {
        plan: project.plan,
        s3_prefix: project.s3_prefix,
        hub_backend: project.hub_backend,
        agent_runtime: agent.runtime,
        model_id: agent.model_id,
        pre_existing: Boolean(existing),
      },
    };
  },
};

/**
 * Step 2 — Storage.
 * The S3 (or local) structure that defines where the artist's files live.
 */
const storageStep: StepDefinition = {
  id: "storage",
  label: "Build workspace storage structure",
  async run(ctx) {
    const scope = scopeOf(ctx);
    await hubEnsureWorkspace(scope);

    const created: string[] = [];
    for (const folder of WORKSPACE_TREE) {
      const marker = `${folder.path}/.keep`;
      if (await hubExists(scope, marker)) continue;
      await hubWriteJson(scope, marker, {
        path: folder.path,
        purpose: folder.purpose,
        created_at: new Date().toISOString(),
      });
      created.push(folder.path);
    }

    return {
      detail: created.length
        ? `Created ${created.length} of ${WORKSPACE_TREE.length} workspace folders.`
        : `Workspace structure already present (${WORKSPACE_TREE.length} folders).`,
      output: {
        backend: hubBackendLabel(),
        prefix: workspaceLogicalPath(scope),
        folders_total: WORKSPACE_TREE.length,
        folders_created: created,
      },
    };
  },
};

/**
 * Step 3 — Compute.
 * Records what powers the agent and how data moves between agent and
 * workspace. Shared multi-tenant runtime by default; AgentCore Runtime when
 * configured. Dedicated per-artist compute stays a deliberate enterprise
 * upgrade, not a default (docs/ORG_MODES.md).
 */
const computeStep: StepDefinition = {
  id: "compute",
  label: "Bind agent compute",
  async run(ctx) {
    const core = agentCoreStatus();
    const scope = scopeOf(ctx);

    const binding = {
      mode: core.runtime.configured ? "agentcore_runtime" : "pooled_worker",
      files_live_at: workspaceLogicalPath(scope),
      hub_backend: hubBackendLabel(),
      powered_by: core.runtime.configured
        ? `AgentCore Runtime ${core.runtime.qualifier}`
        : "Bedrock inline invocation (pooled)",
      memory: core.memory.configured ? "agentcore_memory" : "hub_jsonl",
      identity: core.identity.configured ? "agentcore_workload_identity" : "platform_iam",
      gateway: core.gateway.configured ? core.gateway.url : null,
      transfer: "Agent writes deliverables to 04-deliverables/; approvals promote to sent-or-published/",
      region: core.region,
      bound_at: new Date().toISOString(),
    };

    await hubWriteJson(scope, "00-config/compute-binding.json", binding);

    return {
      detail: `Agent compute bound: ${binding.mode} (memory: ${binding.memory}).`,
      output: binding,
    };
  },
};

/**
 * Step 4 — Agent install.
 * Soul.md, tool scripts (MCPs / functions / skills / sub-agents), and the
 * knowledge base index covering user knowledge plus PAL/RAG-DAL outputs.
 */
const agentInstallStep: StepDefinition = {
  id: "agent_install",
  label: "Install agent (soul, tool scripts, knowledge base)",
  async run(ctx) {
    const scope = scopeOf(ctx);
    const soulPresent = await hubExists(scope, "00-config/master-soul.md");

    // Tool scripts come from the compile's build package when one exists.
    let toolScripts: ToolScript[] = [];
    if (ctx.compileId) {
      const fromCompile = await hubReadJson<ToolScript[]>(
        scope,
        `03-agent-workflows/compiles/${ctx.compileId}/tool-scripts.json`,
      ).catch(() => null);
      if (fromCompile) toolScripts = fromCompile;
    }

    const byKind = {
      mcp: toolScripts.filter((t) => t.kind === "mcp").map((t) => t.name),
      function: toolScripts.filter((t) => t.kind === "function").map((t) => t.name),
      skill: toolScripts.filter((t) => t.kind === "skill").map((t) => t.name),
      sub_agent: toolScripts.filter((t) => t.kind === "sub_agent").map((t) => t.name),
    };

    await hubWriteJson(scope, "00-config/tool-scripts.json", {
      installed_at: new Date().toISOString(),
      compile_id: ctx.compileId,
      counts: {
        mcp: byKind.mcp.length,
        function: byKind.function.length,
        skill: byKind.skill.length,
        sub_agent: byKind.sub_agent.length,
      },
      scripts: toolScripts,
    });

    // Knowledge base index: user knowledge + PAL/RAG-DAL outputs.
    const knowledgeIndex = {
      built_at: new Date().toISOString(),
      compile_id: ctx.compileId,
      user_knowledge: WORKSPACE_TREE.filter((f) => f.path.startsWith("01-knowledge-base")).map(
        (f) => ({ path: f.path, purpose: f.purpose }),
      ),
      pal_rag_dal_outputs: ctx.compileId
        ? [
            { kind: "documentation", path: `03-agent-workflows/compiles/${ctx.compileId}/master-build-instructions.md` },
            { kind: "prd", path: `03-agent-workflows/compiles/${ctx.compileId}/prd.md` },
            { kind: "build_prompts", path: `03-agent-workflows/compiles/${ctx.compileId}/build-prompts.json` },
            { kind: "system_instructions", path: `03-agent-workflows/compiles/${ctx.compileId}/system-instructions.md` },
          ]
        : [],
      retrieval_policy: {
        scope: "workspace_only",
        cross_tenant: "denied",
        note: "Every retrieval is filtered by workspace_id server-side.",
      },
    };
    await hubWriteJson(scope, "01-knowledge-base/index.json", knowledgeIndex);

    if (!soulPresent) {
      await hubWriteText(
        scope,
        "00-config/master-soul.md",
        [
          "# Master Soul.md — pending PAL intake",
          "",
          "This workspace was provisioned before onboarding completed.",
          "Run PAL intake (`POST /api/pal/intake`) to compile the artist's",
          "identity, brand voice, goals, and approval policy into this file.",
          "",
          "Until then the agent operates with approval-required defaults and",
          "will ask for context rather than assuming it.",
        ].join("\n"),
      );
    }

    return {
      detail: `Installed ${toolScripts.length} tool scripts; knowledge base indexed${soulPresent ? "" : "; Soul placeholder written"}.`,
      output: {
        soul_present: soulPresent,
        tool_scripts: byKind,
        knowledge_sources:
          knowledgeIndex.user_knowledge.length + knowledgeIndex.pal_rag_dal_outputs.length,
        compile_id: ctx.compileId,
      },
    };
  },
};

/** Ordered provisioning steps. */
export const PROVISION_STEPS: StepDefinition[] = [
  databaseStep,
  storageStep,
  computeStep,
  agentInstallStep,
];
