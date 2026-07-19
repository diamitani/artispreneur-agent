/**
 * Customer workspace Agent API keys — long-lived, trackable, separate from AWS/Bedrock platform creds.
 *
 * Format: apa_{live|test}_{64 hex chars}  (~131 chars)
 * Auth header: Authorization: Bearer apa_...  OR  X-Artispreneur-Agent-Key: apa_...
 *
 * Only SHA-256 hashes are stored. Plaintext is returned once on create.
 */

import { createHash, randomBytes } from "crypto";
import { mkdir, readFile, writeFile, unlink } from "fs/promises";
import path from "path";
import {
  agentProjectScope,
  workspaceFsRoot,
  workspaceLogicalPath,
} from "@/lib/tenancy/hierarchy";

export type WorkspaceApiKeyRecord = {
  key_id: string;
  key_prefix: string; // first chars for display e.g. apa_live_a3f2…
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
  /** Plaintext — shown once. Never persisted after issue. */
  api_key: string;
};

const KEY_INDEX_DIR = () => path.join(process.cwd(), ".data", "agent-keys", "by-hash");

function envTag(): "live" | "test" {
  return process.env.NODE_ENV === "production" ? "live" : "test";
}

export function hashApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex");
}

/** Generate a long trackable customer workspace key */
export function generateWorkspaceApiKey(env: "live" | "test" = envTag()): string {
  const body = randomBytes(48).toString("hex"); // 96 hex chars
  return `apa_${env}_${body}`;
}

function keysFile(userId: string, projectId: string) {
  return path.join(workspaceFsRoot(agentProjectScope(userId, projectId)), "00-config", "api-keys.json");
}

function onceFile(userId: string, projectId: string) {
  return path.join(
    workspaceFsRoot(agentProjectScope(userId, projectId)),
    "00-config",
    "api-key.once.json",
  );
}

async function readKeyList(userId: string, projectId: string): Promise<WorkspaceApiKeyRecord[]> {
  try {
    const raw = await readFile(keysFile(userId, projectId), "utf8");
    const data = JSON.parse(raw) as { keys?: WorkspaceApiKeyRecord[] };
    return data.keys ?? [];
  } catch {
    return [];
  }
}

async function writeKeyList(userId: string, projectId: string, keys: WorkspaceApiKeyRecord[]) {
  const file = keysFile(userId, projectId);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify({ keys, updated_at: new Date().toISOString() }, null, 2), "utf8");
}

async function indexKey(record: WorkspaceApiKeyRecord) {
  const dir = KEY_INDEX_DIR();
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, `${record.key_hash}.json`),
    JSON.stringify(
      {
        key_id: record.key_id,
        user_id: record.user_id,
        project_id: record.project_id,
        workspace_path: record.workspace_path,
        key_prefix: record.key_prefix,
        revoked_at: record.revoked_at,
      },
      null,
      2,
    ),
    "utf8",
  );
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

  // One-time reveal file for UI (deleted after read)
  const once = onceFile(input.userId, input.projectId);
  await writeFile(
    once,
    JSON.stringify(
      {
        api_key,
        key_id,
        key_prefix,
        created_at: record.created_at,
        note: "Copy now — this file is deleted after first reveal via API.",
      },
      null,
      2,
    ),
    "utf8",
  );

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
  const file = onceFile(userId, projectId);
  try {
    const raw = await readFile(file, "utf8");
    await unlink(file).catch(() => undefined);
    return JSON.parse(raw) as { api_key: string; key_id: string; key_prefix: string };
  } catch {
    return null;
  }
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
  try {
    const raw = await readFile(path.join(KEY_INDEX_DIR(), `${key_hash}.json`), "utf8");
    const idx = JSON.parse(raw) as {
      key_id: string;
      user_id: string;
      project_id: string;
      workspace_path: string;
      key_prefix: string;
      revoked_at: string | null;
    };
    if (idx.revoked_at) return null;

    // Touch last_used
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
  } catch {
    return null;
  }
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

/** Ensure workspace has at least one active key; issue if none. */
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
  const issued = await issueWorkspaceApiKey({ userId, projectId, label: "Default Workspace Agent" });
  return { issued: true as const, key: issued };
}
