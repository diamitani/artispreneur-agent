import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { createBedrockProvider, getAgentModelId, isBedrockConfigured, MASTER_AGENT_SYSTEM } from "@/lib/agent/bedrock";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const maxDuration = 30;

/** In-memory IP rate limiter — 20 messages per IP per hour. */
const ipLog = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 hour
  const limit = 20;

  const entry = ipLog.get(ip);
  if (!entry || entry.reset < now) {
    ipLog.set(ip, { count: 1, reset: now + window });
    return { ok: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0 };
  }
  entry.count++;
  return { ok: true, remaining: limit - entry.count };
}

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

  const { ok, remaining } = checkRateLimit(ip);
  if (!ok) {
    return Response.json(
      { error: "Demo rate limit reached. Sign up for unlimited access." },
      {
        status: 429,
        headers: { "Retry-After": "3600", "X-Demo-Remaining": "0" },
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
