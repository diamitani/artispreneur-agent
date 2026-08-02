/**
 * Cost control for the agent chat routes.
 *
 * `/api/agent/chat` had no rate limit, no token budget, and no cap on the
 * message array — a signed-in user (or a leaked workspace API key) could
 * replay a 500-message conversation in a loop and bill it to the deployment.
 * Bedrock charges per input token, so an uncapped `messages` array is the
 * expensive half, not the response.
 *
 * The budget is per user per UTC day, read from the same usage rollup
 * `recordUsage` already writes. It is a backstop against runaway spend, not a
 * metering product: the check happens before the request and the day's total is
 * updated after it finishes, so a burst of concurrent requests can overshoot
 * by roughly one request each. That is the right trade — blocking on a
 * synchronous read-modify-write per token would cost more than it saves.
 */

import { getInstanceUsageDay } from "@/lib/aws/instance-registry";
import type { PlanKey } from "@/lib/billing/plans";

/** Newest-first messages kept per request. Bedrock bills every one of them. */
export const MAX_MESSAGES_PER_REQUEST = 40;

/** Hard ceiling on a single message, before it ever reaches the model. */
export const MAX_MESSAGE_CHARS = 24_000;

/**
 * Daily token budget per plan (input + output).
 *
 * Sized against the estimate in `usage-ledger.ts` (~$0.00135/1k in,
 * ~$0.00405/1k out): Free lands near $0.20/day worst case, Artist near
 * $2/day against a $9.99/month price, Unlimited near $20/day against $99.
 * Override with AGENT_DAILY_TOKEN_BUDGET_{PLAN} if your model pricing differs.
 */
const DEFAULT_DAILY_TOKENS: Record<PlanKey, number> = {
  starter: 60_000,
  workspace: 600_000,
  agency: 6_000_000,
};

function envBudget(plan: PlanKey): number | null {
  const raw = process.env[`AGENT_DAILY_TOKEN_BUDGET_${plan.toUpperCase()}`];
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

export function dailyTokenBudget(plan: string | null | undefined): number {
  const key = (plan ?? "starter") as PlanKey;
  const known = key in DEFAULT_DAILY_TOKENS ? key : "starter";
  return envBudget(known) ?? DEFAULT_DAILY_TOKENS[known];
}

export function utcDay(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export type BudgetVerdict = {
  allowed: boolean;
  used: number;
  budget: number;
  remaining: number;
  /** Seconds until the budget resets, for a Retry-After header. */
  resetsInSeconds: number;
};

function secondsUntilUtcMidnight(now = new Date()): number {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
  return Math.max(1, Math.ceil((next - now.getTime()) / 1000));
}

/**
 * Check the caller's remaining budget for today.
 *
 * A failed read is treated as allowed — a transient DynamoDB error must not
 * take chat down for every user. The write path logs its own failures.
 */
export async function checkDailyTokenBudget(input: {
  userId: string;
  plan: string | null | undefined;
  now?: Date;
}): Promise<BudgetVerdict> {
  const now = input.now ?? new Date();
  const budget = dailyTokenBudget(input.plan);
  const resetsInSeconds = secondsUntilUtcMidnight(now);

  let used = 0;
  try {
    const day = await getInstanceUsageDay(input.userId, utcDay(now));
    used = (day?.input_tokens ?? 0) + (day?.output_tokens ?? 0);
  } catch {
    return { allowed: true, used: 0, budget, remaining: budget, resetsInSeconds };
  }

  return {
    allowed: used < budget,
    used,
    budget,
    remaining: Math.max(0, budget - used),
    resetsInSeconds,
  };
}

/** Total characters across every text part in a UI message array. */
export function messagesTooLarge(
  messages: Array<{ parts?: Array<{ type: string; text?: string }> }>,
): boolean {
  let total = 0;
  for (const message of messages) {
    for (const part of message.parts ?? []) {
      if (part.type === "text" && typeof part.text === "string") {
        total += part.text.length;
        if (total > MAX_MESSAGE_CHARS * 4) return true;
      }
    }
  }
  return false;
}
