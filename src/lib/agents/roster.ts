/**
 * Artispreneur — Core Agents & Skills (v1).
 *
 * Structured form of the v1 specification: the Day to Day Manager as master
 * agent orchestrating six specialists, each with its documented mission,
 * skill groups, integrations, and guardrails.
 *
 * This is the source of truth for what the platform says it can do — the
 * marketing roster, the /skills documentation, and the agent directory all
 * render from it, so the product description can never drift from the spec.
 */

import type { SpecialistId } from "@/lib/rostr/specialists";

export type SkillGroup = {
  /** Heading used in the spec, e.g. "PRO Management". */
  name: string;
  skills: string[];
};

export type AgentGuardrails = {
  /** Things the agent may do on its own. */
  may: string[];
  /** Hard stops — approval gates and prohibitions. */
  mayNot: string[];
};

export type AgentSpec = {
  /** Stable key used in URLs and copy. */
  id: string;
  /** Routing target in the ROSTR runtime; null for the master agent. */
  specialistId: SpecialistId | null;
  name: string;
  role: string;
  mission: string;
  /** One-line "what it does" from the spec. */
  summary: string;
  /** Who this agent is for. */
  endUser: string;
  master?: boolean;
  skillGroups: SkillGroup[];
  tools: string[];
  guardrails: AgentGuardrails;
};

export const AGENT_SPECS: AgentSpec[] = [
  {
    id: "day-to-day-manager",
    specialistId: null,
    master: true,
    name: "Day to Day Manager",
    role: "Master Agent / Artist COO",
    mission:
      "Run the artist's full business operation end-to-end — from planning to execution — by orchestrating every Artispreneur specialist.",
    summary:
      "Creates business plans and roadmaps, manages your calendar and inbox, oversees every sub-agent, and keeps the CRM current.",
    endUser: "Independent artists, managers, labels",
    skillGroups: [
      {
        name: "Planning",
        skills: [
          "Create artist business plan from your onboarding brief",
          "Generate a milestone-based, phase-aware artist roadmap",
          "Priority management via the NPAO framework",
          "Weekly and monthly status reporting",
        ],
      },
      {
        name: "Operations",
        skills: [
          "Manage calendar — events, deadlines, release dates",
          "Manage email inbox — draft, send, and organize",
          "Set up your internal CRM with contact tracking and pipeline",
          "Set up affiliate CRM (HubSpot or partner platform)",
        ],
      },
      {
        name: "Orchestration",
        skills: [
          "Route tasks to the right specialist and collect their output",
          "Task delegation and follow-up",
          "Surface blockers before they become emergencies",
        ],
      },
    ],
    tools: ["Gmail", "Notion", "Task manager", "HubSpot", "Resend", "n8n"],
    guardrails: {
      may: [
        "Read and write all artist documents",
        "Send emails with artist approval",
        "Create and update tasks",
      ],
      mayNot: [
        "Sign contracts without Legal Manager review",
        "Make financial transactions without Finance Manager approval",
      ],
    },
  },
  {
    id: "publishing-manager",
    specialistId: "publishing",
    name: "Publishing Manager",
    role: "Music Rights & Royalty Operations",
    mission:
      "Ensure every track is registered, protected, and generating maximum royalties across all PROs and DSPs.",
    summary:
      "Registers your music with PROs, tracks royalties across DSPs, builds your catalogue, and generates split sheets. Most independent artists leave a large share of their royalties unclaimed — this agent goes and gets them.",
    endUser: "Artists, songwriters, co-writers, labels",
    skillGroups: [
      {
        name: "PRO Management",
        skills: [
          "Sign up for a PRO — ASCAP, BMI, SESAC, or DistroKid Publishing",
          "Register music with your PRO (title, ISRC, splits, publisher info)",
          "Claim published and released tracks on your PRO",
          "Analyze PRO databases for unregistered and unclaimed tracks",
          "Track royalties across DSPs and PROs",
          "Maintain a royalty spreadsheet with payment amounts and dates",
          "Display a visual royalty dashboard",
        ],
      },
      {
        name: "Music Catalogue",
        skills: [
          "Import tracks from Google Drive, DSP links, or your device",
          "Extract metadata — BPM, key, theme, mood, ISRC, UPC",
          "Enhance metadata with AI genre tags and sonic descriptors",
          "Display a shareable catalogue table with track details",
          "Tag tracks as Released, Unreleased, or Vault",
        ],
      },
      {
        name: "Split Sheets",
        skills: [
          "Auto-generate a 100/100 split sheet for solo tracks",
          "Guided checklist flow for collaborations and co-writer invites",
          "Generate ownership splits and an asset valuation table",
          "Generate contracts for self-owned tracks for your records",
        ],
      },
    ],
    tools: [
      "ASCAP / BMI / SESAC",
      "DistroKid",
      "UnitedMasters",
      "Spotify API",
      "Google Drive",
    ],
    guardrails: {
      may: [
        "Register tracks on the artist's behalf",
        "Generate and store split sheets",
      ],
      mayNot: [
        "Submit documents to PROs without artist review",
        "Modify ownership splits without artist approval",
      ],
    },
  },
  {
    id: "finance-manager",
    specialistId: "finance",
    name: "Finance Manager",
    role: "Artist Financial Operations",
    mission:
      "Get the artist's money organized, protected, and working — from account setup to income tracking.",
    summary:
      "Guides you through business banking setup, connects your financial tools, and tracks music income and expenses.",
    endUser: "Independent artists managing their own finances",
    skillGroups: [
      {
        name: "Business Banking Setup",
        skills: [
          "Guide you through opening a business bank account",
          "Set up creator-focused banking (Every.io, Lili)",
          "Compare alternatives (Mercury, Relay)",
          "Connect your bank to income tracking",
        ],
      },
      {
        name: "Income & Expense Tracking",
        skills: [
          "Track royalty income from the Publishing Manager",
          "Track show income from the Booking Manager",
          "Track sync licensing income",
          "Categorize and tag expenses",
          "Generate a monthly P&L summary",
          "Set income goals and milestones",
        ],
      },
    ],
    tools: ["Every.io", "Lili", "Mercury / Relay", "Plaid"],
    guardrails: {
      may: [
        "Guide setup and connect accounts with artist approval",
        "Read financial data and generate reports",
      ],
      mayNot: [
        "Initiate transactions without explicit approval",
        "Store raw bank credentials",
      ],
    },
  },
  {
    id: "pr-manager",
    specialistId: "press",
    name: "PR Manager",
    role: "Music PR & Marketing",
    mission:
      "Build and execute campaigns that get the artist's music heard, covered, and discovered.",
    summary:
      "Creates release campaigns, writes press and pitch copy, manages social promotion, and runs paid and earned media.",
    endUser: "Artists launching singles, EPs, albums, or tours",
    skillGroups: [
      {
        name: "Release Campaigns",
        skills: [
          "Create a pre-release campaign plan with timeline and milestones",
          "Write press releases and bio copy",
          "Create pitch emails for blogs, playlists, and press",
          "Submit to editorial playlists (Spotify, Apple, Amazon)",
          "Create a release-day content plan",
        ],
      },
      {
        name: "Social Media Promotion",
        skills: [
          "Draft organic posts for Instagram, TikTok, X, and Facebook",
          "Build a content calendar",
          "Write caption templates and hooks",
          "Schedule and track posts",
          "Plan paid social strategy (Meta Ads, TikTok Ads)",
        ],
      },
      {
        name: "SEO / SEM Advertising",
        skills: [
          "Set up Google Search ads for your artist name and tracks",
          "Plan programmatic display advertising",
          "Set up YouTube pre-roll campaigns",
          "Track campaign analytics and ROI",
        ],
      },
    ],
    tools: ["Meta Ads", "Google Ads", "TikTok Ads", "Later / Buffer", "Resend"],
    guardrails: {
      may: [
        "Draft all copy and campaign materials",
        "Schedule posts with artist approval",
      ],
      mayNot: [
        "Spend ad budget without explicit artist approval",
        "Post publicly without passing the approval gate",
      ],
    },
  },
  {
    id: "booking-manager",
    specialistId: "booking",
    name: "Booking Manager",
    role: "Artist Booking & Touring",
    mission:
      "Fill the artist's calendar with relevant, paid performance opportunities — from open mics to tour support slots.",
    summary:
      "Discovers relevant gigs, writes the outreach, builds your booking calendar, and runs the full outreach CRM.",
    endUser: "Artists looking to perform live and build touring income",
    skillGroups: [
      {
        name: "Gig Discovery",
        skills: [
          "Find artists on tour for support-slot opportunities",
          "Find relevant showcases (SXSW, A3C, and similar)",
          "Find open mics and residency opportunities",
          "Find audition sites and talent contests",
          "Filter every opportunity by genre, location, and career stage",
        ],
      },
      {
        name: "Outreach",
        skills: [
          "Write booking inquiries to venues, promoters, and agents",
          "Write DM outreach for Instagram and X",
          "Personalize outreach per contact",
          "Automate follow-up sequences",
        ],
      },
      {
        name: "Calendar & CRM",
        skills: [
          "Build your confirmed gig calendar",
          "Track outreach status — sent, replied, booked, declined",
          "Manage the booking CRM pipeline",
          "Log deal terms and payments",
        ],
      },
    ],
    tools: ["Songkick / Bandsintown", "Google Maps", "Gmail", "HubSpot", "n8n"],
    guardrails: {
      may: ["Draft and queue outreach", "Update the CRM and calendar"],
      mayNot: [
        "Confirm bookings or sign performance contracts without artist approval",
      ],
    },
  },
  {
    id: "legal-manager",
    specialistId: "contracts",
    name: "Legal Manager",
    role: "Artist Legal & Business Formation",
    mission:
      "Make sure every artist has a legally protected business — the right entity, the right contracts, and the right registrations.",
    summary:
      "Generates contracts from templates, guides business formation (LLC, C Corp, EIN), and connects you to legal service partners.",
    endUser: "Artists forming their first music business entity",
    skillGroups: [
      {
        name: "Business Formation",
        skills: [
          "Register your EIN with the IRS",
          "Form an LLC with your state, directly or via a partner",
          "Incorporate a C Corp with your state",
          "Save every formation document to your file vault",
          "Track formation status and deadlines",
        ],
      },
      {
        name: "Contract Generation",
        skills: [
          "Generate contracts from templates — performance, sync, collab, management",
          "Customize contract fields (parties, terms, splits, dates)",
          "Produce downloadable PDFs",
          "Upload signed contracts to your file vault",
        ],
      },
    ],
    tools: ["DocuSign / HelloSign", "LegalZoom", "RocketLawyer", "Every.io", "IRS.gov"],
    guardrails: {
      may: [
        "Generate and display contract drafts",
        "Guide you through each formation step",
      ],
      mayNot: [
        "Provide legal advice — it always tells you to consult an attorney",
        "Submit formation documents without artist review and approval",
      ],
    },
  },
  {
    id: "brand-manager",
    specialistId: "brand-epk",
    name: "Brand Manager",
    role: "Artist Brand & Creative Direction",
    mission:
      "Build a cohesive, compelling artist brand that attracts fans, venues, press, and partners.",
    summary:
      "Creates brand guidelines and visual assets, builds your EPK and one-sheeter, and ships your artist website.",
    endUser: "Artists building their public image and professional presence",
    skillGroups: [
      {
        name: "Brand Identity",
        skills: [
          "Create brand guidelines — palette, typography, tone of voice",
          "Generate logo concepts",
          "Create graphic assets — banners, promo cards, social templates",
          "Design merch concepts",
        ],
      },
      {
        name: "EPK & Press Kit",
        skills: [
          "Create your Electronic Press Kit",
          "Write your bio in short, medium, and long form",
          "Create a one-sheeter for media, venues, and booking agents",
          "Assemble a media page with photos, videos, and press clips",
          "Create a partnerships one-pager",
        ],
      },
      {
        name: "Music Website",
        skills: [
          "Build your artist website — bio, music, tour dates, merch, contact",
          "Add a booking form and ticketing integration",
          "Add a merch store",
          "Publish your EPK as a shareable page",
        ],
      },
      {
        name: "Social Content",
        skills: [
          "Create a social media content calendar",
          "Design post templates",
          "Generate caption copy",
          "Write short-form video scripts for Reels and TikTok",
        ],
      },
    ],
    tools: ["Image generation", "Canva", "Webflow / Next.js", "Printful / Printify"],
    guardrails: {
      may: [
        "Generate and store all brand assets",
        "Publish your website with artist approval",
      ],
      mayNot: [
        "Publish external content without explicit approval",
        "Purchase a domain or hosting without artist authorization",
      ],
    },
  },
];

export const MASTER_AGENT = AGENT_SPECS.find((a) => a.master)!;
export const SPECIALIST_AGENTS = AGENT_SPECS.filter((a) => !a.master);

export function getAgentSpec(id: string) {
  return AGENT_SPECS.find((a) => a.id === id) ?? null;
}

export function getAgentBySpecialist(specialistId: SpecialistId) {
  return AGENT_SPECS.find((a) => a.specialistId === specialistId) ?? null;
}

/** Total documented skills across every agent — used in marketing counts. */
export const TOTAL_SKILL_COUNT = AGENT_SPECS.reduce(
  (n, a) => n + a.skillGroups.reduce((m, g) => m + g.skills.length, 0),
  0,
);
