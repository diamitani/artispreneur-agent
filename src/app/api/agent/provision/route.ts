import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  ensureAwsInstance,
  getAwsHermesAgent,
  getAwsInstanceProject,
  instancePlaneStatus,
} from "@/lib/aws/instance-registry";
import { getHermesSnapshot } from "@/lib/hermes/runtime";
import { hubBackendLabel, hubWriteJson } from "@/lib/hub/store";
import { agentProjectScope, workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import { isBedrockConfigured } from "@/lib/agent/bedrock";

export const runtime = "nodejs";

export type AgentProvisionResult = {
  ok: true;
  status: "ready" | "provisioning" | "onboarding_required";
  agent_id: string;
  workspace_path: string;
  hub_backend: "fs" | "s3";
  llm_provider: "amazon_bedrock";
  model_id: string;
  runtime: "hermes+pal-rostr";
  rostr_installed: true;
  soul_loaded: boolean;
  active_skills: number;
  chat_endpoint: string;
  instance_endpoint: string;
  completeness: number | null;
  message: string;
};

/**
 * Agent Provisioning Endpoint — "dropdown → Hermes instance"
 *
 * Called when a user selects their agent from the dropdown.
 * Provisions or retrieves their Hermes instance with ROSTR pre-installed.
 *
 * Flow:
 * 1. Auth check (Cognito session required)
 * 2. Ensure AWS instance (DynamoDB USER# + PROJECT# + AGENT#hermes)
 * 3. Bootstrap hub workspace (Soul, PAL config, Skills Library)
 * 4. Return agent connection details
 *
 * GET  /api/agent/provision - Check status
 * POST /api/agent/provision - Provision or refresh instance
 */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized — sign in to provision your agent" }, { status: 401 });
  }

  const [project, agent, hermes] = await Promise.all([
    getAwsInstanceProject(session.sub, session.projectId),
    getAwsHermesAgent(session.sub),
    getHermesSnapshot(session.sub, session.projectId),
  ]);

  if (!project || !agent) {
    return NextResponse.json({
      ok: true,
      status: "not_provisioned",
      message: "Agent not yet provisioned. POST to /api/agent/provision to create your Hermes instance.",
      provision_endpoint: "/api/agent/provision",
    });
  }

  const result: AgentProvisionResult = {
    ok: true,
    status: hermes.soul_loaded ? "ready" : "onboarding_required",
    agent_id: `hermes-${session.sub.slice(0, 8)}`,
    workspace_path: hermes.workspace_path,
    hub_backend: hubBackendLabel(),
    llm_provider: "amazon_bedrock",
    model_id: agent.model_id,
    runtime: "hermes+pal-rostr",
    rostr_installed: true,
    soul_loaded: hermes.soul_loaded,
    active_skills: hermes.active_skills.length,
    chat_endpoint: "/api/agent/chat",
    instance_endpoint: "/api/aws/instance",
    completeness: hermes.completeness,
    message: hermes.soul_loaded
      ? "Hermes agent ready. Soul loaded, ROSTR active."
      : "Agent provisioned but awaiting PAL onboarding. Complete /onboarding to personalize your agent.",
  };

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized — sign in to provision your agent" }, { status: 401 });
  }

  if (!isBedrockConfigured()) {
    return NextResponse.json(
      {
        error: "Bedrock not configured",
        hint: "AWS Bedrock credentials required for Hermes agent. Contact support.",
      },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    force_refresh?: boolean;
  };

  const scope = agentProjectScope(session.sub, session.projectId);

  const { profile, project, agent } = await ensureAwsInstance({
    userId: session.sub,
    email: session.email,
    name: session.name,
    projectId: session.projectId,
    workspacePath: workspaceLogicalPath(scope),
  });

  await hubWriteJson(scope, "00-config/rostr-manifest.json", {
    version: "1.0",
    runtime: "hermes+pal-rostr",
    components: {
      pal: { enabled: true, version: "2.0" },
      npao: { enabled: true },
      rag_dal: { enabled: false, reason: "Awaiting knowledge pack configuration" },
      rostr_hub: { enabled: true, backend: hubBackendLabel() },
    },
    provisioned_at: new Date().toISOString(),
    agent_id: `hermes-${session.sub.slice(0, 8)}`,
  });

  const hermes = await getHermesSnapshot(session.sub, session.projectId);

  const result: AgentProvisionResult = {
    ok: true,
    status: hermes.soul_loaded ? "ready" : "onboarding_required",
    agent_id: `hermes-${session.sub.slice(0, 8)}`,
    workspace_path: hermes.workspace_path,
    hub_backend: hubBackendLabel(),
    llm_provider: "amazon_bedrock",
    model_id: agent.model_id,
    runtime: "hermes+pal-rostr",
    rostr_installed: true,
    soul_loaded: hermes.soul_loaded,
    active_skills: hermes.active_skills.length,
    chat_endpoint: "/api/agent/chat",
    instance_endpoint: "/api/aws/instance",
    completeness: hermes.completeness,
    message: hermes.soul_loaded
      ? "Hermes agent provisioned and ready. ROSTR framework active."
      : "Hermes agent provisioned. Complete PAL onboarding at /onboarding to personalize your agent.",
  };

  return NextResponse.json(result);
}
