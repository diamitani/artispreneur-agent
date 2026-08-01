/**
 * Canonical workspace tree — pure data, no runtime dependencies.
 *
 * Kept dependency-free so marketing pages can quote the folder count without
 * pulling the AWS SDK into their bundle.
 */

/**
 * Canonical workspace tree (docs/WORKSPACE_FLOW.md). Object stores have no
 * real directories, so each folder is seeded with a `.keep` marker that also
 * documents what belongs there.
 */
export const WORKSPACE_TREE: { path: string; purpose: string }[] = [
  { path: "00-config", purpose: "Soul, profile, brand system, permissions, goals" },
  { path: "01-knowledge-base/music-and-artist-assets", purpose: "Masters, stems, photos, artwork" },
  { path: "01-knowledge-base/courses-and-guides", purpose: "Academy material the agent may cite" },
  { path: "01-knowledge-base/contracts-and-templates", purpose: "Contract templates and clause libraries" },
  { path: "01-knowledge-base/outreach-directories", purpose: "Blog, playlist, radio, and venue data" },
  { path: "01-knowledge-base/approved-reference-material", purpose: "Artist-approved reference sources" },
  { path: "02-business-operations/releases", purpose: "Release plans and delivery packets" },
  { path: "02-business-operations/campaigns", purpose: "Campaign briefs and calendars" },
  { path: "02-business-operations/pr-and-media", purpose: "Press targets, pitches, coverage" },
  { path: "02-business-operations/booking", purpose: "Venues, routing, inquiries" },
  { path: "02-business-operations/finance", purpose: "Budgets, invoices, statements" },
  { path: "02-business-operations/legal-and-rights", purpose: "Splits, registrations, agreements" },
  { path: "03-agent-workflows", purpose: "NPAO plans and ROSTR compiles" },
  { path: "04-deliverables/drafts-awaiting-approval", purpose: "Agent output pending artist approval" },
  { path: "04-deliverables/approved", purpose: "Artist-approved deliverables" },
  { path: "04-deliverables/sent-or-published", purpose: "Executed actions, immutable record" },
  { path: "05-agent-memory", purpose: "Decisions, preferences, performance history" },
];

/** Number of folders a provisioned workspace contains. */
export const WORKSPACE_FOLDER_COUNT = WORKSPACE_TREE.length;
