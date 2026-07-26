import { GetObjectCommand, PutObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

type HubBackend = "fs" | "s3";

function getBackend(): HubBackend {
  const env = process.env.HUB_BACKEND ?? "fs";
  if (env === "s3") return "s3";
  return "fs";
}

// ---------------------------------------------------------------------------
// S3 backend
// ---------------------------------------------------------------------------

let _s3: S3Client | null = null;

function s3Client(): S3Client {
  if (!_s3) {
    _s3 = new S3Client({ region: process.env.AWS_REGION ?? "us-east-1" });
  }
  return _s3;
}

function bucket(): string {
  const b = process.env.S3_HUB_BUCKET;
  if (!b) throw new Error("S3_HUB_BUCKET environment variable is not set");
  return b;
}

async function s3Read(key: string): Promise<string | null> {
  try {
    const res = await s3Client().send(
      new GetObjectCommand({ Bucket: bucket(), Key: key })
    );
    return (await res.Body?.transformToString("utf-8")) ?? null;
  } catch (err: unknown) {
    if ((err as { name?: string }).name === "NoSuchKey") return null;
    throw err;
  }
}

async function s3Write(key: string, data: string): Promise<void> {
  await s3Client().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: data,
      ContentType: "application/octet-stream",
    })
  );
}

async function s3Exists(key: string): Promise<boolean> {
  try {
    await s3Client().send(
      new HeadObjectCommand({ Bucket: bucket(), Key: key })
    );
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Filesystem backend
// ---------------------------------------------------------------------------

const DATA_DIR = join(process.cwd(), ".data");

function fsPath(key: string): string {
  return join(DATA_DIR, key);
}

async function fsRead(key: string): Promise<string | null> {
  try {
    return await readFile(fsPath(key), "utf-8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

async function fsWrite(key: string, data: string): Promise<void> {
  const path = fsPath(key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data, "utf-8");
}

async function fsExists(key: string): Promise<boolean> {
  try {
    await access(fsPath(key));
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function hubReadText(key: string): Promise<string | null> {
  return getBackend() === "s3" ? s3Read(key) : fsRead(key);
}

export async function hubWriteText(key: string, data: string): Promise<void> {
  return getBackend() === "s3" ? s3Write(key, data) : fsWrite(key, data);
}

export async function hubReadJson<T = unknown>(key: string): Promise<T | null> {
  const raw = await hubReadText(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

export async function hubWriteJson(key: string, data: unknown): Promise<void> {
  await hubWriteText(key, JSON.stringify(data, null, 2));
}

export async function hubExists(key: string): Promise<boolean> {
  return getBackend() === "s3" ? s3Exists(key) : fsExists(key);
}
