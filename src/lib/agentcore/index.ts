/**
 * Amazon Bedrock AgentCore — managed agent plane for Agent by Artispreneur.
 * See docs/AGENT_BACKEND.md for how this layers under ROSTR and Hermes.
 */

export {
  agentCoreStatus,
  isAgentCoreEnabled,
  isAgentCoreMemoryConfigured,
  isAgentCoreIdentityConfigured,
  isAgentCoreRuntimeConfigured,
  isAgentCoreGatewayConfigured,
  getAgentCoreRegion,
} from "./config";
export type { AgentCoreStatus } from "./config";

export { rememberTurns, recallMemory, memoryActorId, memoryNamespace } from "./memory";
export type { MemoryTurn, MemoryRole, RecalledMemory } from "./memory";

export { mintWorkspaceToken } from "./identity";
export type { WorkloadToken } from "./identity";

export { invokeAgentRuntime, runtimeSessionId } from "./runtime";
export type { RuntimeInvocation, RuntimeResult, RuntimeSkipped } from "./runtime";
