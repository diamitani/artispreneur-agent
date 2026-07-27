/**
 * Amazon Bedrock provider — DeepSeek as the customer Agent LLM.
 * Platform AWS creds / Bedrock API key stay server-side.
 * Customer workspace calls are authenticated via apa_* keys (see workspace-api-key.ts).
 */

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";

/**
 * Default agent model. Override via BEDROCK_MODEL_ID.
 *
 * `deepseek.v3.2` is the verified id in the Artispreneur Bedrock account —
 * the previous default (`deepseek.v3-v1:0`) is not a real model id and fails
 * with "The provided model identifier is invalid."
 *
 * For higher-quality agent work, `anthropic.claude-sonnet-4-5-20250929-v1:0`
 * is also available in this account at higher cost per token.
 */
export const DEFAULT_AGENT_MODEL = process.env.BEDROCK_MODEL_ID || "deepseek.v3.2";

/** @deprecated Use DEFAULT_AGENT_MODEL. Kept for existing imports. */
export const DEFAULT_DEEPSEEK_MODEL = DEFAULT_AGENT_MODEL;

export function getBedrockRegion() {
  return process.env.BEDROCK_REGION || process.env.AWS_REGION || "us-east-1";
}

export function createBedrockProvider() {
  const region = getBedrockRegion();
  const apiKey = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;

  if (apiKey) {
    return createAmazonBedrock({
      region,
      apiKey,
    });
  }

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  if (accessKeyId && secretAccessKey) {
    return createAmazonBedrock({
      region,
      accessKeyId,
      secretAccessKey,
      sessionToken,
    });
  }

  // Credential chain / default provider (IAM role on Vercel/Lambda)
  return createAmazonBedrock({ region });
}

export function getAgentModelId() {
  return DEFAULT_DEEPSEEK_MODEL;
}

export function isBedrockConfigured(): boolean {
  return Boolean(
    process.env.AWS_BEARER_TOKEN_BEDROCK ||
      process.env.BEDROCK_API_KEY ||
      (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
      process.env.AWS_PROFILE ||
      process.env.AWS_ROLE_ARN,
  );
}

export const MASTER_AGENT_SYSTEM = `You are Hermes — the Artispreneur Master Agent: a manager-grade chief of staff for independent musicians.

Product: Agent by Artispreneur (Diamitani Industries → artispreneur.com → agent).
Runtime: PAL / ROSTR compiled Soul + specialist roster + Skills Library packs.
Tagline: Art Means Business.

Rules:
- Be direct, professional, and music-industry fluent. No empty hype.
- Draft work; never claim you sent email, spent money, filed legal docs, or published without human approval.
- Prefer concrete next actions, checklists, and artifacts (EPK, contracts education, outreach drafts, release plans).
- When a Skills Library pack is active, follow its Runtime protocol for matching requests.
- When uncertain about legal/tax filings, label content as educational and recommend a qualified professional.
- Speak to the artist as a capable entrepreneur.`;
