/**
 * ROSTR compile pipeline — shared types.
 *
 * Stages: PAL → RAG-DAL → JTBD → NPAO → I.A.
 * Ingress: User Prompt → Webhook → Compilation → Extraction → Enhancement
 *
 * The pipeline turns a plain-language build request into Master Build
 * Instructions plus a build package (PRD, Soul.md, Tool Scripts, Build
 * Prompts) that UserOps can provision against.
 */

import type { SpecialistId } from "@/lib/rostr/specialists";

/** Raw request entering the pipeline (from UI or webhook). */
export type CompileRequest = {
  /** Plain-language build request from the artist. */
  prompt: string;
  /** Reference links the artist attached. */
  links?: string[];
  /** Pasted or uploaded document text. */
  documents?: { name: string; text: string }[];
  /** Where the request came from. */
  source?: "ui" | "webhook" | "api";
};

/** Workspace context the pipeline compiles against (from PAL intake). */
export type WorkspaceContext = {
  artist_name: string;
  genres: string[];
  career_stage: string;
  mode: string;
  approval_policy: string;
  active_specialists: { id: SpecialistId; name: string; role: string }[];
  goal_90d: string;
  soul_excerpt: string | null;
};

// ---------------------------------------------------------------------------
// Stage 1 — PAL (Prompt Abstraction Layer)
// ---------------------------------------------------------------------------

export type UseCase =
  | "release"
  | "brand_epk"
  | "outreach"
  | "booking"
  | "rights"
  | "finance"
  | "content"
  | "ops";

/** A build prompt PAL drafts for a downstream builder or agent. */
export type BuildPrompt = {
  id: string;
  /** Which slice of the build package this prompt produces. */
  target: "skills" | "functions_tools" | "system_instructions" | "misc";
  title: string;
  prompt: string;
  assigned_to: string;
};

export type PalStageOutput = {
  compiled_input: {
    text: string;
    links: string[];
    documents: { name: string; chars: number }[];
    total_chars: number;
  };
  intent: {
    goal: string;
    use_case: UseCase;
    tools: string[];
    subject: string;
    constraints: string[];
    ambiguity_score: number;
    open_questions: string[];
  };
  enhanced_prompt: string;
  build_prompts: BuildPrompt[];
};

// ---------------------------------------------------------------------------
// Stage 2 — RAG-DAL (Retrieval Augmented Generation · Data Access Layer)
// ---------------------------------------------------------------------------

export type ToolDoc = {
  tool: string;
  purpose: string;
  doc_url: string | null;
  why: string;
};

export type ResearchItem = {
  kind: "best_practice" | "industry_trend" | "foundational";
  title: string;
  source: string;
  note: string;
};

export type RagDalStageOutput = {
  /** Documentation for every tool implicated in the build. */
  tool_docs: ToolDoc[];
  /** Articles / videos / audio on the subject matter. */
  research: ResearchItem[];
  /** Workspace knowledge retrieved under the artist's own scope. */
  workspace_sources: { path: string; kind: string; excerpt: string }[];
};

// ---------------------------------------------------------------------------
// Stage 3 — JTBD (Jobs To Be Done)
// ---------------------------------------------------------------------------

export type Job = {
  id: string;
  job: string;
  /** build = needed to complete the build; product = what the end product executes. */
  category: "build" | "product";
  rationale: string;
  /** Consequential jobs can never auto-execute. */
  requires_approval: boolean;
};

export type JtbdStageOutput = {
  build_jobs: Job[];
  product_jobs: Job[];
};

// ---------------------------------------------------------------------------
// Stage 4 — NPAO (prioritize + sequence)
// ---------------------------------------------------------------------------

export type NpaoLetter = "N" | "A" | "P" | "O";
export type BuildPhase = "PreD" | "Design" | "Development" | "Deployment" | "Debugging";

export type BuildStep = {
  order: number;
  id: string;
  title: string;
  /** What to do first, and how. */
  instructions: string;
  npao: NpaoLetter;
  phase: BuildPhase;
  owner: string;
  job_id: string;
  requires_approval: boolean;
  depends_on: string[];
};

export type NpaoStageOutput = {
  steps: BuildStep[];
  critical_path: string[];
};

// ---------------------------------------------------------------------------
// Stage 5 — I.A. (Information Architect → Master Build Instructions)
// ---------------------------------------------------------------------------

export type ArchitectureSpec = {
  surfaces: string[];
  data_stores: string[];
  agents: string[];
  tools: string[];
  integrations: string[];
};

export type IaStageOutput = {
  architecture: ArchitectureSpec;
  /** Markdown handed to a builder (human or agent). */
  master_build_instructions: string;
  /** Updated system instructions for the artist's agent. */
  master_system_instructions: string;
};

// ---------------------------------------------------------------------------
// Build package (AWS Backend Infrastructure spec, step 3)
// ---------------------------------------------------------------------------

export type ToolScript = {
  name: string;
  kind: "mcp" | "function" | "skill" | "sub_agent";
  description: string;
  spec: Record<string, unknown>;
};

export type BuildPackage = {
  prd: string;
  soul_md: string;
  tool_scripts: ToolScript[];
  build_prompts: BuildPrompt[];
};

// ---------------------------------------------------------------------------
// Full compile result
// ---------------------------------------------------------------------------

export type RostrCompilation = {
  compile_id: string;
  compiled_at: string;
  source: "ui" | "webhook" | "api";
  workspace_path: string;
  request: CompileRequest;
  pal: PalStageOutput;
  rag_dal: RagDalStageOutput;
  jtbd: JtbdStageOutput;
  npao: NpaoStageOutput;
  ia: IaStageOutput;
  build_package: BuildPackage;
  artifacts: { path: string; kind: string; summary: string }[];
};
