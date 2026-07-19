/**
 * Per-workspace Agent usage ledger — keyed by customer apa_* API key + project.
 * Hub (fs|S3) JSONL + summary; DynamoDB USAGE#{day} when instance table is set.
 */

import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import {
  hubAppendJsonl,
  hubReadJson,
  hubWriteJson,
} from "@/lib/hub/store";
import { touchInstanceUsageDay } from "@/lib/aws/instance-registry";

export type UsageEvent = {
  at: string;
  key_id: string;
  key_prefix: string;
  user_id: string;
  project_id: string;
  workspace_path: string;
  model_id: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
  route: string;
};

function estimateCost(input: number, output: number) {
  return (input / 1000) * 0.00135 + (output / 1000) * 0.00405;
}

export async function recordUsage(
  event: Omit<UsageEvent, "at" | "estimated_cost_usd" | "total_tokens">,
) {
  const full: UsageEvent = {
    ...event,
    at: new Date().toISOString(),
    total_tokens: event.input_tokens + event.output_tokens,
    estimated_cost_usd: estimateCost(event.input_tokens, event.output_tokens),
  };

  const scope = agentProjectScope(event.user_id, event.project_id);
  await hubAppendJsonl(scope, "00-config/usage.jsonl", full);

  type Summary = {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    estimated_cost_usd: number;
    calls: number;
    last_at: string | null;
    model_id: string;
  };

  let summary: Summary = {
    input_tokens: 0,
    output_tokens: 0,
    total_tokens: 0,
    estimated_cost_usd: 0,
    calls: 0,
    last_at: null,
    model_id: event.model_id,
  };
  const prev = await hubReadJson<Summary>(scope, "00-config/usage-summary.json");
  if (prev) summary = { ...summary, ...prev };

  summary.input_tokens += full.input_tokens;
  summary.output_tokens += full.output_tokens;
  summary.total_tokens += full.total_tokens;
  summary.estimated_cost_usd = Number(
    (summary.estimated_cost_usd + full.estimated_cost_usd).toFixed(6),
  );
  summary.calls += 1;
  summary.last_at = full.at;
  summary.model_id = event.model_id;

  await hubWriteJson(scope, "00-config/usage-summary.json", summary);

  const day = full.at.slice(0, 10);
  await touchInstanceUsageDay({
    userId: event.user_id,
    projectId: event.project_id,
    day,
    inputTokens: full.input_tokens,
    outputTokens: full.output_tokens,
    costUsd: full.estimated_cost_usd,
  }).catch(() => undefined);

  return full;
}

export async function getUsageSummary(userId: string, projectId: string) {
  const scope = agentProjectScope(userId, projectId);
  return (
    (await hubReadJson(scope, "00-config/usage-summary.json")) ?? {
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
      estimated_cost_usd: 0,
      calls: 0,
      last_at: null,
    }
  );
}
