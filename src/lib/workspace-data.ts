import type { Phase } from "./brand";
import type { AgentId, NpaoClass } from "./agents";

export type ViewId =
  | "briefing"
  | "team"
  | "catalog"
  | "releases"
  | "licensing"
  | "royalties"
  | "roadmap"
  | "files"
  | "canvas";

/* ------------------------------------------------------------------ */
/* Tenant / artist                                                     */
/* ------------------------------------------------------------------ */

export const TENANT = {
  brand: "Diamitani Music",
  artist: "Patrick Diamitani",
  initials: "PD",
  role: "Founder",
  genres: ["Electronic hip-hop", "Future bass", "Conscious rap", "EDM"],
  territory: "Worldwide",
  releaseLeadDays: 42,
  minRightsScore: 100,
} as const;

/* ------------------------------------------------------------------ */
/* Chat / sessions                                                     */
/* ------------------------------------------------------------------ */

export type ChatMessage = {
  id: string;
  role: "user" | "agent" | "system" | "tool";
  agentId?: string;
  content: string;
  toolName?: string;
  timestamp: string;
};

export type Session = {
  id: string;
  title: string;
  agentId: AgentId;
  updatedAt: string;
  preview: string;
  npao: NpaoClass;
};

/* ------------------------------------------------------------------ */
/* Catalog + rights ledger                                             */
/* ------------------------------------------------------------------ */

export type RightState =
  | "draft"
  | "rights_pending"
  | "blocked_rights_conflict"
  | "approved"
  | "scheduled"
  | "delivered"
  | "live"
  | "archived";

export type Contributor = {
  name: string;
  role: string;
  masterSplit: number;
  writerSplit: number;
  agreement: "signed" | "pending" | "missing";
};

export type Track = {
  id: string;
  title: string;
  version: string;
  isrc: string | null;
  bpm: number;
  key: string;
  moods: string[];
  state: RightState;
  rightsScore: number;
  clean: boolean;
  samples: "cleared" | "none" | "uncleared";
  artwork: "authorized" | "pending" | "missing";
  contributors: Contributor[];
  blockers: string[];
};

export type Release = {
  id: string;
  title: string;
  type: "Single" | "EP" | "Album";
  upc: string | null;
  trackIds: string[];
  state: RightState;
  releaseDate: string;
  daysOut: number | null;
  campaignProgress: number;
  approver: string;
  dsps: string[];
};

/* ------------------------------------------------------------------ */
/* Sync licensing CRM                                                  */
/* ------------------------------------------------------------------ */

export type LicenseStage =
  | "Inbound"
  | "Qualified"
  | "Quote Drafted"
  | "Approval"
  | "Won"
  | "Lost";

export type LicenseLead = {
  id: string;
  project: string;
  requestor: string;
  media: string;
  territory: string;
  term: string;
  trackId: string;
  stage: LicenseStage;
  fee: number;
  clearance: "clear" | "pending" | "blocked";
  due: string;
};

/* ------------------------------------------------------------------ */
/* Royalties                                                           */
/* ------------------------------------------------------------------ */

export type RoyaltyRow = {
  id: string;
  source: string;
  period: string;
  gross: number;
  status: "staged" | "reconciled" | "exception" | "approved";
  matched: boolean;
  note: string;
};

/* ------------------------------------------------------------------ */
/* Roadmap / NPAO                                                      */
/* ------------------------------------------------------------------ */

export type RoadmapTask = {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Blocked" | "Done";
  npao: NpaoClass;
  phase: Phase;
  agent: string;
  due: string;
  priority: number;
};

export type WorkspaceFile = {
  id: string;
  name: string;
  kind: "Master" | "Artwork" | "Document" | "Split Sheet" | "Statement" | "Knowledge";
  size: string;
  updated: string;
  source: string;
  rights: "authorized" | "pending" | "restricted";
};

export type Artifact = {
  id: string;
  title: string;
  kind: string;
  status: "Ready" | "Draft" | "In Review";
  agent: string;
  summary: string;
  body: string;
};

/* ------------------------------------------------------------------ */
/* Seed data — Diamitani Music                                         */
/* ------------------------------------------------------------------ */

export const TRACKS: Track[] = [
  {
    id: "DMT-2026-014",
    title: "Midnight Circuit",
    version: "Original",
    isrc: "USDMI2600014",
    bpm: 148,
    key: "F min",
    moods: ["Nocturnal", "Driving", "Euphoric"],
    state: "approved",
    rightsScore: 100,
    clean: false,
    samples: "none",
    artwork: "authorized",
    contributors: [
      { name: "Patrick Diamitani", role: "Producer / Writer", masterSplit: 100, writerSplit: 70, agreement: "signed" },
      { name: "Aria Vance", role: "Topline / Writer", masterSplit: 0, writerSplit: 30, agreement: "signed" },
    ],
    blockers: [],
  },
  {
    id: "DMT-2026-015",
    title: "Neon Prayer",
    version: "Original",
    isrc: null,
    bpm: 92,
    key: "C# min",
    moods: ["Introspective", "Cinematic", "Warm"],
    state: "blocked_rights_conflict",
    rightsScore: 60,
    clean: true,
    samples: "uncleared",
    artwork: "pending",
    contributors: [
      { name: "Patrick Diamitani", role: "Producer / Writer", masterSplit: 80, writerSplit: 50, agreement: "signed" },
      { name: "Kofi Mensah", role: "Co-writer", masterSplit: 20, writerSplit: 60, agreement: "pending" },
    ],
    blockers: ["Writer splits total 110% — collaborator claim mismatch", "Sample from “Dawn Chorus” uncleared", "Artwork authorization missing"],
  },
  {
    id: "DMT-2026-016",
    title: "Glass Lobby",
    version: "Radio Edit",
    isrc: null,
    bpm: 124,
    key: "A min",
    moods: ["Club", "Confident", "Bright"],
    state: "rights_pending",
    rightsScore: 85,
    clean: true,
    samples: "cleared",
    artwork: "authorized",
    contributors: [
      { name: "Patrick Diamitani", role: "Producer / Writer", masterSplit: 60, writerSplit: 50, agreement: "signed" },
      { name: "Lena Cruz", role: "Vocalist / Writer", masterSplit: 40, writerSplit: 50, agreement: "pending" },
    ],
    blockers: ["Vocalist agreement awaiting signature"],
  },
  {
    id: "DMT-2026-012",
    title: "Transit Lights",
    version: "Original",
    isrc: "USDMI2600012",
    bpm: 140,
    key: "G min",
    moods: ["Anthemic", "Hopeful", "Wide"],
    state: "live",
    rightsScore: 100,
    clean: false,
    samples: "none",
    artwork: "authorized",
    contributors: [
      { name: "Patrick Diamitani", role: "Producer / Writer", masterSplit: 100, writerSplit: 100, agreement: "signed" },
    ],
    blockers: [],
  },
  {
    id: "DMT-2026-013",
    title: "Afterglow",
    version: "Instrumental",
    isrc: "USDMI2600013",
    bpm: 118,
    key: "D maj",
    moods: ["Chill", "Romantic", "Soft"],
    state: "live",
    rightsScore: 100,
    clean: true,
    samples: "none",
    artwork: "authorized",
    contributors: [
      { name: "Patrick Diamitani", role: "Producer", masterSplit: 100, writerSplit: 100, agreement: "signed" },
    ],
    blockers: [],
  },
];

export const RELEASES: Release[] = [
  {
    id: "DMR-2026-006",
    title: "Midnight Circuit",
    type: "Single",
    upc: "0810123456789",
    trackIds: ["DMT-2026-014"],
    state: "scheduled",
    releaseDate: "Aug 29, 2026",
    daysOut: 42,
    campaignProgress: 45,
    approver: "Patrick Diamitani",
    dsps: ["Spotify", "Apple Music", "YouTube", "TikTok"],
  },
  {
    id: "DMR-2026-007",
    title: "Neon Prayer",
    type: "Single",
    upc: null,
    trackIds: ["DMT-2026-015"],
    state: "blocked_rights_conflict",
    releaseDate: "TBD",
    daysOut: null,
    campaignProgress: 0,
    approver: "Patrick Diamitani",
    dsps: [],
  },
  {
    id: "DMR-2026-005",
    title: "Transit Lights",
    type: "Single",
    upc: "0810123456772",
    trackIds: ["DMT-2026-012"],
    state: "live",
    releaseDate: "Jun 06, 2026",
    daysOut: null,
    campaignProgress: 100,
    approver: "Patrick Diamitani",
    dsps: ["Spotify", "Apple Music", "YouTube", "Amazon"],
  },
  {
    id: "DMR-2026-008",
    title: "Night Shift EP",
    type: "EP",
    upc: null,
    trackIds: ["DMT-2026-016", "DMT-2026-013"],
    state: "draft",
    releaseDate: "Q4 2026",
    daysOut: null,
    campaignProgress: 10,
    approver: "Patrick Diamitani",
    dsps: [],
  },
];

export const LICENSE_LEADS: LicenseLead[] = [
  {
    id: "DMC-2026-Q3-01",
    project: "Streetwear brand — fall trailer",
    requestor: "Halo Creative Agency",
    media: "Online ad (30s)",
    territory: "North America",
    term: "1 year",
    trackId: "DMT-2026-014",
    stage: "Approval",
    fee: 6500,
    clearance: "clear",
    due: "Jul 24",
  },
  {
    id: "DMC-2026-Q3-02",
    project: "Indie film — closing credits",
    requestor: "Lantern Pictures",
    media: "Film / festival",
    territory: "Worldwide",
    term: "Perpetuity",
    trackId: "DMT-2026-013",
    stage: "Quote Drafted",
    fee: 4200,
    clearance: "clear",
    due: "Jul 29",
  },
  {
    id: "DMC-2026-Q3-03",
    project: "Fitness app — workout playlist",
    requestor: "Pulse Labs",
    media: "In-app / streaming",
    territory: "Worldwide",
    term: "2 years",
    trackId: "DMT-2026-012",
    stage: "Qualified",
    fee: 3000,
    clearance: "clear",
    due: "Aug 02",
  },
  {
    id: "DMC-2026-Q3-04",
    project: "Trailer house — game teaser",
    requestor: "Vertex Trailers",
    media: "Trailer",
    territory: "Worldwide",
    term: "1 year",
    trackId: "DMT-2026-015",
    stage: "Inbound",
    fee: 0,
    clearance: "blocked",
    due: "Aug 05",
  },
  {
    id: "DMC-2026-Q2-11",
    project: "Podcast network — intro bed",
    requestor: "Wavelength Media",
    media: "Podcast",
    territory: "Worldwide",
    term: "1 year",
    trackId: "DMT-2026-013",
    stage: "Won",
    fee: 1800,
    clearance: "clear",
    due: "Closed",
  },
];

export const ROYALTIES: RoyaltyRow[] = [
  { id: "r1", source: "Distributor — DSP streams", period: "2026 Q2", gross: 8420.55, status: "reconciled", matched: true, note: "Matched to 4 tracks across 12 territories" },
  { id: "r2", source: "Publishing admin — mechanical", period: "2026 Q2", gross: 1240.18, status: "reconciled", matched: true, note: "Matched to registered works" },
  { id: "r3", source: "Sync — Wavelength Media", period: "2026 Q2", gross: 1800.0, status: "approved", matched: true, note: "License DMC-2026-Q2-11" },
  { id: "r4", source: "Distributor — YouTube CID", period: "2026 Q2", gross: 612.9, status: "exception", matched: false, note: "3 rows unmatched — unknown ISRC on UGC claims" },
  { id: "r5", source: "Performance — DJ set fees", period: "2026 Q2", gross: 2500.0, status: "staged", matched: false, note: "Awaiting deal-term confirmation before allocation" },
];

export const ROADMAP: RoadmapTask[] = [
  { id: "t1", title: "Resolve “Neon Prayer” split conflict (signed amendment)", status: "Blocked", npao: "N", phase: "Debugging", agent: "Rights Validator", due: "Jul 21", priority: 9.4 },
  { id: "t2", title: "Clear “Dawn Chorus” sample or replace", status: "Blocked", npao: "N", phase: "Debugging", agent: "Rights Validator", due: "Jul 23", priority: 9.0 },
  { id: "t3", title: "Countersign vocalist agreement — “Glass Lobby”", status: "In Progress", npao: "N", phase: "Development", agent: "Rights Validator", due: "Jul 22", priority: 8.2 },
  { id: "t4", title: "Lock Spotify pitch metadata — “Midnight Circuit”", status: "In Progress", npao: "P", phase: "Deployment", agent: "Release Orchestrator", due: "Jul 25", priority: 7.6 },
  { id: "t5", title: "Approve sync quote — Halo Creative (30s trailer)", status: "To Do", npao: "P", phase: "Development", agent: "Sync Researcher", due: "Jul 24", priority: 7.4 },
  { id: "t6", title: "Ship 42-day content matrix for “Midnight Circuit”", status: "To Do", npao: "P", phase: "Development", agent: "Growth Strategist", due: "Jul 26", priority: 6.8 },
  { id: "t7", title: "Clear Q2 royalty exception queue (3 rows)", status: "To Do", npao: "P", phase: "Development", agent: "Finance Validator", due: "Jul 28", priority: 6.5 },
  { id: "t8", title: "Follow up 3 warm booking leads", status: "To Do", npao: "P", phase: "Deployment", agent: "Booking Coordinator", due: "Jul 24", priority: 6.2 },
  { id: "t9", title: "Finalize producer collab deal terms", status: "To Do", npao: "A", phase: "Design", agent: "Partner Operations", due: "Aug 01", priority: 4.8 },
];

export const FILES: WorkspaceFile[] = [
  { id: "f1", name: "Midnight Circuit — master.wav", kind: "Master", size: "51.2 MB", updated: "Jul 12", source: "Upload", rights: "authorized" },
  { id: "f2", name: "Midnight Circuit — cover 3000x3000.png", kind: "Artwork", size: "4.1 MB", updated: "Jul 12", source: "Growth Strategist", rights: "authorized" },
  { id: "f3", name: "Neon Prayer — split sheet (v2).pdf", kind: "Split Sheet", size: "88 KB", updated: "Jul 15", source: "Rights Validator", rights: "pending" },
  { id: "f4", name: "Glass Lobby — vocalist agreement.pdf", kind: "Document", size: "142 KB", updated: "Jul 14", source: "Rights Validator", rights: "pending" },
  { id: "f5", name: "Q2 distributor statement.csv", kind: "Statement", size: "612 KB", updated: "Jul 10", source: "Finance Validator", rights: "restricted" },
  { id: "f6", name: "EPK — Patrick Diamitani.pdf", kind: "Document", size: "2.2 MB", updated: "Jul 11", source: "Booking Coordinator", rights: "authorized" },
  { id: "f7", name: "Sync catalog metadata.json", kind: "Knowledge", size: "36 KB", updated: "Jul 09", source: "Sync Researcher", rights: "authorized" },
];

export const ARTIFACTS: Artifact[] = [
  {
    id: "a1",
    title: "Rights report — Neon Prayer",
    kind: "Rights Check",
    status: "In Review",
    agent: "Rights Validator",
    summary: "Completeness 60% — commercial activation blocked until three N-class items clear.",
    body: `RIGHTS COMPLETENESS REPORT — DMT-2026-015 “Neon Prayer”

Score: 60 / 100  ·  State: blocked_rights_conflict
Commercial activation: DISABLED (distribution, sync, monetization, allocation)

Blockers (N-class):
1. Writer splits total 110%. Patrick Diamitani 50% + Kofi Mensah 60% claimed.
   → Requires signed amendment. Original claim retained in audit history.
2. Sample from "Dawn Chorus" uncleared.
   → Clear with rights holder or replace before delivery.
3. Artwork authorization missing.
   → Obtain written authorization from cover artist.

Evidence inventory:
- Producer agreement (Patrick Diamitani): signed
- Co-writer agreement (Kofi Mensah): pending
- Master splits: 80 / 20 (valid, = 100%)

Approval required: Rights owner sign-off on amendment.
Next transition allowed: blocked_rights_conflict → rights_pending (after amendment).

This is a commercial operating check, not legal advice.`,
  },
  {
    id: "a2",
    title: "42-day campaign — Midnight Circuit",
    kind: "Campaign",
    status: "Draft",
    agent: "Growth Strategist",
    summary: "Release positioning, calendar, and platform actions for the Aug 29 single.",
    body: `RELEASE CAMPAIGN — DMR-2026-006 “Midnight Circuit” (Single)

Positioning
Nocturnal, driving electronic hip-hop at 148 BPM. For late-night drives and club warm-ups.
Story: a producer's ode to the city that never powers down.

42-day calendar
- D-42 → D-28: Lock Spotify pitch, pre-save live, teaser #1 (hook + visualizer)
- D-28 → D-14: Creator outreach (12 briefs), behind-the-beat clip, playlist pitch send
- D-14 → D-0: Countdown, snippet drops, DJ set placement, release-day push
- D+1 → D+14: UGC re-share, alt-version tease, performance report

Platform actions
- Spotify: pitch unreleased track (genre, sound, city story locked before window)
- Apple/YouTube: profile + canvas assets ready via distributor
- TikTok/IG/Snap: 9 short-form hooks, spend caps set, founder approves paid

Guardrail: no promise of editorial placement, streams, or algorithmic outcomes.
Approval points: founder approves delivery + any paid spend.`,
  },
  {
    id: "a3",
    title: "Sync quote — Halo Creative (30s trailer)",
    kind: "Licensing",
    status: "In Review",
    agent: "Sync Researcher",
    summary: "Draft quote for “Midnight Circuit” — North America, 1 year, online ad.",
    body: `SYNC LICENSING PACKET — DMC-2026-Q3-01

Requestor: Halo Creative Agency
Project: Streetwear brand — fall trailer
Track: DMT-2026-014 "Midnight Circuit" (master + composition, 100% cleared)

Requested terms
- Media: online advertising (30s cutdown)
- Territory: North America
- Term: 1 year
- Exclusivity: non-exclusive
- Edit rights: cutdown only, no lyric changes

Draft quote (from approved rate card): $6,500
Assumptions: single track, no options, standard MFN.
Negotiation risks: agency may request worldwide — reprice tier.

Binding? NO. No quote binds Diamitani Music until a licensing admin approves
rights, term, media, territory, exclusivity, and fee.`,
  },
  {
    id: "a4",
    title: "EPK — Patrick Diamitani",
    kind: "Press Kit",
    status: "Ready",
    agent: "Booking Coordinator",
    summary: "One-page press kit with bios, featured tracks, and booking contact.",
    body: `PATRICK DIAMITANI — ELECTRONIC PRESS KIT

Short bio
Chicago producer-DJ Patrick Diamitani fuses electronic hip-hop, future bass, and
conscious rap into records built for late-night rooms. His catalog under Diamitani
Music pairs club-ready energy with clean, licensable rights.

Featured tracks
- Transit Lights (anthemic, 140 BPM) — live
- Afterglow (chill instrumental, 118 BPM) — sync-ready
- Midnight Circuit (nocturnal, 148 BPM) — Aug 29

Tech: 2x CDJ-3000 + DJM-A9, USB or Rekordbox. Full rider on request.
Booking: booking@diamitani.example  ·  Territory: Worldwide`,
  },
];

export const SESSIONS: Session[] = [
  { id: "s1", title: "Resolve Neon Prayer split conflict", agentId: "rights-validator", updatedAt: "8m ago", preview: "Splits total 110%. Amendment drafted — awaiting signature.", npao: "N" },
  { id: "s2", title: "Midnight Circuit release plan", agentId: "release-orchestrator", updatedAt: "40m ago", preview: "Scheduled 42 days out. Metadata locked for Spotify pitch.", npao: "P" },
  { id: "s3", title: "This week priorities", agentId: "orchestrator", updatedAt: "1h ago", preview: "2 rights blockers ranked before any release action.", npao: "N" },
  { id: "s4", title: "Halo Creative sync quote", agentId: "sync-researcher", updatedAt: "2h ago", preview: "Draft quote $6,500 — ready for licensing approval.", npao: "P" },
  { id: "s5", title: "Q2 royalty reconciliation", agentId: "finance-validator", updatedAt: "Yesterday", preview: "3 unmatched YouTube CID rows in exception queue.", npao: "P" },
];

export const STARTER_THREAD: ChatMessage[] = [
  { id: "m0", role: "system", content: "Session scoped to Atlas · PAL compiled · NPAO ordering N→A→P→O", timestamp: "now" },
  {
    id: "m1",
    role: "agent",
    agentId: "orchestrator",
    content:
      "Good evening. Before any release moves, two N-class rights blockers need you: the Neon Prayer split conflict (splits total 110%) and its uncleared sample. Midnight Circuit is clean and scheduled for Aug 29. Want me to open the rights report or walk the amendment?",
    timestamp: "2m ago",
  },
  { id: "m2", role: "tool", toolName: "rights.check", content: "2 blockers · 1 release scheduled · rights gate enforced", timestamp: "2m ago" },
];

/* ------------------------------------------------------------------ */
/* Briefing metrics                                                    */
/* ------------------------------------------------------------------ */

export type Metric = {
  label: string;
  value: string;
  delta: string;
  tone: "up" | "down" | "flat";
  hint: string;
};

export const METRICS: Metric[] = [
  { label: "Rights-complete tracks", value: "3 / 5", delta: "2 blocked", tone: "flat", hint: "Gate: 100% required before commercial activation" },
  { label: "Qualified streams (90d)", value: "412K", delta: "+18%", tone: "up", hint: "Toward the 1M / 12-mo target" },
  { label: "Licensing pipeline", value: "$15.5K", delta: "4 active briefs", tone: "up", hint: "1 in approval, 1 quoted" },
  { label: "Royalties reconciled (Q2)", value: "$11.5K", delta: "3 exceptions", tone: "flat", hint: "Payouts require founder approval" },
];
