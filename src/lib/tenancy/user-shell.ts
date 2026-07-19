/**
 * Provision the Diamitani → Artispreneur → Agent user shell on first OAuth login.
 * Local: .data/...  Prod target: S3 + DynamoDB USER# record (multi-tenant blueprint).
 */

import { mkdir, writeFile, access } from "fs/promises";
import path from "path";
import {
  ORG,
  PRODUCT,
  TENANT,
  agentProjectScope,
  workspaceFsRoot,
  workspaceLogicalPath,
} from "./hierarchy";
import { ensureWorkspaceApiKey } from "@/lib/agent/workspace-api-key";

export async function ensureUserShell(input: {
  userId: string;
  email: string;
  name?: string;
  projectId: string;
}) {
  const scope = agentProjectScope(input.userId, input.projectId);
  const root = workspaceFsRoot(scope);
  const configDir = path.join(root, "00-config");

  await mkdir(configDir, { recursive: true });
  await mkdir(path.join(root, "projects"), { recursive: true });
  await mkdir(path.join(root, "uploads"), { recursive: true });

  const identityPath = path.join(configDir, "identity.json");
  try {
    await access(identityPath);
  } catch {
    await writeFile(
      identityPath,
      JSON.stringify(
        {
          org: ORG,
          tenant: TENANT,
          product: PRODUCT,
          user: {
            cognito_sub: input.userId,
            email: input.email,
            name: input.name ?? null,
          },
          project_id: input.projectId,
          workspace_path: workspaceLogicalPath(scope),
          created_at: new Date().toISOString(),
          auth_provider: "aws_cognito",
          llm: {
            provider: "amazon_bedrock",
            model: process.env.BEDROCK_MODEL_ID || "deepseek.v3-v1:0",
          },
        },
        null,
        2,
      ),
      "utf8",
    );
  }

  // Long trackable apa_* key for this customer workspace (separate from AWS platform creds)
  const apiKey = await ensureWorkspaceApiKey(input.userId, input.projectId);

  return {
    root,
    workspacePath: workspaceLogicalPath(scope),
    projectId: input.projectId,
    apiKey,
  };
}
