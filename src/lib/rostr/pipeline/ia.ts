/**
 * Stage 5 — I.A. (Information Architect)
 *
 *   Create Master Build Instructions:
 *   updated master system instructions assembled from every prior stage.
 *
 * This is the stage that turns analysis into something a builder — human or
 * agent — can execute directly.
 */

import type {
  ArchitectureSpec,
  IaStageOutput,
  JtbdStageOutput,
  NpaoStageOutput,
  PalStageOutput,
  RagDalStageOutput,
  WorkspaceContext,
} from "./types";

function designArchitecture(
  pal: PalStageOutput,
  ragDal: RagDalStageOutput,
  ctx: WorkspaceContext,
): ArchitectureSpec {
  return {
    surfaces: ["Mission Control", "Agent Chat", "Approval Queue", "Knowledge Vault"],
    data_stores: [
      "Rostr Hub (S3 or local fs) — files and artifacts",
      "DynamoDB USER# control plane — projects, agents, keys, usage",
      "AgentCore Memory — durable per-artist memory",
    ],
    agents: ["Hermes Master Agent", ...ctx.active_specialists.map((s) => s.name)],
    tools: ragDal.tool_docs.map((d) => d.tool),
    integrations: pal.intent.tools.includes("directory_search")
      ? ["Artispreneur Directory", "Approval Queue"]
      : ["Approval Queue"],
  };
}

function masterBuildInstructions(
  pal: PalStageOutput,
  ragDal: RagDalStageOutput,
  jtbd: JtbdStageOutput,
  npao: NpaoStageOutput,
  arch: ArchitectureSpec,
  ctx: WorkspaceContext,
): string {
  const approvalSteps = npao.steps.filter((s) => s.requires_approval);

  return `# Master Build Instructions — ${ctx.artist_name}

> Compiled by ROSTR · PAL → RAG-DAL → JTBD → NPAO → I.A.
> Use case: **${pal.intent.use_case}** · Approval policy: **${ctx.approval_policy}**

## 1. Objective

${pal.intent.goal}

**Subject:** ${ctx.artist_name} (${ctx.genres.join(", ") || "genre unspecified"}, ${ctx.career_stage})
**90-day goal:** ${ctx.goal_90d}

## 2. Constraints

${pal.intent.constraints.map((c) => `- ${c}`).join("\n")}

${
  pal.intent.open_questions.length
    ? `## 3. Open questions (resolve before building)\n\n${pal.intent.open_questions.map((q) => `- ${q}`).join("\n")}\n`
    : "## 3. Open questions\n\nNone — intent is unambiguous.\n"
}
## 4. Architecture

- **Surfaces:** ${arch.surfaces.join(", ")}
- **Agents:** ${arch.agents.join(", ")}
- **Tools:** ${arch.tools.join(", ") || "none bound"}
- **Data stores:**
${arch.data_stores.map((d) => `  - ${d}`).join("\n")}
- **Integrations:** ${arch.integrations.join(", ")}

## 5. Jobs to be done

### Build jobs (scaffolding)
${jtbd.build_jobs.map((j) => `- **${j.job}** — ${j.rationale}`).join("\n")}

### Product jobs (what the artist gets)
${jtbd.product_jobs.map((j) => `- **${j.job}**${j.requires_approval ? " *(approval-gated)*" : ""} — ${j.rationale}`).join("\n")}

## 6. Build steps (NPAO order)

${npao.steps
  .map(
    (s) =>
      `### ${s.order}. ${s.title}\n\n- **NPAO:** ${s.npao} · **Phase:** ${s.phase} · **Owner:** ${s.owner}\n- **Approval required:** ${s.requires_approval ? "yes" : "no"}\n\n${s.instructions}`,
  )
  .join("\n\n")}

## 7. Approval gates

${
  approvalSteps.length
    ? approvalSteps
        .map((s) => `- **${s.title}** — draft only; ${ctx.artist_name} approves before execution.`)
        .join("\n")
    : "- No consequential external actions in this build."
}

## 8. Knowledge and references

### Tool documentation
${ragDal.tool_docs.map((d) => `- **${d.tool}** — ${d.purpose}${d.doc_url ? ` (${d.doc_url})` : ""}`).join("\n") || "- None bound"}

### Subject matter
${ragDal.research.map((r) => `- *${r.kind.replace(/_/g, " ")}* — **${r.title}** (${r.source}): ${r.note}`).join("\n") || "- None"}

### Workspace sources used
${ragDal.workspace_sources.map((s) => `- \`${s.path}\` (${s.kind})`).join("\n") || "- None — workspace not yet provisioned"}

---

*Recompile via \`POST /api/rostr/compile\` when the request or workspace context changes.*
`;
}

function masterSystemInstructions(
  pal: PalStageOutput,
  npao: NpaoStageOutput,
  ctx: WorkspaceContext,
): string {
  const approvalTitles = npao.steps
    .filter((s) => s.requires_approval)
    .map((s) => s.title);

  return `# System Instructions — ${ctx.artist_name}'s Agent

You are the Artispreneur Master Agent working for **${ctx.artist_name}**.

## Current build

${pal.intent.goal}

Use case: ${pal.intent.use_case}. Tools in scope: ${pal.intent.tools.join(", ")}.

## Context you always load first

1. Master Soul.md — identity, voice, boundaries
2. Artist profile and active goals
3. This build's step plan and its current state
4. Relevant Knowledge Vault sources (cite what you use)

## Specialist roster

${ctx.active_specialists.map((s) => `- **${s.name}** — ${s.role}`).join("\n") || "- Master Agent only"}

Route domain work to the right specialist. You remain the manager who drafts and reports.

## Operating rules

- Approval policy is **${ctx.approval_policy}**. Research, plan, draft, and organize freely.
- Never send, publish, spend, sign, or file without explicit approval from ${ctx.artist_name}.
${approvalTitles.length ? `- These steps are approval-gated: ${approvalTitles.join("; ")}.` : ""}
- Never invent ownership, splits, clearances, or outcomes.
- Label legal and tax content as educational and name when a professional is needed.
- Return: summary, deliverables, sources used, assumptions, suggested next actions.
- Speak to ${ctx.artist_name} as a capable entrepreneur. No hype.

${ctx.soul_excerpt ? `## Soul excerpt\n\n${ctx.soul_excerpt}` : ""}
`;
}

/** Run the I.A. stage. */
export function runIa(
  pal: PalStageOutput,
  ragDal: RagDalStageOutput,
  jtbd: JtbdStageOutput,
  npao: NpaoStageOutput,
  ctx: WorkspaceContext,
): IaStageOutput {
  const architecture = designArchitecture(pal, ragDal, ctx);
  return {
    architecture,
    master_build_instructions: masterBuildInstructions(
      pal,
      ragDal,
      jtbd,
      npao,
      architecture,
      ctx,
    ),
    master_system_instructions: masterSystemInstructions(pal, npao, ctx),
  };
}
