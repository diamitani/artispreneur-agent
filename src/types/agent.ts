export type AgentStatus = "idle" | "thinking" | "executing" | "waiting" | "error";

export type AgentCapability =
  | "task_management"
  | "content_generation"
  | "research"
  | "scheduling"
  | "analytics"
  | "communication"
  | "file_management";

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  modelId: string;
  systemPrompt: string;
  capabilities: AgentCapability[];
  maxTokens: number;
  temperature: number;
}

export interface AgentMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: string;
  toolCallId?: string;
  toolName?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentSession {
  id: string;
  userId: string;
  agentId: string;
  status: AgentStatus;
  messages: AgentMessage[];
  context: AgentContext;
  createdAt: string;
  updatedAt: string;
}

export interface AgentContext {
  projectId?: string;
  taskId?: string;
  activeTools: string[];
  memory: Record<string, unknown>;
}

export interface AgentToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
}

export interface AgentUsage {
  day: string;
  inputTokens: number;
  outputTokens: number;
  requestCount: number;
  modelId: string;
}
