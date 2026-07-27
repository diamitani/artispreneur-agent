import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import {
  VAULT_CATEGORIES,
  ingestFile,
  listVaultFiles,
  type VaultCategory,
} from "@/lib/vault/ingest";
import { recordAudit } from "@/lib/rostr/reference-hub";

export const runtime = "nodejs";
export const maxDuration = 60;

const UploadBody = z.object({
  files: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        /** UTF-8 text, or base64 when `binary` is true. */
        content: z.string().max(3_000_000),
        content_type: z.string().max(120).optional(),
        binary: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(20),
  category: z.enum(VAULT_CATEGORIES).optional(),
});

/** List vault files for this workspace. */
export async function GET(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const raw = url.searchParams.get("category");
  const category = VAULT_CATEGORIES.includes(raw as VaultCategory)
    ? (raw as VaultCategory)
    : undefined;

  const scope = agentProjectScope(session.sub, session.projectId);
  const files = await listVaultFiles(scope, category);

  return NextResponse.json({
    ok: true,
    workspace_path: session.workspacePath,
    categories: VAULT_CATEGORIES,
    files,
    counts: { total: files.length, indexed: files.filter((f) => f.indexed).length },
  });
}

/**
 * Drop files into the Knowledge Vault.
 *
 * Text files are indexed for retrieval so the next compile and every executor
 * run can cite them. Binary files are stored and catalogued but not indexed —
 * the agent knows they exist without pretending to read them.
 */
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UploadBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const scope = agentProjectScope(session.sub, session.projectId);
  const category: VaultCategory = parsed.data.category ?? "approved-reference-material";

  const stored = [];
  const failed = [];
  for (const file of parsed.data.files) {
    try {
      stored.push(
        await ingestFile({
          scope,
          name: file.name,
          content: file.content,
          category,
          contentType: file.content_type,
          binary: file.binary,
        }),
      );
    } catch (e) {
      failed.push({ name: file.name, error: (e as Error)?.message ?? "Ingest failed" });
    }
  }

  if (stored.length) {
    await recordAudit(scope, {
      event: "vault.ingest",
      actor: session.sub,
      workspace_path: session.workspacePath,
      detail: { category, files: stored.map((f) => f.name) },
    }).catch((e) => console.error("[audit]", e));
  }

  return NextResponse.json(
    { ok: failed.length === 0, stored, failed },
    { status: stored.length ? 200 : 422 },
  );
}
