/**
 * Artispreneur — Brand Tokens
 * Source: Knowledge Base / Artispreneur Design System v1.0
 */

export const brand = {
  name: "Artispreneur",
  product: "Artispreneur",
  tagline: "Art Means Business.",
  slogan: "Empowering Artists to Become Entrepreneurs",
  secondaryTagline: "Every Artist is an Entrepreneur.",
  domain: "artispreneur.com",
  email: {
    hello: "hello@artispreneur.com",
    support: "support@artispreneur.com",
  },

  mission:
    "Empower artists to become successful entrepreneurs by providing access to essential resources, knowledge, and tools tailored to their unique creative journeys.",

  colors: {
    crimson: "#CC0000",
    crimsonDark: "#A30000",
    gold: "#FED001",
    goldDark: "#D4AC00",
    goldLight: "#FEE55E",
    black: "#111111",
    charcoal: "#222222",
    grayDark: "#444444",
    grayMid: "#777777",
    grayLight: "#F5F5F5",
    white: "#FFFFFF",
    border: "#EEEEEE",
  },

  logo: {
    primaryPng: "/artispreneur-logo.png",
    alt: "Artispreneur — Art Means Business.",
  },

  pricing: {
    starter: {
      name: "Starter",
      price: 0,
      period: "forever",
      cta: "Start free",
      featured: false,
      blurb: "Academy + Tutor Agent, directory browsing, your first workspace.",
      features: [
        "Academy courses + Tutor Agent",
        "Master Agent (light model)",
        "Directory browsing",
        "Catalog upload on Cataba",
      ],
    },
    workspace: {
      name: "Workspace",
      price: 79,
      period: "month",
      cta: "Get the Workspace",
      featured: true,
      blurb: "The full AI business team. Every agent, every skill, one command center.",
      features: [
        "All 7 specialist agents + Master Agent",
        "Approval queue + audit log",
        "Full Composio integrations (Gmail, Drive, Sheets)",
        "Priority jobs + larger models",
        "BYOK supported",
      ],
    },
    agency: {
      name: "Agency & Label",
      price: null,
      period: "per roster",
      cta: "Talk to us",
      featured: false,
      blurb: "Organization hub, staff roles, client workspaces, and the Director agent.",
      features: [
        "Agency Director / Roster Director",
        "Client artist workspaces",
        "Shared playbooks + reporting",
        "SSO, audit export, dedicated compute options",
      ],
    },
  },

  products: [
    {
      id: "agent",
      name: "Agent",
      host: "agent.artispreneur.com",
      href: "https://agent.artispreneur.com",
      line: "Your Hermes workspace for the business of music.",
      body: "Custom Hermes Agent workspace for artists. Ask in plain language, get drafts, and approve before anything ships.",
    },
    {
      id: "academy",
      name: "Academy",
      host: "academy.artispreneur.com",
      href: "https://academy.artispreneur.com",
      line: "Learn the industry. Then run it.",
      body: "Online course platform and general media for royalties, contracts, branding, distribution, and career ops.",
    },
    {
      id: "epks",
      name: "EPKs",
      host: "epks.artispreneur.com",
      href: "https://epks.artispreneur.com",
      line: "Press kits and artist microsites.",
      body: "EPK builder and microsite agent. Bios, assets, tech rider, and booking contact ready to share.",
    },
    {
      id: "contracts",
      name: "Contracts",
      host: "contracts.artispreneur.com",
      href: "https://contracts.artispreneur.com",
      line: "Agreements you can actually manage.",
      body: "Contract builder agent and CMS dashboard for splits, bookings, producer deals, and approvals.",
    },
    {
      id: "directory",
      name: "Directory",
      host: "directory.artispreneur.com",
      href: "https://directory.artispreneur.com",
      line: "Find the room. Then get in it.",
      body: "Industry directory plus outreach agent and CMS for venues, blogs, playlists, and media contacts.",
    },
    {
      id: "catalog",
      name: "Catalog",
      host: "catalog.artispreneur.com",
      href: "https://catalog.artispreneur.com",
      line: "Your masters, cleaned for business.",
      body: "Artist music catalog agent and CMS workspace for discography, splits, identifiers, and publishing prep.",
    },
  ],

  pillars: [
    {
      id: "royalties",
      name: "Royalties",
      body: "Know what you earn, where it comes from, and how to collect it before streams disappear into someone else's spreadsheet.",
    },
    {
      id: "education",
      name: "Education",
      body: "Music business literacy that turns into action: PRO setup, release planning, branding, licensing, and taxes.",
    },
    {
      id: "contracts",
      name: "Contracts",
      body: "Protect the work with clear agreements, split sheets, and booking paperwork you can review before you sign.",
    },
  ],

  useCases: [
    {
      id: "business",
      title: "Create legal business registration",
      body: "Set up the entity, EIN path, and bank-ready paperwork so your music career can invoice like a company.",
    },
    {
      id: "venues",
      title: "Look up venues hiring artists near you",
      body: "Search the Directory for rooms that book your style, save prospects, and draft outreach you approve before send.",
    },
    {
      id: "epk",
      title: "Create your EPK and social content",
      body: "Build a press kit and microsite, then turn the same story into posts, bios, and booking-ready assets.",
    },
  ],

  social: {
    instagram: "https://instagram.com/artispreneur",
    tiktok: "https://tiktok.com/@artispreneur",
    youtube: "https://youtube.com/@artispreneur",
  },
} as const;

export type ProductId = (typeof brand.products)[number]["id"];

export const PHASE_COLORS = {
  PreD: "#8b7ff5",
  Design: "#4fb6e8",
  Development: "#fed001",
  Deployment: "#4fd18b",
  Debugging: "#e8734f",
} as const;

export type Phase = keyof typeof PHASE_COLORS;

export const STATUS_COLORS = {
  ok: "#1a7f4b",
  warn: "#d97706",
  block: "#cc0000",
  info: "#4fb6e8",
  muted: "#777777",
} as const;
