/**
 * Customer workspace Agent API keys — long-lived, trackable, separate from AWS/Bedrock platform creds.
 *
 * Format: apa_{live|test}_{96 hex}
 * Indexed in AWS instance registry (DynamoDB KEY# or hub global/).
 */

import { createHash, randomBytes } from "crypto";
import {
  agentProjectScope,
  workspaceLogicalPath,
} from "@/lib/tenancy/hierarchy";
import {
  hubExists,
  hubReadJson,
  hubWriteJson,
} from "@/lib/hub/store";
import { getApiKeyIndex, putApiKeyIndex } from "@/lib/aws/instance-registry";

export type WorkspaceApiKeyRecord = {
  key_id: string;
  key_prefix: string;
  key_hash: string;
  label: string;
  user_id: string;
  project_id: string;
  workspace_path: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
  env: "live" | "test";
};

export type IssuedWorkspaceApiKey = WorkspaceApiKeyRecord & {
  api_key: string;
};

function envTag(): "live" | "test" {
  return process.env.NODE_ENV === "production" ? "live" : "test";
}

export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex");
}

export function generateWorkspaceApiKey(env: "live" | "test" = envTag()): string {
  const body = randomBytes(48).toString("hex");
  return `apa_${env}_${body}`;
}

async function readKeyList(userId: string, projectId: string): Promise<WorkspaceApiKeyRecord[]> {
  const scope = agentProjectScope(userId, projectId);
  const data = await hubReadJson<{ keys?: WorkspaceApiKeyRecord[] }>(
    scope,
    "00-config/api-keys.json",
  );
  return data?.keys ?? [];
}

async function writeKeyList(userId: string, projectId: string, keys: WorkspaceApiKeyRecord[]) {
  const scope = agentProjectScope(userId, projectId);
  await hubWriteJson(scope, "00-config/api-keys.json", {
    keys,
    updated_at: new Date().toISOString(),
  });
}

async function indexKey(record: WorkspaceApiKeyRecord) {
  await putApiKeyIndex({
    keyHash: record.key_hash,
    keyId: record.key_id,
    userId: record.user_id,
    projectId: record.project_id,
    workspacePath: record.workspace_path,
    keyPrefix: record.key_prefix,
    revokedAt: record.revoked_at,
  });
}

export async function issueWorkspaceApiKey(input: {
  userId: string;
  projectId: string;
  label?: string;
}): Promise<IssuedWorkspaceApiKey> {
  const env = envTag();
  const api_key = generateWorkspaceApiKey(env);
  const key_hash = hashApiKey(api_key);
  const scope = agentProjectScope(input.userId, input.projectId);
  const key_id = `key_${randomBytes(8).toString("hex")}`;
  const key_prefix = `${api_key.slice(0, 18)}…`;

  const record: WorkspaceApiKeyRecord = {
    key_id,
    key_prefix,
    key_hash,
    label: input.label || "Workspace Agent",
    user_id: input.userId,
    project_id: input.projectId,
    workspace_path: workspaceLogicalPath(scope),
    created_at: new Date().toISOString(),
    last_used_at: null,
    revoked_at: null,
    env,
  };

  const keys = await readKeyList(input.userId, input.projectId);
  keys.push(record);
  await writeKeyList(input.userId, input.projectId, keys);
  await indexKey(record);

  await hubWriteJson(scope, "00-config/api-key.once.json", {
    api_key,
    key_id,
    key_prefix,
    created_at: record.created_at,
    note: "Copy now — this file is deleted after first reveal via API.",
  });

  return { ...record, api_key };
}

export async function listWorkspaceApiKeys(userId: string, projectId: string) {
  const keys = await readKeyList(userId, projectId);
  return keys.map((k) => {
    const { key_hash, ...safe } = k;
    void key_hash;
    return safe;
  });
}

export async function revealOnceApiKey(userId: string, projectId: string) {
  const scope = agentProjectScope(userId, projectId);
  const data = await hubReadJson<{
    api_key?: string;
    key_id?: string;
    key_prefix?: string;
    revealed?: boolean;
  }>(scope, "00-config/api-key.once.json");
  if (!data?.api_key || !data.key_id || !data.key_prefix) return null;
  await hubWriteJson(scope, "00-config/api-key.once.json", {
    revealed: true,
    at: new Date().toISOString(),
  });
  return {
    api_key: data.api_key,
    key_id: data.key_id,
    key_prefix: data.key_prefix,
  };
}

export async function revokeWorkspaceApiKey(userId: string, projectId: string, keyId: string) {
  const keys = await readKeyList(userId, projectId);
  const idx = keys.findIndex((k) => k.key_id === keyId);
  if (idx < 0) return false;
  keys[idx] = { ...keys[idx], revoked_at: new Date().toISOString() };
  await writeKeyList(userId, projectId, keys);
  await indexKey(keys[idx]);
  return true;
}

export type ResolvedWorkspaceKey = {
  keyId: string;
  userId: string;
  projectId: string;
  workspacePath: string;
  keyPrefix: string;
};

export async function resolveWorkspaceApiKey(
  apiKey: string,
): Promise<ResolvedWorkspaceKey | null> {
  if (!apiKey.startsWith("apa_")) return null;
  const key_hash = hashApiKey(apiKey);
  const idx = await getApiKeyIndex(key_hash);
  if (!idx || idx.revoked_at) return null;

  const keys = await readKeyList(idx.user_id, idx.project_id);
  const i = keys.findIndex((k) => k.key_hash === key_hash);
  if (i >= 0) {
    keys[i] = { ...keys[i], last_used_at: new Date().toISOString() };
    await writeKeyList(idx.user_id, idx.project_id, keys);
  }

  return {
    keyId: idx.key_id,
    userId: idx.user_id,
    projectId: idx.project_id,
    workspacePath: idx.workspace_path,
    keyPrefix: idx.key_prefix,
  };
}

export function extractApiKeyFromRequest(req: Request): string | null {
  const hdr = req.headers.get("x-artispreneur-agent-key");
  if (hdr?.startsWith("apa_")) return hdr.trim();
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer apa_")) {
    return auth.slice(7).trim();
  }
  return null;
}

export async function ensureWorkspaceApiKey(userId: string, projectId: string) {
  const keys = await readKeyList(userId, projectId);
  const active = keys.filter((k) => !k.revoked_at);
  if (active.length > 0) {
    return {
      issued: false as const,
      keys: active.map((k) => {
        const { key_hash, ...s } = k;
        void key_hash;
        return s;
      }),
    };
  }
  const issued = await issueWorkspaceApiKey({
    userId,
    projectId,
    label: "Default Workspace Agent",
  });
  return { issued: true as const, key: issued };
}

export async function workspaceHasApiKeys(userId: string, projectId: string) {
  const scope = agentProjectScope(userId, projectId);
  return hubExists(scope, "00-config/api-keys.json");
}
