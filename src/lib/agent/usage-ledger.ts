/**
 * Per-workspace Agent usage ledger — keyed by customer apa_* API key + project.
 * Local JSONL; prod target = DynamoDB bedrock-usage table.
 */

import { appendFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { agentProjectScope, workspaceFsRoot } from "@/lib/tenancy/hierarchy";

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

/** Rough DeepSeek V3 Bedrock pricing (adjust when AWS publishes exact rates) */
function estimateCost(input: number, output: number) {
  return (input / 1000) * 0.00135 + (output / 1000) * 0.00405;
}

function ledgerPath(userId: string, projectId: string) {
  return path.join(
    workspaceFsRoot(agentProjectScope(userId, projectId)),
    "00-config",
    "usage.jsonl",
  );
}

function summaryPath(userId: string, projectId: string) {
  return path.join(
    workspaceFsRoot(agentProjectScope(userId, projectId)),
    "00-config",
    "usage-summary.json",
  );
}

export async function recordUsage(event: Omit<UsageEvent, "at" | "estimated_cost_usd" | "total_tokens">) {
  const full: UsageEvent = {
    ...event,
    at: new Date().toISOString(),
    total_tokens: event.input_tokens + event.output_tokens,
    estimated_cost_usd: estimateCost(event.input_tokens, event.output_tokens),
  };

  const file = ledgerPath(event.user_id, event.project_id);
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(full)}\n`, "utf8");

  // Rolling summary
  let summary = {
    input_tokens: 0,
    output_tokens: 0,
    total_tokens: 0,
    estimated_cost_usd: 0,
    calls: 0,
    last_at: null as string | null,
    model_id: event.model_id,
  };
  try {
    summary = { ...summary, ...JSON.parse(await readFile(summaryPath(event.user_id, event.project_id), "utf8")) };
  } catch {
    /* new */
  }
  summary.input_tokens += full.input_tokens;
  summary.output_tokens += full.output_tokens;
  summary.total_tokens += full.total_tokens;
  summary.estimated_cost_usd = Number(
    (summary.estimated_cost_usd + full.estimated_cost_usd).toFixed(6),
  );
  summary.calls += 1;
  summary.last_at = full.at;
  summary.model_id = event.model_id;

  const { writeFile } = await import("fs/promises");
  await writeFile(summaryPath(event.user_id, event.project_id), JSON.stringify(summary, null, 2), "utf8");

  return full;
}

export async function getUsageSummary(userId: string, projectId: string) {
  try {
    return JSON.parse(await readFile(summaryPath(userId, projectId), "utf8"));
  } catch {
    return {
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
      estimated_cost_usd: 0,
      calls: 0,
      last_at: null,
    };
  }
}
