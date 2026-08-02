import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { createBedrockProvider, getAgentModelId, isBedrockConfigured, MASTER_AGENT_SYSTEM } from "@/lib/agent/bedrock";
import { headers } from "next/headers";
import { consumeRateLimit } from "@/lib/agent/rate-limit";
import { messagesTooLarge } from "@/lib/agent/limits";

export const runtime = "nodejs";
export const maxDuration = 30;

/** 20 messages per IP per hour, counted in a store shared across instances. */
const DEMO_LIMIT = 20;
const DEMO_WINDOW_SECONDS = 60 * 60;

const DEMO_SYSTEM = `${MASTER_AGENT_SYSTEM}

This is a public demo widget on the Artispreneur homepage. Rules specific to demo mode:
- Respond helpfully but keep answers under ~200 words.
- For complex tasks (filing, legal, account setup) explain what the agent would do, then invite the user to sign up for their real workspace.
- Do not generate actual legal documents or complete filings in demo mode.
- After 2 user messages, mention that signing up creates a real workspace where the agent has full context.`;

/**
 * Public demo chat endpoint — Amazon Bedrock DeepSeek, no auth required.
 * Rate-limited: 20 messages per IP per hour.
 * POST /api/agent/demo
 */
export async function POST(req: Request) {
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";

  const { ok, remaining, resetsInSeconds } = await consumeRateLimit({
    namespace: "agent-demo",
    subject: ip,
    limit: DEMO_LIMIT,
    windowSeconds: DEMO_WINDOW_SECONDS,
  });
  if (!ok) {
    return Response.json(
      { error: "Demo rate limit reached. Sign up for your own workspace." },
      {
        status: 429,
        headers: {
          "Retry-After": String(resetsInSeconds),
          "X-Demo-Remaining": "0",
        },
      },
    );
  }

  if (!isBedrockConfigured()) {
    return Response.json(
      { error: "Bedrock not configured on this deployment." },
      { status: 503 },
    );
  }

  let body: { messages: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (messagesTooLarge(body.messages ?? [])) {
    return Response.json(
      { error: "That's too long for the demo. Sign up for your own workspace." },
      { status: 413 },
    );
  }
  const messages = (body.messages ?? []).slice(-6); // cap context window for demo
  const bedrock = createBedrockProvider();
  const modelId = getAgentModelId();

  const result = streamText({
    model: bedrock(modelId),
    system: DEMO_SYSTEM,
    messages: await convertToModelMessages(messages),
    temperature: 0.65,
    maxOutputTokens: 512,
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "X-Artispreneur-Demo": "true",
      "X-Artispreneur-Model": modelId,
      "X-Demo-Remaining": String(remaining),
    },
  });
}
