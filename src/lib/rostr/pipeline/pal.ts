/**
 * Stage 1 — PAL (Prompt Abstraction Layer)
 *
 *   - Compiles prompt data: text, links, documents
 *   - Extracts intent: goal, tools, use case
 *   - Drafts enhanced Build Prompts (Internal System Instruction Architect)
 *
 * Deterministic by design: the same request against the same workspace
 * compiles to the same manifest, so a build is reproducible and auditable.
 */

import type {
  BuildPrompt,
  CompileRequest,
  PalStageOutput,
  UseCase,
  WorkspaceContext,
} from "./types";

/** Keyword → use case. First match wins, so order encodes precedence. */
const USE_CASE_RULES: { use_case: UseCase; terms: string[] }[] = [
  { use_case: "release", terms: ["release", "single", "album", "ep ", "drop", "distribut", "dsp", "spotify"] },
  { use_case: "outreach", terms: ["blog", "press", "pitch", "playlist", "radio", "pr ", "media", "outreach"] },
  { use_case: "booking", terms: ["book", "venue", "tour", "show", "gig", "perform"] },
  { use_case: "rights", terms: ["split", "publish", "pro ", "ascap", "bmi", "copyright", "royalt", "isrc"] },
  { use_case: "finance", terms: ["budget", "invoice", "tax", "revenue", "money", "finance", "payout"] },
  { use_case: "brand_epk", terms: ["epk", "press kit", "bio", "brand", "one-sheet", "identity"] },
  { use_case: "content", terms: ["content", "social", "tiktok", "instagram", "reel", "video", "post"] },
  { use_case: "ops", terms: ["llc", "entity", "business setup", "incorporat", "ein", "bank"] },
];

/** Tools the platform can bring to bear, matched from the request. */
const TOOL_RULES: { tool: string; terms: string[] }[] = [
  { tool: "epk_builder", terms: ["epk", "press kit", "one-sheet", "bio"] },
  { tool: "directory_search", terms: ["blog", "playlist", "venue", "radio", "contact", "outreach", "press"] },
  { tool: "email_draft", terms: ["pitch", "email", "outreach", "follow up", "follow-up"] },
  { tool: "release_planner", terms: ["release", "calendar", "timeline", "distribut", "metadata"] },
  { tool: "contract_builder", terms: ["contract", "split", "agreement", "deal", "sign"] },
  { tool: "budget_planner", terms: ["budget", "invoice", "tax", "revenue", "finance"] },
  { tool: "content_planner", terms: ["content", "social", "post", "reel", "video"] },
  { tool: "knowledge_vault", terms: ["file", "upload", "document", "catalog", "asset"] },
];

/** Actions that can never run without a named human approval. */
const APPROVAL_TERMS = ["send", "publish", "post", "pay", "sign", "submit", "file ", "email"];

function lower(s: string) {
  return s.toLowerCase();
}

function detectUseCase(text: string): UseCase {
  const t = lower(text);
  for (const rule of USE_CASE_RULES) {
    if (rule.terms.some((term) => t.includes(term))) return rule.use_case;
  }
  return "ops";
}

function detectTools(text: string): string[] {
  const t = lower(text);
  const tools = TOOL_RULES.filter((r) => r.terms.some((term) => t.includes(term))).map(
    (r) => r.tool,
  );
  // Every build reads workspace context, so the vault is always in play.
  if (!tools.includes("knowledge_vault")) tools.push("knowledge_vault");
  return tools;
}

function detectConstraints(text: string, ctx: WorkspaceContext): string[] {
  const t = lower(text);
  const constraints = [
    `Approval policy: ${ctx.approval_policy}`,
    "Never invent ownership, splits, or clearances",
  ];
  if (APPROVAL_TERMS.some((term) => t.includes(term))) {
    constraints.push(
      "Request implies an outbound or consequential action — draft only, route to the approval queue",
    );
  }
  return constraints;
}

/**
 * Questions worth asking before building. Kept short on purpose: PAL should
 * only interrupt when a missing answer materially changes the result.
 */
function openQuestions(request: CompileRequest, useCase: UseCase): string[] {
  const t = lower(request.prompt);
  const q: string[] = [];
  const hasDate = /\b(january|february|march|april|may|june|july|august|september|october|november|december|\d{4}-\d{2}-\d{2}|next (week|month|quarter)|\d+\s*(day|week|month))/i.test(
    request.prompt,
  );
  if ((useCase === "release" || useCase === "outreach") && !hasDate) {
    q.push("What is the target date or window for this?");
  }
  if (useCase === "booking" && !/\b(city|near|in )\b/.test(t)) {
    q.push("Which markets or cities should this target?");
  }
  if (useCase === "finance" && !/\$|\bbudget\b/.test(t)) {
    q.push("What budget range are we working inside?");
  }
  return q;
}

function ambiguityScore(request: CompileRequest, questions: string[]): number {
  const words = request.prompt.trim().split(/\s+/).filter(Boolean).length;
  let score = questions.length * 0.15;
  if (words < 6) score += 0.3;
  else if (words < 15) score += 0.12;
  if (!request.links?.length && !request.documents?.length) score += 0.05;
  return Number(Math.min(1, score).toFixed(2));
}

/**
 * Draft the enhanced prompt — PAL's "Internal System Instruction Architect"
 * job. This is the prompt a downstream agent actually receives, with the
 * artist's context folded in so nothing starts from zero.
 */
function buildEnhancedPrompt(
  request: CompileRequest,
  ctx: WorkspaceContext,
  useCase: UseCase,
  tools: string[],
  constraints: string[],
): string {
  const specialists = ctx.active_specialists.map((s) => `${s.name} (${s.role})`).join(", ");
  return [
    `# Build request — ${ctx.artist_name}`,
    "",
    `**Original request:** ${request.prompt.trim()}`,
    "",
    "## Artist context",
    `- Artist: ${ctx.artist_name}`,
    `- Genres: ${ctx.genres.join(", ") || "unspecified"}`,
    `- Career stage: ${ctx.career_stage}`,
    `- 90-day goal: ${ctx.goal_90d}`,
    `- Workspace mode: ${ctx.mode}`,
    "",
    "## Compiled intent",
    `- Use case: ${useCase}`,
    `- Tools in scope: ${tools.join(", ")}`,
    `- Specialists available: ${specialists || "Master Agent only"}`,
    "",
    "## Constraints",
    ...constraints.map((c) => `- ${c}`),
    "",
    "## Output contract",
    "Return: summary, deliverables, sources used, assumptions, suggested next actions.",
    "External communication and high-impact actions must be returned as drafts for approval.",
  ].join("\n");
}

/**
 * Build prompts, one per build-package slice. These are the "Build Prompts"
 * the AWS Backend Infrastructure spec expects PAL to emit: skills,
 * functions/tools, system instructions, misc.
 */
function draftBuildPrompts(
  ctx: WorkspaceContext,
  useCase: UseCase,
  tools: string[],
  goal: string,
): BuildPrompt[] {
  const primary = ctx.active_specialists[0]?.name ?? "Master Agent";
  return [
    {
      id: "bp-skills",
      target: "skills",
      title: "Skill packs for this build",
      prompt: `Specify the skill packs ${ctx.artist_name} needs to accomplish: ${goal}. For each skill give a name, when it triggers, the step-by-step runtime protocol, and the artifact it produces. Use case: ${useCase}.`,
      assigned_to: primary,
    },
    {
      id: "bp-functions",
      target: "functions_tools",
      title: "Functions and tool bindings",
      prompt: `Define the callable functions and tool bindings required for: ${goal}. Tools in scope: ${tools.join(", ")}. For each, give the name, input schema, output schema, and whether it is approval-gated.`,
      assigned_to: primary,
    },
    {
      id: "bp-system",
      target: "system_instructions",
      title: "System instructions for the artist agent",
      prompt: `Write the system instructions for ${ctx.artist_name}'s agent working on: ${goal}. Fold in brand voice, approval policy (${ctx.approval_policy}), and the active specialist roster. The agent drafts; the artist approves.`,
      assigned_to: "Master Agent",
    },
    {
      id: "bp-misc",
      target: "misc",
      title: "Supporting assets and checks",
      prompt: `List supporting assets, QA checks, and failure modes for: ${goal}. Include what must exist in the Knowledge Vault before this build can run.`,
      assigned_to: primary,
    },
  ];
}

/** Run the PAL stage. */
export function runPal(request: CompileRequest, ctx: WorkspaceContext): PalStageOutput {
  const links = (request.links ?? []).filter((l) => /^https?:\/\//i.test(l));
  const documents = request.documents ?? [];
  const corpus = [
    request.prompt,
    ...links,
    ...documents.map((d) => `${d.name}\n${d.text}`),
  ].join("\n");

  const useCase = detectUseCase(corpus);
  const tools = detectTools(corpus);
  const constraints = detectConstraints(corpus, ctx);
  const questions = openQuestions(request, useCase);
  const goal = request.prompt.trim();

  return {
    compiled_input: {
      text: request.prompt.trim(),
      links,
      documents: documents.map((d) => ({ name: d.name, chars: d.text.length })),
      total_chars: corpus.length,
    },
    intent: {
      goal,
      use_case: useCase,
      tools,
      subject: ctx.artist_name,
      constraints,
      ambiguity_score: ambiguityScore(request, questions),
      open_questions: questions,
    },
    enhanced_prompt: buildEnhancedPrompt(request, ctx, useCase, tools, constraints),
    build_prompts: draftBuildPrompts(ctx, useCase, tools, goal),
  };
}
