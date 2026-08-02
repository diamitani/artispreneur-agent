import { streamText, type UIMessage, type ToolSet, convertToModelMessages } from "ai";
import {
  createBedrockProvider,
  getAgentModelId,
  isBedrockConfigured,
} from "@/lib/agent/bedrock";
import {
  createDeepSeekProvider,
  DEFAULT_DEEPSEEK_MODEL,
  isDeepSeekConfigured,
} from "@/lib/agent/deepseek";
import {
  extractApiKeyFromRequest,
  resolveWorkspaceApiKey,
} from "@/lib/agent/workspace-api-key";
import { recordUsage } from "@/lib/agent/usage-ledger";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import { buildHermesSystemPrompt } from "@/lib/hermes/runtime";
import {
  recallMemory,
  rememberTurns,
  runtimeSessionId,
  type MemoryTurn,
} from "@/lib/agentcore";
import { getComposioTools, isComposioConfigured } from "@/lib/composio";
import { getMusicTools } from "@/lib/mcp/music/ai-tools";
import {
  MAX_MESSAGES_PER_REQUEST,
  checkDailyTokenBudget,
  messagesTooLarge,
} from "@/lib/agent/limits";
import { consumeRateLimit } from "@/lib/agent/rate-limit";
import { getAwsInstanceProject } from "@/lib/aws/instance-registry";
import { log } from "@/lib/logger";

export const runtime = "nodejs";
export const maxDuration = 60;

function extractLatestUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (!message || message.role !== "user") continue;
    const text = (message.parts ?? [])
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(" ")
      .trim();
    if (text) return text;
  }
  return "";
}

export async function POST(req: Request) {
  const hasDeepSeek = isDeepSeekConfigured();
  const hasBedrock = isBedrockConfigured();

  if (!hasDeepSeek && !hasBedrock) {
    log.error("agent.chat.no_llm", { hasDeepSeek, hasBedrock });
    return Response.json(
      { error: "No LLM configured", hint: "Set DEEPSEEK_API_KEY or Bedrock credentials." },
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

  // `artistId` is deliberately absent from this type. See the note below.
  let body: { messages?: UIMessage[] };
  try {
    body = (await req.json()) as { messages?: UIMessage[] };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // `artistId` used to be accepted here and used to overwrite the
  // session-derived projectId. Because projectId is passed to Composio as the
  // entity key (a flat, account-global namespace), that let any signed-in user
  // address another artist's connected Gmail, Drive, and Slack — including
  // write actions — and billed the usage to them. Identity comes from the
  // session only; see the guarantee in src/lib/auth/index.ts.

  // Cost control. Bedrock bills every input token, so an uncapped message array
  // is the expensive half of an abusive request — cap it before anything else
  // spends money. Newest messages win; the oldest turns are the ones the model
  // needs least and AgentCore memory recalls them anyway.
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }
  if (messagesTooLarge(body.messages)) {
    return Response.json(
      { error: "That conversation is too long to send. Start a new chat." },
      { status: 413 },
    );
  }
  const messages = body.messages.slice(-MAX_MESSAGES_PER_REQUEST);

  // Burst limit, shared across serverless instances where DynamoDB is set up.
  const burst = await consumeRateLimit({
    namespace: "agent-chat",
    subject: `${userId}:${projectId}`,
    limit: 30,
    windowSeconds: 60,
  });
  if (!burst.ok) {
    return Response.json(
      { error: "Too many messages at once. Give it a moment." },
      { status: 429, headers: { "Retry-After": String(burst.resetsInSeconds) } },
    );
  }

  // Daily token budget for the plan on this workspace.
  const workspaceProject = await getAwsInstanceProject(userId, projectId).catch(() => null);
  const budget = await checkDailyTokenBudget({ userId, plan: workspaceProject?.plan });
  if (!budget.allowed) {
    return Response.json(
      {
        error:
          "You've used today's agent allowance. It resets at midnight UTC — upgrading raises the limit.",
        used_tokens: budget.used,
        daily_token_budget: budget.budget,
      },
      { status: 429, headers: { "Retry-After": String(budget.resetsInSeconds) } },
    );
  }

  const { system, snapshot } = await buildHermesSystemPrompt(userId, projectId);

  // Memory recall
  const scope = agentProjectScope(userId, projectId);
  const sessionId = runtimeSessionId(scope);
  const latestUserText = extractLatestUserText(messages);
  const recalled = latestUserText
    ? await recallMemory({ scope, query: latestUserText, limit: 5 }).catch(() => [])
    : [];

  const systemWithMemory = recalled.length
    ? `${system}\n\n## Recalled artist memory\n${recalled.map((m) => `- ${m.text.slice(0, 400)}`).join("\n")}`
    : system;

  // Tools
  const rawTools: ToolSet = {
    ...(isComposioConfigured() ? getComposioTools({ entityId: projectId }) : {}),
    ...getMusicTools(),
  };
  const tools: ToolSet | undefined = Object.keys(rawTools).length ? rawTools : undefined;

  // Pick provider — DeepSeek first, Bedrock fallback
  let model;
  let modelId: string;

  if (hasDeepSeek) {
    const deepseek = createDeepSeekProvider();
    modelId = DEFAULT_DEEPSEEK_MODEL;
    model = deepseek(modelId);
  } else {
    modelId = getAgentModelId();
    model = createBedrockProvider()(modelId);
  }

  log.info("agent.chat.request", {
    userId,
    projectId,
    modelId,
    provider: hasDeepSeek ? "deepseek" : "bedrock",
    keyPrefix,
    messageCount: body.messages.length,
    hasMemory: recalled.length > 0,
    toolCount: Object.keys(rawTools).length,
  });

  const result = streamText({
    model,
    system: systemWithMemory,
    messages: await convertToModelMessages(messages),
    tools,
    temperature: 0.6,
    maxOutputTokens: 4096,
    onFinish: async ({ usage, text }) => {
      const input = usage?.inputTokens ?? 0;
      const output = usage?.outputTokens ?? 0;

      log.info("agent.chat.finish", {
        userId,
        projectId,
        modelId,
        provider: hasDeepSeek ? "deepseek" : "bedrock",
        inputTokens: input,
        outputTokens: output,
        responseLength: text?.length ?? 0,
      });

      const turns: MemoryTurn[] = [];
      if (latestUserText) turns.push({ role: "artist", text: latestUserText });
      if (text?.trim()) turns.push({ role: "agent", text: text.trim() });
      if (turns.length) {
        await rememberTurns({ scope, sessionId, turns }).catch((e) =>
          console.error("[agentcore:memory]", e),
        );
      }
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
      await log.flush();
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
