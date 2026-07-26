import type { Phase } from "./brand";

export type AgentId =
  | "orchestrator"
  | "rights-validator"
  | "release-orchestrator"
  | "growth-strategist"
  | "sync-researcher"
  | "partner-operations"
  | "finance-validator"
  | "booking-coordinator";

/** NPAO priority class — Necessity, Anxiety, Priority, Opportunity. */
export type NpaoClass = "N" | "A" | "P" | "O";

export type Agent = {
  id: AgentId;
  name: string;
  role: string;
  division: string;
  blurb: string;
  accent: string;
  status: "online" | "working" | "idle";
  phase: Phase;
  npao: NpaoClass;
  focus: string;
  tools: string[];
  approvalGate: string | null;
};

export const AGENTS: Agent[] = [
  {
    id: "orchestrator",
    name: "Atlas",
    role: "Operations Orchestrator",
    division: "Holding",
    blurb:
      "Compiles every request through PAL, classifies it N→A→P→O, and keeps the whole team moving in phase order.",
    accent: "#f5c100",
    status: "online",
    phase: "Development",
    npao: "N",
    focus: "Sequencing this week: 2 rights blockers before any release action",
    tools: ["PAL compile", "NPAO route", "Roadmap", "Approvals"],
    approvalGate: null,
  },
  {
    id: "rights-validator",
    name: "Rights Validator",
    role: "Catalog Rights Manager",
    division: "Publishing",
    blurb:
      "Scores every track to 100% rights completeness — splits, masters, samples, artwork, agreements — before anything ships.",
    accent: "#c0272d",
    status: "working",
    phase: "Development",
    npao: "N",
    focus: "Blocking: split conflict on “Neon Prayer” — collaborator claim mismatch",
    tools: ["Split sheets", "Clearance check", "ISRC/UPC", "Audit log"],
    approvalGate: "Rights owner sign-off",
  },
  {
    id: "release-orchestrator",
    name: "Release Orchestrator",
    role: "Release Operations Manager",
    division: "Distribution",
    blurb:
      "Turns rights-complete tracks into coordinated DSP releases with metadata QC and a 42-day calendar.",
    accent: "#e8c97a",
    status: "online",
    phase: "Deployment",
    npao: "P",
    focus: "“Midnight Circuit” scheduled — 42 days out, metadata locked for pitch",
    tools: ["Release calendar", "Metadata QC", "DSP delivery", "Pre-save"],
    approvalGate: "Founder approves delivery",
  },
  {
    id: "growth-strategist",
    name: "Growth Strategist",
    role: "Growth Campaign Manager",
    division: "Creative",
    blurb:
      "Builds the 42-day campaign — story, hooks, playlist pitch, creator briefs — without promising placements.",
    accent: "#d4a017",
    status: "online",
    phase: "Development",
    npao: "P",
    focus: "Drafting Spotify pitch fields + 9 short-form hooks for “Midnight Circuit”",
    tools: ["Campaign brief", "Playlist pitch", "Content matrix", "UGC brief"],
    approvalGate: null,
  },
  {
    id: "sync-researcher",
    name: "Sync Researcher",
    role: "Licensing Manager",
    division: "Publishing",
    blurb:
      "Makes the catalog searchable by mood/tempo/clearance and turns inbound briefs into approval-ready quotes.",
    accent: "#4fb6e8",
    status: "idle",
    phase: "Development",
    npao: "P",
    focus: "New brief: 30s trailer, North America — pricing from approved rate card",
    tools: ["Sync catalog", "Brief intake", "Rate card", "Quote draft"],
    approvalGate: "Licensing admin approves terms",
  },
  {
    id: "partner-operations",
    name: "Partner Operations",
    role: "Artist Partnership Manager",
    division: "Records",
    blurb:
      "Structures sub-artist and producer deals with explicit splits, recoupment, and reporting — flagged for attorney review.",
    accent: "#8b7ff5",
    status: "idle",
    phase: "Design",
    npao: "A",
    focus: "Scorecard drafted for producer collab — deal terms pending finance policy",
    tools: ["Partner scorecard", "Deal modules", "Recoupment", "Decision memo"],
    approvalGate: "Attorney + founder review",
  },
  {
    id: "finance-validator",
    name: "Finance Validator",
    role: "Royalty Analyst",
    division: "Holding",
    blurb:
      "Imports statements to staging, reconciles to track/work/territory, and drafts transparent partner statements.",
    accent: "#4fd18b",
    status: "working",
    phase: "Development",
    npao: "P",
    focus: "Reconciling Q2 distributor statement — 3 unmatched rows in exception queue",
    tools: ["Staging ledger", "Reconciliation", "Exceptions", "Statements"],
    approvalGate: "Founder approves payouts",
  },
  {
    id: "booking-coordinator",
    name: "Booking Coordinator",
    role: "DJ Booking Manager",
    division: "Management",
    blurb:
      "Converts demand into paid performances with EPK, tech rider, availability, and inquiry tracking.",
    accent: "#e8734f",
    status: "online",
    phase: "Deployment",
    npao: "P",
    focus: "3 warm leads need follow-up before Friday — Riverview + 2 sister venues",
    tools: ["EPK", "Tech rider", "Availability", "Inquiry pipeline"],
    approvalGate: null,
  },
];

export function getAgent(id: AgentId) {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[0];
}
