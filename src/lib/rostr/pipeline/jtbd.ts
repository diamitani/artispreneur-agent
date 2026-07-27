/**
 * Stage 3 — J.T.B.D. (Jobs To Be Done)
 *
 *   - What is needed to complete this project build?
 *     (set up tech stack, create knowledge base, etc.)
 *   - What actions or results must the end product execute?
 *
 * Build jobs are scaffolding. Product jobs are what the artist actually gets.
 * Anything outbound, financial, legal, or publishing is marked
 * requires_approval here and stays marked through NPAO into the task board.
 */

import type {
  Job,
  JtbdStageOutput,
  PalStageOutput,
  RagDalStageOutput,
  UseCase,
} from "./types";

/** Product jobs per use case — what the end product must execute. */
const PRODUCT_JOBS: Record<UseCase, { job: string; rationale: string; approval: boolean }[]> = {
  release: [
    { job: "Produce a dated release timeline back-planned from the release date", rationale: "Every downstream task keys off the delivery deadline", approval: false },
    { job: "Run metadata QC across titles, credits, ISRC/UPC, and splits", rationale: "Metadata errors are the top cause of unpaid royalties", approval: false },
    { job: "Assemble the DSP delivery checklist and pitch fields", rationale: "Editorial consideration closes weeks before release", approval: false },
    { job: "Deliver the release to distribution", rationale: "Irreversible outbound action", approval: true },
  ],
  outreach: [
    { job: "Build a matched target list from the directory", rationale: "Relevance drives reply rate more than volume", approval: false },
    { job: "Draft personalized pitches per target", rationale: "Generic pitches burn the contact permanently", approval: false },
    { job: "Assemble the asset pack each outlet expects", rationale: "Incomplete pitches stall even when the music fits", approval: false },
    { job: "Send outreach and schedule follow-ups", rationale: "Outbound communication on the artist's behalf", approval: true },
  ],
  booking: [
    { job: "Research venues that fit genre, draw, and market", rationale: "Mismatched rooms waste the pitch", approval: false },
    { job: "Build a routed run rather than isolated dates", rationale: "Promoters reject unrouted one-offs", approval: false },
    { job: "Package the booking kit: EPK, tech rider, availability", rationale: "Missing riders stall otherwise-ready bookings", approval: false },
    { job: "Send booking inquiries", rationale: "Outbound communication on the artist's behalf", approval: true },
  ],
  rights: [
    { job: "Inventory catalog ownership, splits, and registrations", rationale: "Cannot act commercially without rights hygiene", approval: false },
    { job: "Generate split sheets for unregistered works", rationale: "Retroactive splits are the top dispute source", approval: false },
    { job: "Produce the PRO registration checklist", rationale: "Writer-only registration forfeits the publisher share", approval: false },
    { job: "Submit registrations to the PRO", rationale: "Legal filing on the artist's behalf", approval: true },
  ],
  finance: [
    { job: "Map revenue channels and current run rate", rationale: "Channel-level visibility shows what actually pays", approval: false },
    { job: "Draft the campaign or quarterly budget", rationale: "Spend decisions need a frame before commitments", approval: false },
    { job: "Stage royalty statements for reconciliation", rationale: "Unreconciled statements hide missing income", approval: false },
    { job: "Execute payments or transfers", rationale: "Financial action", approval: true },
  ],
  brand_epk: [
    { job: "Draft bios at 50, 100, and 250 words", rationale: "Outlets each request a different length", approval: false },
    { job: "Score asset completeness and list gaps", rationale: "Press photos are the most common blocker", approval: false },
    { job: "Assemble the EPK one-sheet", rationale: "The core artifact for press, booking, and sync", approval: false },
    { job: "Publish the EPK to a public URL", rationale: "Publishing action", approval: true },
  ],
  content: [
    { job: "Build the content calendar for the campaign window", rationale: "Cadence compounds; ad-hoc posting does not", approval: false },
    { job: "Draft hooks and short-form scripts", rationale: "Retention is decided in the first two seconds", approval: false },
    { job: "List the assets each piece requires", rationale: "Prevents shoot-day gaps", approval: false },
    { job: "Publish or schedule content", rationale: "Publishing action", approval: true },
  ],
  ops: [
    { job: "Produce the entity formation checklist for the artist's state", rationale: "Requirements and fees are state-specific", approval: false },
    { job: "Sequence EIN, banking, and registration steps", rationale: "Wrong order stalls the bank account", approval: false },
    { job: "Draft the operating document set", rationale: "Structure decisions are hard to unwind later", approval: false },
    { job: "File formation documents with the state", rationale: "Legal filing on the artist's behalf", approval: true },
  ],
};

/** Build jobs — the scaffolding the workspace needs before product jobs run. */
function buildJobs(pal: PalStageOutput, ragDal: RagDalStageOutput): Job[] {
  const jobs: Job[] = [];
  let n = 1;
  const add = (job: string, rationale: string) => {
    jobs.push({
      id: `build-${n++}`,
      job,
      category: "build",
      rationale,
      requires_approval: false,
    });
  };

  if (!ragDal.workspace_sources.some((s) => s.kind === "soul")) {
    add(
      "Compile Master Soul.md from PAL intake",
      "Every specialist reads the Soul before working; without it output is generic",
    );
  }
  add(
    `Provision the Knowledge Vault for use case "${pal.intent.use_case}"`,
    "Retrieval must be scoped and populated before agents can cite sources",
  );
  add(
    `Bind tools: ${pal.intent.tools.join(", ")}`,
    "Tool allowlisting is enforced per agent and task",
  );
  add(
    "Register the specialist roster and approval routes",
    "Routing and the approval gate are prerequisites for any drafting work",
  );
  if (pal.intent.open_questions.length) {
    add(
      "Resolve open intake questions with the artist",
      `Unanswered: ${pal.intent.open_questions.join("; ")}`,
    );
  }
  return jobs;
}

/** Run the JTBD stage. */
export function runJtbd(pal: PalStageOutput, ragDal: RagDalStageOutput): JtbdStageOutput {
  const productSpecs = PRODUCT_JOBS[pal.intent.use_case] ?? PRODUCT_JOBS.ops;
  const product_jobs: Job[] = productSpecs.map((spec, i) => ({
    id: `product-${i + 1}`,
    job: spec.job,
    category: "product",
    rationale: spec.rationale,
    requires_approval: spec.approval,
  }));

  return { build_jobs: buildJobs(pal, ragDal), product_jobs };
}
