/**
 * Knowledge Vault ingestion — the backend for drag-and-drop.
 *
 * An artist drops files into the workspace; they land under
 * `01-knowledge-base/`, get indexed, and become retrievable build context so
 * the next compile and every executor run can cite them.
 *
 * Text-bearing files are indexed with an excerpt for retrieval. Binary files
 * (audio, images) are stored and catalogued but not text-indexed — the agent
 * knows they exist and can reference them without pretending to read them.
 */

import { createHash } from "crypto";
import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { hubReadJson, hubWriteJson, hubWriteText } from "@/lib/hub/store";

const INDEX_PATH = "01-knowledge-base/vault-index.json";

/** Folders in the canonical tree that accept uploads. */
export const VAULT_CATEGORIES = [
  "music-and-artist-assets",
  "courses-and-guides",
  "contracts-and-templates",
  "outreach-directories",
  "approved-reference-material",
] as const;

export type VaultCategory = (typeof VAULT_CATEGORIES)[number];

/** Extensions we can meaningfully read as text. */
const TEXT_EXTENSIONS = new Set([
  "txt", "md", "markdown", "csv", "tsv", "json", "yaml", "yml",
  "html", "htm", "xml", "rtf", "log",
]);

export type VaultFile = {
  id: string;
  name: string;
  path: string;
  category: VaultCategory;
  content_type: string;
  bytes: number;
  /** Indexed text files carry an excerpt used for retrieval. */
  excerpt: string | null;
  indexed: boolean;
  uploaded_at: string;
};

export type VaultIndex = {
  version: 1;
  files: VaultFile[];
  updated_at: string;
};

const EXCERPT_CHARS = 1500;
const MAX_TEXT_BYTES = 2_000_000;

function extensionOf(name: string): string {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? (parts[parts.length - 1] ?? "") : "";
}

export function isTextFile(name: string, contentType?: string): boolean {
  if (contentType?.startsWith("text/")) return true;
  if (contentType === "application/json") return true;
  return TEXT_EXTENSIONS.has(extensionOf(name));
}

/**
 * Filesystem-safe name. Strips directory separators and traversal so an
 * uploaded name can never escape its category folder.
 */
export function safeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() || "file";
  return (
    base
      .replace(/[^A-Za-z0-9._-]/g, "-")
      .replace(/^\.+/, "")
      .slice(0, 120) || "file"
  );
}

export async function readVaultIndex(scope: WorkspaceScope): Promise<VaultIndex> {
  const stored = await hubReadJson<VaultIndex>(scope, INDEX_PATH).catch(() => null);
  return stored ?? { version: 1, files: [], updated_at: new Date().toISOString() };
}

export async function listVaultFiles(
  scope: WorkspaceScope,
  category?: VaultCategory,
): Promise<VaultFile[]> {
  const index = await readVaultIndex(scope);
  return category ? index.files.filter((f) => f.category === category) : index.files;
}

/**
 * Ingest one file into the vault.
 *
 * `content` is the decoded file body. Binary uploads should arrive base64 and
 * be decoded by the caller; only text is written verbatim and indexed.
 */
export async function ingestFile(input: {
  scope: WorkspaceScope;
  name: string;
  content: string;
  category: VaultCategory;
  contentType?: string;
  /** True when `content` is base64 of a binary file. */
  binary?: boolean;
}): Promise<VaultFile> {
  const name = safeFileName(input.name);
  const path = `01-knowledge-base/${input.category}/${name}`;
  const now = new Date().toISOString();
  const bytes = Buffer.byteLength(input.content, input.binary ? "base64" : "utf8");

  if (bytes > MAX_TEXT_BYTES) {
    throw new Error(`File too large: ${name} (${bytes} bytes, max ${MAX_TEXT_BYTES}).`);
  }

  const textual = !input.binary && isTextFile(name, input.contentType);

  await hubWriteText(
    input.scope,
    path,
    input.content,
    input.contentType || (textual ? "text/plain; charset=utf-8" : "application/octet-stream"),
  );

  const file: VaultFile = {
    id: createHash("sha256").update(`${input.category}/${name}`).digest("hex").slice(0, 12),
    name,
    path,
    category: input.category,
    content_type: input.contentType || (textual ? "text/plain" : "application/octet-stream"),
    bytes,
    excerpt: textual ? input.content.trim().slice(0, EXCERPT_CHARS) : null,
    indexed: textual,
    uploaded_at: now,
  };

  const index = await readVaultIndex(input.scope);
  // Re-uploading the same path replaces the entry rather than duplicating it.
  index.files = [...index.files.filter((f) => f.path !== file.path), file];
  index.updated_at = now;
  await hubWriteJson(input.scope, INDEX_PATH, index);

  return file;
}

/**
 * Keyword retrieval over indexed vault files, scoped to this workspace.
 * Ranked by how many query terms appear in the excerpt or filename.
 */
export async function searchVault(
  scope: WorkspaceScope,
  query: string,
  limit = 4,
): Promise<VaultFile[]> {
  const index = await readVaultIndex(scope);
  const indexed = index.files.filter((f) => f.indexed && f.excerpt);
  if (!indexed.length) return [];

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 3);
  if (!terms.length) return indexed.slice(0, limit);

  return indexed
    .map((file) => {
      const hay = `${file.name} ${file.excerpt}`.toLowerCase();
      return { file, score: terms.filter((t) => hay.includes(t)).length };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.file);
}
