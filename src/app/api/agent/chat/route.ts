import { streamText, type UIMessage, convertToModelMessages } from "ai";
import {
  createBedrockProvider,
  getAgentModelId,
  isBedrockConfigured,
} from "@/lib/agent/bedrock";
import {
  extractApiKeyFromRequest,
  resolveWorkspaceApiKey,
} from "@/lib/agent/workspace-api-key";
import { recordUsage } from "@/lib/agent/usage-ledger";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope, workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import { buildHermesSystemPrompt } from "@/lib/hermes/runtime";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Hermes Agent chat — Amazon Bedrock DeepSeek + PAL/ROSTR runtime + Skills Library.
 *
 * Auth (either):
 * 1. Cognito session cookie (browser Mission Control)
 * 2. Workspace Agent API key: Authorization: Bearer apa_… or X-Artispreneur-Agent-Key
 */
export async function POST(req: Request) {
  if (!isBedrockConfigured()) {
    return Response.json(
      {
        error: "Bedrock not configured",
        hint: "Set AWS_BEARER_TOKEN_BEDROCK (or AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY) and BEDROCK_MODEL_ID.",
      },
      { status: 503 },
    );
  }

  const apiKey = extractApiKeyFromRequest(req);
  let userId: string;
  let projectId: string;
  let keyId = "session";
  let keyPrefix = "session";
  let workspacePath: string;

  if (apiKey) {
    const resolved = await resolveWorkspaceApiKey(apiKey);
    if (!resolved) {
      return Response.json({ error: "Invalid or revoked workspace API key" }, { status: 401 });
    }
    userId = resolved.userId;
    projectId = resolved.projectId;
    keyId = resolved.keyId;
    keyPrefix = resolved.keyPrefix;
    workspacePath = resolved.workspacePath;
  } else {
    const session = await getSessionUser();
    if (!session) {
      return Response.json(
        { error: "Unauthorized — sign in or pass X-Artispreneur-Agent-Key" },
        { status: 401 },
      );
    }
    userId = session.sub;
    projectId = session.projectId;
    workspacePath = session.workspacePath;
  }

  const body = (await req.json()) as {
    messages: UIMessage[];
    artistId?: string;
  };

  if (body.artistId) {
    projectId = body.artistId;
    workspacePath = workspaceLogicalPath(agentProjectScope(userId, projectId));
  }

  const { system, snapshot } = await buildHermesSystemPrompt(userId, projectId);
  const modelId = getAgentModelId();
  const bedrock = createBedrockProvider();

  const result = streamText({
    model: bedrock(modelId),
    system,
    messages: await convertToModelMessages(body.messages),
    temperature: 0.6,
    maxOutputTokens: 4096,
    onFinish: async ({ usage }) => {
      const input = usage?.inputTokens ?? 0;
      const output = usage?.outputTokens ?? 0;
      await recordUsage({
        key_id: keyId,
        key_prefix: keyPrefix,
        user_id: userId,
        project_id: projectId,
        workspace_path: workspacePath,
        model_id: modelId,
        input_tokens: input,
        output_tokens: output,
        route: "/api/agent/chat",
      }).catch((e) => console.error("[usage]", e));
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "X-Artispreneur-Model": modelId,
      "X-Artispreneur-Workspace": workspacePath,
      "X-Artispreneur-Key-Prefix": keyPrefix,
      "X-Artispreneur-Runtime": "hermes+pal-rostr",
      "X-Artispreneur-Active-Skills": String(snapshot.active_skills.length),
    },
  });
}
