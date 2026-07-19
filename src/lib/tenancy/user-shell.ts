/**
 * Provision the Diamitani → Artispreneur → Agent user shell on first OAuth login.
 *
 * Managed under the AWS instance system:
 *   Hub (fs|S3)  → workspace files
 *   DynamoDB     → USER# / PROJECT# / AGENT#hermes control plane
 */

import {
  ORG,
  PRODUCT,
  TENANT,
  agentProjectScope,
  workspaceLogicalPath,
} from "./hierarchy";
import { ensureWorkspaceApiKey } from "@/lib/agent/workspace-api-key";
import { hubEnsureWorkspace, hubExists, hubWriteJson, hubBackendLabel } from "@/lib/hub/store";
import { ensureAwsInstance } from "@/lib/aws/instance-registry";

export async function ensureUserShell(input: {
  userId: string;
  email: string;
  name?: string;
  projectId: string;
}) {
  const scope = agentProjectScope(input.userId, input.projectId);
  const workspacePath = workspaceLogicalPath(scope);

  await hubEnsureWorkspace(scope);

  if (!(await hubExists(scope, "00-config/identity.json"))) {
    await hubWriteJson(scope, "00-config/identity.json", {
      org: ORG,
      tenant: TENANT,
      product: PRODUCT,
      user: {
        cognito_sub: input.userId,
        email: input.email,
        name: input.name ?? null,
      },
      project_id: input.projectId,
      workspace_path: workspacePath,
      created_at: new Date().toISOString(),
      auth_provider: "aws_cognito",
      instance: {
        hub_backend: hubBackendLabel(),
        control_plane: "dynamodb_USER#",
        runtime: "hermes+pal-rostr",
      },
      llm: {
        provider: "amazon_bedrock",
        model: process.env.BEDROCK_MODEL_ID || "deepseek.v3-v1:0",
      },
    });
  }

  const instance = await ensureAwsInstance({
    userId: input.userId,
    email: input.email,
    name: input.name,
    projectId: input.projectId,
    workspacePath,
  });

  const apiKey = await ensureWorkspaceApiKey(input.userId, input.projectId);

  return {
    workspacePath,
    projectId: input.projectId,
    hub_backend: hubBackendLabel(),
    instance,
    apiKey,
  };
}
