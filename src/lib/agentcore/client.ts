/**
 * Lazy AgentCore clients (data plane + control plane).
 * Credentials come from the platform IAM chain, same as Bedrock/S3/DynamoDB.
 */

import { BedrockAgentCoreClient } from "@aws-sdk/client-bedrock-agentcore";
import { BedrockAgentCoreControlClient } from "@aws-sdk/client-bedrock-agentcore-control";
import { getAgentCoreRegion } from "./config";

let dataClient: BedrockAgentCoreClient | null = null;
let controlClient: BedrockAgentCoreControlClient | null = null;

/** Data plane: InvokeAgentRuntime, CreateEvent, RetrieveMemoryRecords, tokens. */
export function agentCoreData(): BedrockAgentCoreClient {
  if (!dataClient) {
    dataClient = new BedrockAgentCoreClient({ region: getAgentCoreRegion() });
  }
  return dataClient;
}

/** Control plane: CreateMemory, CreateGateway, CreateAgentRuntime, identities. */
export function agentCoreControl(): BedrockAgentCoreControlClient {
  if (!controlClient) {
    controlClient = new BedrockAgentCoreControlClient({ region: getAgentCoreRegion() });
  }
  return controlClient;
}
