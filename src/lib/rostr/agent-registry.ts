/**
 * Custom agent registry — personal agents an artist builds by working.
 *
 * The point of the workspace is not to be an agent builder. It is to turn a
 * plain-language request into a real project and get it done. Building an
 * agent is a *byproduct* of that: when a compile produces work the artist
 * will need repeatedly, ROSTR proposes a durable agent for it, the artist
 * activates it, and from then on Hermes can route to it by name.
 *
 * Agents live in the artist's own workspace (`00-config/agents/`), so a
 * custom agent is private to that workspace like every other artifact.
 */

import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { hubReadJson, hubWriteJson } from "@/lib/hub/store";
import type { RostrCompilation, WorkspaceContext } from "@/lib/rostr/pipeline/types";

const REGISTRY_PATH = "00-config/agents/registry.json";

export type CustomAgentStatus = "proposed" | "active" | "disabled";

export type CustomAgent = {
  id: string;
  name: string;
  purpose: string;
  runtime: "hermes";
  /** System instructions the agent loads before every task. */
  system_instructions: string;
  tools: string[];
  skills: string[];
  /** Actions this agent may never take without named human approval. */
  approval_gated_actions: string[];
  status: CustomAgentStatus;
  created_from_compile: string | null;
  created_at: string;
  updated_at: string;
};

export type AgentRegistry = {
  version: 1;
  agents: CustomAgent[];
  updated_at: string;
};

/** Actions that are approval-gated for every agent, without exception. */
const ALWAYS_GATED = ["send", "publish", "spend", "sign", "file", "delete"];

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48) || "agent"
  );
}

export async function readRegistry(scope: WorkspaceScope): Promise<AgentRegistry> {
  const stored = await hubReadJson<AgentRegistry>(scope, REGISTRY_PATH).catch(() => null);
  return stored ?? { version: 1, agents: [], updated_at: new Date().toISOString() };
}

export async function listAgents(
  scope: WorkspaceScope,
  status?: CustomAgentStatus,
): Promise<CustomAgent[]> {
  const registry = await readRegistry(scope);
  return status ? registry.agents.filter((a) => a.status === status) : registry.agents;
}

export async function getAgent(
  scope: WorkspaceScope,
  agentId: string,
): Promise<CustomAgent | null> {
  const registry = await readRegistry(scope);
  return registry.agents.find((a) => a.id === agentId) ?? null;
}

/**
 * Derive a custom agent from a completed compile.
 *
 * Returns a *proposal*: the artist activates it explicitly. Nothing gets a
 * standing capability in the workspace without a human saying yes.
 */
export function proposeAgentFromCompile(
  compilation: RostrCompilation,
  ctx: WorkspaceContext,
): CustomAgent {
  const useCase = compilation.pal.intent.use_case;
  const name = `${ctx.artist_name} · ${useCase.replace(/_/g, " ")} agent`;
  const now = new Date().toISOString();

  const skills = compilation.build_package.tool_scripts
    .filter((t) => t.kind === "skill")
    .map((t) => t.name);
  const tools = compilation.build_package.tool_scripts
    .filter((t) => t.kind === "function" || t.kind === "mcp")
    .map((t) => t.name);

  // Anything the compile marked approval-gated stays gated on the agent.
  const gatedFromPlan = compilation.npao.steps
    .filter((s) => s.requires_approval)
    .map((s) => s.title);

  const system_instructions = [
    `# ${name}`,
    "",
    `You are a specialist agent in ${ctx.artist_name}'s Artispreneur workspace.`,
    "",
    "## Purpose",
    `Handle recurring ${useCase.replace(/_/g, " ")} work for ${ctx.artist_name}.`,
    `Originally compiled from: "${compilation.pal.intent.goal}"`,
    "",
    "## Context you load first",
    "1. 00-config/master-soul.md — identity, voice, boundaries",
    "2. 00-config/permissions.yaml — approval policy",
    "3. The active project brief and task board",
    "",
    "## Tools",
    tools.length ? tools.map((t) => `- ${t}`).join("\n") : "- none bound",
    "",
    "## Skills",
    skills.length ? skills.map((s) => `- ${s}`).join("\n") : "- none installed",
    "",
    "## Rules",
    `- Approval policy: ${ctx.approval_policy}.`,
    "- Research, plan, draft, and organize autonomously.",
    `- Never ${ALWAYS_GATED.join(", ")} without explicit approval from ${ctx.artist_name}.`,
    gatedFromPlan.length
      ? `- These specific actions are approval-gated: ${gatedFromPlan.join("; ")}.`
      : "",
    "- Never invent ownership, splits, clearances, or outcomes.",
    "- Return: summary, deliverables, sources used, assumptions, next actions.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    id: slugify(`${useCase}-${ctx.artist_name}`),
    name,
    purpose: `Recurring ${useCase.replace(/_/g, " ")} work, compiled from: ${compilation.pal.intent.goal}`,
    runtime: "hermes",
    system_instructions,
    tools,
    skills,
    approval_gated_actions: ALWAYS_GATED,
    status: "proposed",
    created_from_compile: compilation.compile_id,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Upsert an agent into the registry. Re-registering an existing id updates it
 * in place and preserves its original created_at.
 */
export async function registerAgent(
  scope: WorkspaceScope,
  agent: CustomAgent,
): Promise<CustomAgent> {
  const registry = await readRegistry(scope);
  const now = new Date().toISOString();
  const existing = registry.agents.find((a) => a.id === agent.id);

  const next: CustomAgent = {
    ...agent,
    created_at: existing?.created_at ?? agent.created_at,
    updated_at: now,
  };

  registry.agents = [...registry.agents.filter((a) => a.id !== agent.id), next];
  registry.updated_at = now;
  await hubWriteJson(scope, REGISTRY_PATH, registry);
  return next;
}

/** Activate, disable, or re-propose a registered agent. */
export async function setAgentStatus(
  scope: WorkspaceScope,
  agentId: string,
  status: CustomAgentStatus,
): Promise<CustomAgent | null> {
  const registry = await readRegistry(scope);
  const agent = registry.agents.find((a) => a.id === agentId);
  if (!agent) return null;

  agent.status = status;
  agent.updated_at = new Date().toISOString();
  registry.updated_at = agent.updated_at;
  await hubWriteJson(scope, REGISTRY_PATH, registry);
  return agent;
}
