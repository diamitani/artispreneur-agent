import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { agentProjectScope } from "@/lib/tenancy/hierarchy";
import { hubReadJson } from "@/lib/hub/store";
import { compileRostr } from "@/lib/rostr/pipeline";
import { seedBoard } from "@/lib/rostr/task-board";
import { recordAudit } from "@/lib/rostr/reference-hub";

export const runtime = "nodejs";
export const maxDuration = 60;

const CompileBody = z.object({
  prompt: z.string().min(1, "prompt is required").max(8000),
  links: z.array(z.string().url()).max(25).optional(),
  documents: z
    .array(z.object({ name: z.string().max(200), text: z.string().max(50_000) }))
    .max(10)
    .optional(),
  source: z.enum(["ui", "webhook", "api"]).optional(),
  /** Set false to preview a compile without writing artifacts. */
  persist: z.boolean().optional(),
  /** Set false to compile without replacing the current task board. */
  seedBoard: z.boolean().optional(),
});

/**
 * Run the ROSTR compile pipeline: PAL → RAG-DAL → JTBD → NPAO → I.A.
 * Outputs Master Build Instructions plus the build package (PRD, Soul.md,
 * Tool Scripts, Build Prompts), and seeds the task board from the NPAO plan.
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

  const parsed = CompileBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Scope is derived from the session, never from the request body.
  const scope = agentProjectScope(session.sub, session.projectId);
  const persist = parsed.data.persist !== false;

  const compilation = await compileRostr({
    request: {
      prompt: parsed.data.prompt,
      links: parsed.data.links,
      documents: parsed.data.documents,
      source: parsed.data.source ?? "ui",
    },
    scope,
    persist,
  });

  let board = null;
  if (persist && parsed.data.seedBoard !== false) {
    board = await seedBoard({
      scope,
      compileId: compilation.compile_id,
      npao: compilation.npao,
    });
    await recordAudit(scope, {
      event: "rostr.compiled",
      actor: session.sub,
      workspace_path: session.workspacePath,
      detail: {
        compile_id: compilation.compile_id,
        use_case: compilation.pal.intent.use_case,
        steps: compilation.npao.steps.length,
      },
    }).catch((e) => console.error("[audit]", e));
  }

  return NextResponse.json({
    ok: true,
    compile_id: compilation.compile_id,
    workspace_path: compilation.workspace_path,
    persisted: persist,
    intent: compilation.pal.intent,
    stages: {
      pal: {
        enhanced_prompt: compilation.pal.enhanced_prompt,
        build_prompts: compilation.pal.build_prompts.length,
      },
      rag_dal: {
        tool_docs: compilation.rag_dal.tool_docs.length,
        research: compilation.rag_dal.research.length,
        workspace_sources: compilation.rag_dal.workspace_sources.map((s) => s.path),
      },
      jtbd: {
        build_jobs: compilation.jtbd.build_jobs.length,
        product_jobs: compilation.jtbd.product_jobs.length,
      },
      npao: {
        steps: compilation.npao.steps.length,
        critical_path: compilation.npao.critical_path,
      },
      ia: { architecture: compilation.ia.architecture },
    },
    build_package: {
      prd_chars: compilation.build_package.prd.length,
      soul_chars: compilation.build_package.soul_md.length,
      tool_scripts: compilation.build_package.tool_scripts.map((t) => ({
        name: t.name,
        kind: t.kind,
      })),
      build_prompts: compilation.build_package.build_prompts.map((p) => ({
        id: p.id,
        target: p.target,
      })),
    },
    artifacts: compilation.artifacts,
    task_board: board ? { compile_id: board.compile_id, tasks: board.tasks.length } : null,
  });
}

/** Pointer to the most recent compile for this workspace. */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scope = agentProjectScope(session.sub, session.projectId);
  const latest = await hubReadJson<{
    compile_id: string;
    compiled_at: string;
    goal: string;
    use_case: string;
    steps: number;
    base_path: string;
  }>(scope, "03-agent-workflows/latest-compile.json").catch(() => null);

  return NextResponse.json({ ok: true, latest });
}
