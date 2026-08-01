/**
 * Integration registry — how every platform in the Core Agents & Skills v1
 * spec actually reaches the outside world.
 *
 * Four providers, in order of preference:
 *
 *   aws       Native to the platform. State, files, inference, and memory all
 *             live in our own AWS account — DynamoDB, S3, Bedrock, AgentCore.
 *             The v1 spec named Supabase and Notion as the state layer; this
 *             platform runs on AWS instead, so those are integrations an
 *             artist may connect, never where our data lives.
 *
 *   composio  Anything with a mainstream OAuth connector. Composio owns the
 *             token exchange and refresh so we never hold user credentials.
 *
 *   mcp       Music-domain systems Composio does not cover. Served by our own
 *             MCP servers (see src/app/api/mcp/*), which means the same tools
 *             work for our agents and for any external MCP client.
 *
 *   affiliate No usable public API — the agent prepares the work and hands the
 *             artist a referral link to finish the filing themselves.
 */

import type { SpecialistId } from "@/lib/rostr/specialists";

export type IntegrationProvider = "aws" | "composio" | "mcp" | "affiliate";

export type IntegrationStatus =
  /** Wired end to end and callable by an agent today. */
  | "live"
  /** Provider is wired; this connector needs credentials to activate. */
  | "available"
  /** Specified, not yet built. */
  | "planned";

export type Integration = {
  id: string;
  name: string;
  category: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  /** What the agent uses it for. */
  purpose: string;
  /** Agents that hold this integration. */
  agents: SpecialistId[] | "master";
  /** Composio app slug, MCP server id, or affiliate URL. */
  handle?: string;
  /** Env var that activates it, when it needs one. */
  envVar?: string;
};

export const INTEGRATIONS: Integration[] = [
  // ── AWS native ──────────────────────────────────────────────────────
  {
    id: "dynamodb",
    name: "Amazon DynamoDB",
    category: "Platform",
    provider: "aws",
    status: "live",
    purpose: "Control-plane records — users, projects, agents, plan state.",
    agents: "master",
    envVar: "DYNAMODB_TABLE",
  },
  {
    id: "s3",
    name: "Amazon S3",
    category: "Platform",
    provider: "aws",
    status: "live",
    purpose: "Workspace file vault — masters, contracts, deliverables, memory.",
    agents: "master",
    envVar: "S3_HUB_BUCKET",
  },
  {
    id: "bedrock",
    name: "Amazon Bedrock",
    category: "Platform",
    provider: "aws",
    status: "live",
    purpose: "Model inference for every agent.",
    agents: "master",
    envVar: "BEDROCK_MODEL_ID",
  },
  {
    id: "agentcore",
    name: "Bedrock AgentCore",
    category: "Platform",
    provider: "aws",
    status: "available",
    purpose: "Long-term agent memory, workload identity, and the MCP gateway.",
    agents: "master",
    envVar: "AGENTCORE_MEMORY_ID",
  },
  {
    id: "cognito",
    name: "Amazon Cognito",
    category: "Platform",
    provider: "aws",
    status: "live",
    purpose: "Artist authentication and session identity.",
    agents: "master",
    envVar: "COGNITO_USER_POOL_ID",
  },

  // ── Composio (mainstream OAuth) ─────────────────────────────────────
  {
    id: "gmail",
    name: "Gmail",
    category: "Email & Calendar",
    provider: "composio",
    status: "available",
    purpose: "Draft outreach, read the inbox, manage the artist calendar.",
    agents: "master",
    handle: "gmail",
    envVar: "COMPOSIO_API_KEY",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Email & Calendar",
    provider: "composio",
    status: "available",
    purpose: "Shows, studio sessions, deadlines, and release dates.",
    agents: "master",
    handle: "googlecalendar",
    envVar: "COMPOSIO_API_KEY",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "Storage",
    provider: "composio",
    status: "available",
    purpose: "Import masters and reference material into the knowledge vault.",
    agents: ["publishing", "brand-epk", "contracts"],
    handle: "googledrive",
    envVar: "COMPOSIO_API_KEY",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    category: "Finance",
    provider: "composio",
    status: "available",
    purpose: "Royalty trackers, split sheets, and budget models.",
    agents: ["finance", "publishing"],
    handle: "googlesheets",
    envVar: "COMPOSIO_API_KEY",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    provider: "composio",
    status: "available",
    purpose: "Contact and outreach tracking for booking and press pipelines.",
    agents: ["booking", "press"],
    handle: "hubspot",
    envVar: "COMPOSIO_API_KEY",
  },
  {
    id: "notion",
    name: "Notion",
    category: "Docs",
    provider: "composio",
    status: "available",
    purpose: "Publish plans and checklists into the artist's own Notion.",
    agents: "master",
    handle: "notion",
    envVar: "COMPOSIO_API_KEY",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Comms",
    provider: "composio",
    status: "available",
    purpose: "Band and team updates.",
    agents: "master",
    handle: "slack",
    envVar: "COMPOSIO_API_KEY",
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    category: "Advertising",
    provider: "composio",
    status: "planned",
    purpose: "Paid social campaigns — spend always gated on artist approval.",
    agents: ["press"],
    handle: "meta_ads",
    envVar: "COMPOSIO_API_KEY",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    category: "Advertising",
    provider: "composio",
    status: "planned",
    purpose: "Search and YouTube campaigns for artist name and releases.",
    agents: ["press"],
    handle: "googleads",
    envVar: "COMPOSIO_API_KEY",
  },

  // ── Custom MCP (music domain) ───────────────────────────────────────
  {
    id: "spotify",
    name: "Spotify",
    category: "Streaming",
    provider: "mcp",
    status: "available",
    purpose:
      "Discography import, track metadata, and ISRC extraction for the catalogue.",
    agents: ["publishing", "release"],
    handle: "music",
    envVar: "SPOTIFY_CLIENT_ID",
  },
  {
    id: "musicbrainz",
    name: "MusicBrainz",
    category: "Rights data",
    provider: "mcp",
    status: "live",
    purpose:
      "Open recording and release lookup — ISRC resolution with no credentials required.",
    agents: ["publishing"],
    handle: "music",
  },
  {
    id: "distrokid",
    name: "DistroKid",
    category: "Distribution",
    provider: "mcp",
    status: "planned",
    purpose: "Release delivery status and royalty statement pulls.",
    agents: ["publishing", "release"],
    handle: "music",
  },
  {
    id: "unitedmasters",
    name: "UnitedMasters",
    category: "Distribution",
    provider: "mcp",
    status: "planned",
    purpose: "Distribution and royalty data.",
    agents: ["publishing", "release"],
    handle: "music",
  },
  {
    id: "pro-registries",
    name: "ASCAP / BMI / SESAC",
    category: "Rights data",
    provider: "mcp",
    status: "planned",
    purpose:
      "Repertoire search for unregistered and unclaimed works. None of the three publish a write API, so registration stays artist-submitted.",
    agents: ["publishing"],
    handle: "music",
  },
  {
    id: "songkick",
    name: "Songkick / Bandsintown",
    category: "Live",
    provider: "mcp",
    status: "planned",
    purpose: "Tour discovery and support-slot opportunities.",
    agents: ["booking"],
    handle: "music",
  },

  // ── Affiliate (no usable API) ───────────────────────────────────────
  {
    id: "irs-ein",
    name: "IRS EIN filing",
    category: "Formation",
    provider: "affiliate",
    status: "live",
    purpose: "Agent prepares your EIN application; you submit it on IRS.gov.",
    agents: ["contracts"],
    handle: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
  },
  {
    id: "legalzoom",
    name: "LegalZoom",
    category: "Formation",
    provider: "affiliate",
    status: "available",
    purpose: "LLC, C Corp, and trademark filing.",
    agents: ["contracts"],
    handle: "https://www.legalzoom.com/",
  },
  {
    id: "rocketlawyer",
    name: "RocketLawyer",
    category: "Formation",
    provider: "affiliate",
    status: "available",
    purpose: "Contract templates and compliance.",
    agents: ["contracts"],
    handle: "https://www.rocketlawyer.com/",
  },
  {
    id: "every",
    name: "Every.io",
    category: "Banking",
    provider: "affiliate",
    status: "available",
    purpose: "Business banking and formation bundle for creators.",
    agents: ["finance"],
    handle: "https://every.io/",
  },
  {
    id: "lili",
    name: "Lili",
    category: "Banking",
    provider: "affiliate",
    status: "available",
    purpose: "Freelancer-focused business banking.",
    agents: ["finance"],
    handle: "https://lili.co/",
  },
];

export function integrationsForAgent(specialistId: SpecialistId | "master") {
  return INTEGRATIONS.filter((i) =>
    i.agents === "master"
      ? specialistId === "master"
      : Array.isArray(i.agents) && i.agents.includes(specialistId as SpecialistId),
  );
}

export function integrationsByProvider(provider: IntegrationProvider) {
  return INTEGRATIONS.filter((i) => i.provider === provider);
}

/**
 * Registry entries whose backing env var is present. `status: "live"` entries
 * with no env var (open APIs, affiliate links) are always considered active.
 */
export function activeIntegrations() {
  return INTEGRATIONS.filter((i) => {
    if (i.status === "planned") return false;
    if (!i.envVar) return true;
    return Boolean(process.env[i.envVar]);
  });
}

export const INTEGRATION_CATEGORIES = Array.from(
  new Set(INTEGRATIONS.map((i) => i.category)),
);
