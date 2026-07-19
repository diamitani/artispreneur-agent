/**
 * Rostr Hub store — filesystem or S3 under the AWS instance hierarchy.
 *
 * Keys mirror workspaceLogicalPath:
 *   orgs/diamitani-industries/tenants/artispreneur-com/products/agent/
 *     users/{sub}/projects/{projectId}/{relative}
 *
 * Global keys (API key index, etc.):
 *   global/{relative}
 */

import { mkdir, readFile, writeFile, appendFile, access } from "fs/promises";
import path from "path";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { workspaceFsRoot, workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import {
  getAwsRegion,
  getHubBackend,
  getHubBucket,
  isS3HubConfigured,
} from "@/lib/aws/config";

let s3Client: S3Client | null = null;

function s3(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({ region: getAwsRegion() });
  }
  return s3Client;
}

function normalizeRel(rel: string) {
  return rel.replace(/^\/+/, "").replace(/\\/g, "/");
}

function workspaceKey(scope: WorkspaceScope, relative: string) {
  return `${workspaceLogicalPath(scope)}/${normalizeRel(relative)}`;
}

function globalKey(relative: string) {
  return `global/${normalizeRel(relative)}`;
}

function fsPathFromKey(key: string) {
  return path.join(process.cwd(), ".data", key);
}

async function s3GetText(key: string): Promise<string | null> {
  try {
    const out = await s3().send(
      new GetObjectCommand({ Bucket: getHubBucket(), Key: key }),
    );
    return (await out.Body?.transformToString("utf8")) ?? null;
  } catch (e: unknown) {
    const name = (e as { name?: string })?.name;
    if (name === "NoSuchKey" || name === "NotFound") return null;
    throw e;
  }
}

async function s3PutText(key: string, body: string, contentType = "text/plain; charset=utf-8") {
  await s3().send(
    new PutObjectCommand({
      Bucket: getHubBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

async function s3Exists(key: string) {
  try {
    await s3().send(new HeadObjectCommand({ Bucket: getHubBucket(), Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function fsReadText(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

async function fsWriteText(file: string, body: string) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body, "utf8");
}

async function fsAppendText(file: string, line: string) {
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, line, "utf8");
}

async function fsExists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export function hubBackendLabel() {
  if (getHubBackend() === "s3" && isS3HubConfigured()) return "s3" as const;
  return "fs" as const;
}

/** Read text under a user project workspace */
export async function hubReadText(scope: WorkspaceScope, relative: string) {
  const key = workspaceKey(scope, relative);
  if (hubBackendLabel() === "s3") return s3GetText(key);
  return fsReadText(fsPathFromKey(key));
}

export async function hubWriteText(
  scope: WorkspaceScope,
  relative: string,
  body: string,
  contentType?: string,
) {
  const key = workspaceKey(scope, relative);
  if (hubBackendLabel() === "s3") {
    const ct =
      contentType ||
      (relative.endsWith(".json")
        ? "application/json"
        : relative.endsWith(".md")
          ? "text/markdown; charset=utf-8"
          : "text/plain; charset=utf-8");
    await s3PutText(key, body, ct);
    return key;
  }
  await fsWriteText(fsPathFromKey(key), body);
  return key;
}

export async function hubReadJson<T>(scope: WorkspaceScope, relative: string): Promise<T | null> {
  const raw = await hubReadText(scope, relative);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function hubWriteJson(scope: WorkspaceScope, relative: string, data: unknown) {
  return hubWriteText(scope, relative, JSON.stringify(data, null, 2), "application/json");
}

export async function hubAppendJsonl(scope: WorkspaceScope, relative: string, row: unknown) {
  const line = `${JSON.stringify(row)}\n`;
  const key = workspaceKey(scope, relative);
  if (hubBackendLabel() === "s3") {
    const existing = (await s3GetText(key)) || "";
    await s3PutText(key, existing + line, "application/x-ndjson");
    return key;
  }
  await fsAppendText(fsPathFromKey(key), line);
  return key;
}

export async function hubExists(scope: WorkspaceScope, relative: string) {
  const key = workspaceKey(scope, relative);
  if (hubBackendLabel() === "s3") return s3Exists(key);
  return fsExists(fsPathFromKey(key));
}

/** Ensure workspace prefix exists (identity marker) */
export async function hubEnsureWorkspace(scope: WorkspaceScope) {
  const marker = "00-config/.hub";
  if (!(await hubExists(scope, marker))) {
    await hubWriteJson(scope, marker, {
      workspace_path: workspaceLogicalPath(scope),
      backend: hubBackendLabel(),
      created_at: new Date().toISOString(),
    });
  }
  // Keep local dirs for fs tooling even when S3 primary (dual-write optional)
  if (hubBackendLabel() === "fs") {
    const root = workspaceFsRoot(scope);
    await mkdir(path.join(root, "00-config"), { recursive: true });
    await mkdir(path.join(root, "projects"), { recursive: true });
    await mkdir(path.join(root, "uploads"), { recursive: true });
    await mkdir(path.join(root, "skills"), { recursive: true });
    await mkdir(path.join(root, "03-agent-workflows"), { recursive: true });
  }
}

export async function hubReadGlobalText(relative: string) {
  const key = globalKey(relative);
  if (hubBackendLabel() === "s3") return s3GetText(key);
  return fsReadText(fsPathFromKey(key));
}

export async function hubWriteGlobalText(relative: string, body: string, contentType?: string) {
  const key = globalKey(relative);
  if (hubBackendLabel() === "s3") {
    await s3PutText(key, body, contentType || "application/json");
    return key;
  }
  await fsWriteText(fsPathFromKey(key), body);
  return key;
}

export async function hubReadGlobalJson<T>(relative: string): Promise<T | null> {
  const raw = await hubReadGlobalText(relative);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function hubWriteGlobalJson(relative: string, data: unknown) {
  return hubWriteGlobalText(relative, JSON.stringify(data, null, 2), "application/json");
}
