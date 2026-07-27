/**
 * Stage 4 — N.P.A.O.
 *
 *   - Prioritize the jobs to be done
 *   - Emit step-by-step instructions: what to do first, and how
 *
 * Ordering rule: build jobs before product jobs (scaffolding first), and
 * within each group, non-approval work before approval-gated work — so the
 * artist is never asked to approve something whose inputs are not ready.
 *
 * NPAO letters:
 *   N — Necessary   (blocking foundation)
 *   A — Approval    (human gate before impact)
 *   P — Production  (the actual deliverable work)
 *   O — Optimize    (follow-up, measurement, iteration)
 */

import type {
  BuildPhase,
  BuildStep,
  Job,
  JtbdStageOutput,
  NpaoLetter,
  NpaoStageOutput,
  PalStageOutput,
  WorkspaceContext,
} from "./types";

function letterFor(job: Job): NpaoLetter {
  if (job.requires_approval) return "A";
  if (job.category === "build") return "N";
  return "P";
}

function phaseFor(job: Job, index: number): BuildPhase {
  if (job.category === "build") return index === 0 ? "PreD" : "Design";
  if (job.requires_approval) return "Deployment";
  return "Development";
}

/**
 * How to actually do the step. Generic scaffolding plus the job's own
 * rationale — enough for a builder or agent to start without re-deriving it.
 */
function instructionsFor(job: Job, ctx: WorkspaceContext, owner: string): string {
  const lines = [`Goal: ${job.job}.`, `Why now: ${job.rationale}.`, `Owner: ${owner}.`];

  if (job.requires_approval) {
    lines.push(
      "This step is approval-gated. Prepare the complete artifact — final content, recipient or account, and the exact action to be taken — then submit it to the approval queue.",
      `Do not execute. ${ctx.artist_name} must approve explicitly, and the approval is recorded in the audit log.`,
    );
  } else {
    lines.push(
      "Read the workspace Soul, brand rules, and active project context before drafting.",
      "Cite the workspace sources used. Where information is missing, state the assumption rather than inventing a fact.",
    );
  }
  return lines.join(" ");
}

function ownerFor(job: Job, ctx: WorkspaceContext): string {
  if (job.category === "build") return "Master Agent";
  const roster = ctx.active_specialists;
  if (!roster.length) return "Master Agent";
  // Route product work to the first specialist; the Master Agent still drafts.
  return roster[0].name;
}

/** Run the NPAO stage. */
export function runNpao(
  pal: PalStageOutput,
  jtbd: JtbdStageOutput,
  ctx: WorkspaceContext,
): NpaoStageOutput {
  // Scaffolding first, then deliverable work, then the approval gates.
  const ordered: Job[] = [
    ...jtbd.build_jobs,
    ...jtbd.product_jobs.filter((j) => !j.requires_approval),
    ...jtbd.product_jobs.filter((j) => j.requires_approval),
  ];

  const steps: BuildStep[] = ordered.map((job, i) => {
    const owner = ownerFor(job, ctx);
    const previous = i === 0 ? [] : [`step-${i}`];
    return {
      order: i + 1,
      id: `step-${i + 1}`,
      title: job.job,
      instructions: instructionsFor(job, ctx, owner),
      npao: letterFor(job),
      phase: phaseFor(job, i),
      owner,
      job_id: job.id,
      requires_approval: job.requires_approval,
      depends_on: previous,
    };
  });

  // Follow-up step so the plan ends in measurement rather than a send.
  steps.push({
    order: steps.length + 1,
    id: `step-${steps.length + 1}`,
    title: "Review outcomes and update artist memory",
    instructions: `Record what shipped, what was approved, and what was learned for "${pal.intent.goal}". Write the summary to the Reference Hub so the next build starts from this result.`,
    npao: "O",
    phase: "Debugging",
    owner: "Master Agent",
    job_id: "followup",
    requires_approval: false,
    depends_on: steps.length ? [`step-${steps.length}`] : [],
  });

  return {
    steps,
    critical_path: steps.filter((s) => s.npao === "N" || s.npao === "A").map((s) => s.id),
  };
}
