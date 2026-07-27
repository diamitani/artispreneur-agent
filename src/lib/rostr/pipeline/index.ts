/**
 * ROSTR compile pipeline — orchestrator.
 *
 *   User Prompt → Webhook → Compilation → Extraction → Enhancement
 *   PAL → RAG-DAL → JTBD → NPAO → I.A.
 *
 * Every compile is persisted under the artist's workspace so a build is
 * reproducible and auditable, and so UserOps can provision against it.
 */

import { createHash, randomUUID } from "crypto";
import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { workspaceLogicalPath } from "@/lib/tenancy/hierarchy";
import { hubReadText, hubWriteJson, hubWriteText } from "@/lib/hub/store";
import { getIntake, loadIntakeFromDisk } from "@/lib/rostr/intake-store";
import type { SpecialistId } from "@/lib/rostr/specialists";
import { runPal } from "./pal";
import { runRagDal } from "./rag-dal";
import { runJtbd } from "./jtbd";
import { runNpao } from "./npao";
import { runIa } from "./ia";
import { buildPackage } from "./build-package";
import type { CompileRequest, RostrCompilation, WorkspaceContext } from "./types";

const SOUL_EXCERPT_CHARS = 1200;

/**
 * Assemble the workspace context every stage compiles against.
 * Reads only from the caller's own scope — never cross-tenant.
 */
export async function loadWorkspaceContext(
  scope: WorkspaceScope,
): Promise<WorkspaceContext> {
  const pal =
    getIntake(scope.projectId) ||
    getIntake(scope.userId) ||
    (await loadIntakeFromDisk(scope.userId, scope.projectId));

  const soul = await hubReadText(scope, "00-config/master-soul.md").catch(() => null);
  const profile = (pal?.workspace_config?.artist_profile ?? {}) as {
    stage_name?: string;
    genres?: string[];
    career_stage?: string;
  };
  const goals = (pal?.workspace_config?.goals ?? {}) as {
    success_metric?: string;
    primary_90d?: string;
  };

  return {
    artist_name: profile.stage_name || "Artist",
    genres: profile.genres ?? [],
    career_stage: profile.career_stage || "emerging",
    mode: pal?.workspace_config?.mode || "artist",
    approval_policy: pal?.workspace_config?.permissions?.default_mode || "approval_required",
    active_specialists: (pal?.workspace_config?.roster?.active ?? []).map((s) => ({
      id: s.id as SpecialistId,
      name: s.name,
      role: s.role,
    })),
    goal_90d: goals.success_metric || goals.primary_90d || "Not yet set",
    soul_excerpt: soul ? soul.trim().slice(0, SOUL_EXCERPT_CHARS) : null,
  };
}

/** Stable id for a compile, so repeat requests are traceable. */
function compileId(request: CompileRequest, scope: WorkspaceScope): string {
  const digest = createHash("sha256")
    .update(`${workspaceLogicalPath(scope)}::${request.prompt.trim()}`)
    .digest("hex")
    .slice(0, 8);
  return `cmp_${digest}_${randomUUID().slice(0, 8)}`;
}

/**
 * Run the full ROSTR compile and persist its artifacts.
 * Returns the compilation regardless of whether persistence succeeded —
 * a hub write failure must not lose the compile result.
 */
export async function compileRostr(input: {
  request: CompileRequest;
  scope: WorkspaceScope;
  /** Skip hub writes (useful for previews and tests). */
  persist?: boolean;
}): Promise<RostrCompilation> {
  const { request, scope } = input;
  const persist = input.persist !== false;

  const ctx = await loadWorkspaceContext(scope);

  // Stage 1–5
  const pal = runPal(request, ctx);
  const ragDal = await runRagDal(pal, scope);
  const jtbd = runJtbd(pal, ragDal);
  const npao = runNpao(pal, jtbd, ctx);
  const ia = runIa(pal, ragDal, jtbd, npao, ctx);

  const existingSoul = ragDal.workspace_sources.find((s) => s.kind === "soul");
  const pkg = buildPackage({
    pal,
    ragDal,
    jtbd,
    npao,
    ia,
    ctx,
    soulMd: existingSoul ? await hubReadText(scope, "00-config/master-soul.md") : null,
  });

  const id = compileId(request, scope);
  const base = `03-agent-workflows/compiles/${id}`;
  const artifacts: RostrCompilation["artifacts"] = [
    { path: `${base}/compilation.json`, kind: "compilation", summary: "Full 5-stage ROSTR output" },
    { path: `${base}/master-build-instructions.md`, kind: "instructions", summary: `${npao.steps.length} build steps` },
    { path: `${base}/prd.md`, kind: "prd", summary: `PRD for ${pal.intent.use_case}` },
    { path: `${base}/tool-scripts.json`, kind: "tool_scripts", summary: `${pkg.tool_scripts.length} tool scripts` },
    { path: `${base}/build-prompts.json`, kind: "build_prompts", summary: `${pkg.build_prompts.length} build prompts` },
    { path: `${base}/system-instructions.md`, kind: "system_instructions", summary: "Master system instructions" },
  ];

  const compilation: RostrCompilation = {
    compile_id: id,
    compiled_at: new Date().toISOString(),
    source: request.source ?? "ui",
    workspace_path: workspaceLogicalPath(scope),
    request,
    pal,
    rag_dal: ragDal,
    jtbd,
    npao,
    ia,
    build_package: pkg,
    artifacts,
  };

  if (persist) {
    await Promise.all([
      hubWriteJson(scope, `${base}/compilation.json`, compilation),
      hubWriteText(scope, `${base}/master-build-instructions.md`, ia.master_build_instructions),
      hubWriteText(scope, `${base}/prd.md`, pkg.prd),
      hubWriteJson(scope, `${base}/tool-scripts.json`, pkg.tool_scripts),
      hubWriteJson(scope, `${base}/build-prompts.json`, pkg.build_prompts),
      hubWriteText(scope, `${base}/system-instructions.md`, ia.master_system_instructions),
      hubWriteJson(scope, "03-agent-workflows/latest-compile.json", {
        compile_id: id,
        compiled_at: compilation.compiled_at,
        goal: pal.intent.goal,
        use_case: pal.intent.use_case,
        steps: npao.steps.length,
        base_path: base,
      }),
    ]).catch((e) => console.error("[rostr:compile:persist]", e));
  }

  return compilation;
}

export { runPal } from "./pal";
export { runRagDal } from "./rag-dal";
export { runJtbd } from "./jtbd";
export { runNpao } from "./npao";
export { runIa } from "./ia";
export { buildPackage } from "./build-package";
export type * from "./types";
