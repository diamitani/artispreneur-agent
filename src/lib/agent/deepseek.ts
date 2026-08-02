/**
 * DeepSeek provider via OpenAI-compatible API.
 * Uses @ai-sdk/openai with a custom baseURL.
 */

import { createOpenAI } from "@ai-sdk/openai";

export const DEFAULT_DEEPSEEK_MODEL =
  process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

export function createDeepSeekProvider() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL =
    process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com/v1";

  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not set");

  return createOpenAI({ apiKey, baseURL });
}

export function isDeepSeekConfigured(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}
