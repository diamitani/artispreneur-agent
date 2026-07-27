/**
 * Stage 2 — RAG-DAL (Retrieval Augmented Generation · Data Access Layer)
 *
 *   - Find documentation for every tool implicated in the build
 *   - Find articles / videos / audio on the subject matter
 *     (best practices, industry trends, foundational knowledge)
 *   - Retrieve the artist's own workspace knowledge
 *
 * Tenant isolation: workspace retrieval is keyed by WorkspaceScope, so a
 * compile can only ever read the requesting artist's own vault. Curated
 * platform knowledge (tool docs, playbooks) is shared and carries no
 * artist-private data.
 */

import type { WorkspaceScope } from "@/lib/tenancy/hierarchy";
import { hubReadText } from "@/lib/hub/store";
import { searchVault } from "@/lib/vault/ingest";
import type {
  PalStageOutput,
  RagDalStageOutput,
  ResearchItem,
  ToolDoc,
  UseCase,
} from "./types";

/** Curated docs for platform tools. Shared, non-tenant knowledge. */
const TOOL_DOCS: Record<string, Omit<ToolDoc, "why">> = {
  epk_builder: {
    tool: "EPK Builder",
    purpose: "Assemble bios, one-sheets, press photos, and a shareable press kit.",
    doc_url: "https://epks.artispreneur.com",
  },
  directory_search: {
    tool: "Directory Search",
    purpose: "Query the curated blog, playlist, radio, and venue directories.",
    doc_url: "https://directory.artispreneur.com",
  },
  email_draft: {
    tool: "Outreach Drafting",
    purpose: "Draft personalized pitches and follow-ups into the approval queue.",
    doc_url: null,
  },
  release_planner: {
    tool: "Release Planner",
    purpose: "Build the 42-day release calendar, metadata QC, and DSP checklists.",
    doc_url: null,
  },
  contract_builder: {
    tool: "Contract Builder",
    purpose: "Guided split sheets and agreements with plain-language clause notes.",
    doc_url: "https://contracts.artispreneur.com",
  },
  budget_planner: {
    tool: "Budget Planner",
    purpose: "Campaign budgets, invoices, and revenue-channel tracking.",
    doc_url: null,
  },
  content_planner: {
    tool: "Content Planner",
    purpose: "Content calendars, hook scripts, and campaign asset lists.",
    doc_url: null,
  },
  knowledge_vault: {
    tool: "Knowledge Vault",
    purpose: "Permission-scoped retrieval over the artist's files and approved libraries.",
    doc_url: null,
  },
};

/** Subject-matter research keyed by use case. Curated, not scraped. */
const RESEARCH: Record<UseCase, ResearchItem[]> = {
  release: [
    { kind: "best_practice", title: "Deliver to DSPs 4–6 weeks before release date", source: "Artispreneur Academy · Music Streaming", note: "Editorial pitching windows close early; late delivery forfeits playlist consideration." },
    { kind: "foundational", title: "Release metadata: ISRC, UPC, and split registration", source: "Artispreneur Academy · Copyright Your Music", note: "Metadata errors are the top cause of unpaid royalties." },
    { kind: "industry_trend", title: "Waterfall releases keep catalog momentum", source: "Industry pattern", note: "Sequential singles rolling into an EP outperform single-drop campaigns for emerging acts." },
  ],
  outreach: [
    { kind: "best_practice", title: "Personalize the first two lines or expect no reply", source: "Artispreneur PR Email Templates", note: "Generic blasts damage sender reputation and burn the contact." },
    { kind: "foundational", title: "Blog and playlist pitching anatomy", source: "Artispreneur Directory playbook", note: "Lead with the hook, one-line context, streamable link, then assets." },
    { kind: "industry_trend", title: "Curator inboxes favor short, asset-complete pitches", source: "Industry pattern", note: "Attach nothing; link everything." },
  ],
  booking: [
    { kind: "best_practice", title: "Route geographically before pitching venues", source: "Artispreneur Academy · Booking", note: "Promoters reject one-off dates that do not fit a routed run." },
    { kind: "foundational", title: "What a venue needs: EPK, draw, tech rider, availability", source: "Artispreneur Booking playbook", note: "Missing a tech rider stalls otherwise-ready bookings." },
    { kind: "industry_trend", title: "Local support slots convert better than cold headline asks", source: "Industry pattern", note: "Build the room before asking to headline it." },
  ],
  rights: [
    { kind: "foundational", title: "Register with a PRO as both writer and publisher", source: "Artispreneur Academy · Register with a PRO", note: "Registering only as writer forfeits the publisher share." },
    { kind: "best_practice", title: "Sign split sheets in the room, before release", source: "Artispreneur Contract Library", note: "Retroactive splits are the most common source of disputes." },
    { kind: "foundational", title: "Copyright registration vs. PRO registration", source: "Artispreneur Academy · Copyright Your Music", note: "They are different systems; you need both." },
  ],
  finance: [
    { kind: "foundational", title: "Separate business banking from personal", source: "Artispreneur Academy · Incorporate Your Brand", note: "Commingled funds undermine liability protection and complicate taxes." },
    { kind: "best_practice", title: "Track revenue by channel: DSP, sync, live, merch", source: "Artispreneur Finance playbook", note: "Channel-level tracking shows which activity actually pays." },
    { kind: "industry_trend", title: "Quarterly estimated taxes for self-employed artists", source: "Industry pattern", note: "Set aside at the point of income, not at filing time." },
  ],
  brand_epk: [
    { kind: "best_practice", title: "Three bio lengths: 50, 100, and 250 words", source: "Artispreneur EPK playbook", note: "Outlets each want a different length; have all three ready." },
    { kind: "foundational", title: "What belongs in an EPK", source: "Artispreneur Academy · Brand", note: "Bio, photos, music links, press, contact, tech rider." },
    { kind: "industry_trend", title: "Press photos are the most common blocker", source: "Industry pattern", note: "High-res, recent, and rights-cleared or the pitch stalls." },
  ],
  content: [
    { kind: "best_practice", title: "Repurpose one asset into many formats", source: "Artispreneur Content playbook", note: "One session should yield a month of short-form." },
    { kind: "foundational", title: "Hook in the first two seconds", source: "Industry pattern", note: "Retention is decided before the vocal enters." },
    { kind: "industry_trend", title: "Consistency beats production value", source: "Industry pattern", note: "Cadence compounds; polish does not." },
  ],
  ops: [
    { kind: "foundational", title: "LLC vs sole proprietorship for artists", source: "Artispreneur Academy · Incorporate Your Brand", note: "Liability separation and how it interacts with band structures." },
    { kind: "best_practice", title: "Get the EIN before opening business banking", source: "Artispreneur Academy · Business Setup", note: "Banks require it; ordering the steps wrong stalls the account." },
    { kind: "industry_trend", title: "Artists as operating businesses, not hobbies", source: "Industry pattern", note: "Deduction eligibility depends on operating like a business." },
  ],
};

/** Workspace files worth pulling into build context. */
const WORKSPACE_SOURCES: { path: string; kind: string }[] = [
  { path: "00-config/master-soul.md", kind: "soul" },
  { path: "00-config/artist-profile.json", kind: "profile" },
  { path: "00-config/brand-system.md", kind: "brand" },
  { path: "00-config/active-goals.md", kind: "goals" },
];

const EXCERPT_CHARS = 600;

/** Run the RAG-DAL stage. Retrieval failures degrade to fewer sources. */
export async function runRagDal(
  pal: PalStageOutput,
  scope: WorkspaceScope,
): Promise<RagDalStageOutput> {
  const tool_docs: ToolDoc[] = pal.intent.tools
    .map((toolId) => {
      const doc = TOOL_DOCS[toolId];
      if (!doc) return null;
      return {
        ...doc,
        why: `Required for use case "${pal.intent.use_case}" in this build.`,
      };
    })
    .filter((d): d is ToolDoc => d !== null);

  const research = RESEARCH[pal.intent.use_case] ?? [];

  const workspace_sources: RagDalStageOutput["workspace_sources"] = [];
  for (const src of WORKSPACE_SOURCES) {
    const text = await hubReadText(scope, src.path).catch(() => null);
    if (!text?.trim()) continue;
    workspace_sources.push({
      path: src.path,
      kind: src.kind,
      excerpt: text.trim().slice(0, EXCERPT_CHARS),
    });
  }

  // Files the artist dropped into the vault become build context too.
  const vaultHits = await searchVault(scope, pal.intent.goal, 4).catch(() => []);
  for (const file of vaultHits) {
    workspace_sources.push({
      path: file.path,
      kind: `upload:${file.category}`,
      excerpt: (file.excerpt ?? "").slice(0, EXCERPT_CHARS),
    });
  }

  return { tool_docs, research, workspace_sources };
}
