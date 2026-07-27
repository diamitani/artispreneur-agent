/**
 * Amazon Bedrock AgentCore — configuration and capability gating.
 *
 * AgentCore is the managed agent plane for Agent by Artispreneur:
 *   Runtime   → serverless execution of the Hermes agent (InvokeAgentRuntime)
 *   Memory    → durable per-artist memory (CreateEvent / RetrieveMemoryRecords)
 *   Identity  → workload access tokens scoped to one artist workspace
 *   Gateway   → MCP / tool surface exposed to the agent
 *
 * Every capability is independently env-gated. When a capability is not
 * configured the caller degrades to the local hub/Bedrock path rather than
 * failing, mirroring `lib/aws/config.ts` and `isBedrockConfigured()`.
 */

export function getAgentCoreRegion() {
  return (
    process.env.AGENTCORE_REGION ||
    process.env.BEDROCK_REGION ||
    process.env.AWS_REGION ||
    "us-east-1"
  );
}

/** ARN of the deployed agent runtime that hosts Hermes. */
export function getAgentRuntimeArn() {
  return process.env.AGENTCORE_RUNTIME_ARN || "";
}

/** Runtime endpoint qualifier (version alias); AgentCore defaults to DEFAULT. */
export function getAgentRuntimeQualifier() {
  return process.env.AGENTCORE_RUNTIME_QUALIFIER || "DEFAULT";
}

/** Memory resource id holding per-artist long-term memory. */
export function getAgentCoreMemoryId() {
  return process.env.AGENTCORE_MEMORY_ID || "";
}

/** Workload identity name used to mint workspace-scoped access tokens. */
export function getWorkloadIdentityName() {
  return process.env.AGENTCORE_WORKLOAD_NAME || "";
}

/** Gateway URL exposing MCP tool targets to the agent. */
export function getAgentCoreGatewayUrl() {
  return process.env.AGENTCORE_GATEWAY_URL || "";
}

export function isAgentCoreRuntimeConfigured() {
  return Boolean(getAgentRuntimeArn());
}

export function isAgentCoreMemoryConfigured() {
  return Boolean(getAgentCoreMemoryId());
}

export function isAgentCoreIdentityConfigured() {
  return Boolean(getWorkloadIdentityName());
}

export function isAgentCoreGatewayConfigured() {
  return Boolean(getAgentCoreGatewayUrl());
}

/** True when any AgentCore capability is wired up. */
export function isAgentCoreEnabled() {
  return (
    isAgentCoreRuntimeConfigured() ||
    isAgentCoreMemoryConfigured() ||
    isAgentCoreIdentityConfigured() ||
    isAgentCoreGatewayConfigured()
  );
}

export type AgentCoreStatus = {
  enabled: boolean;
  region: string;
  runtime: { configured: boolean; arn: string | null; qualifier: string };
  memory: { configured: boolean; memory_id: string | null };
  identity: { configured: boolean; workload_name: string | null };
  gateway: { configured: boolean; url: string | null };
};

export function agentCoreStatus(): AgentCoreStatus {
  return {
    enabled: isAgentCoreEnabled(),
    region: getAgentCoreRegion(),
    runtime: {
      configured: isAgentCoreRuntimeConfigured(),
      arn: getAgentRuntimeArn() || null,
      qualifier: getAgentRuntimeQualifier(),
    },
    memory: {
      configured: isAgentCoreMemoryConfigured(),
      memory_id: getAgentCoreMemoryId() || null,
    },
    identity: {
      configured: isAgentCoreIdentityConfigured(),
      workload_name: getWorkloadIdentityName() || null,
    },
    gateway: {
      configured: isAgentCoreGatewayConfigured(),
      url: getAgentCoreGatewayUrl() || null,
    },
  };
}
