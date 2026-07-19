/**
 * Artispreneur — Brand Tokens
 * Source: Brand Guidelines v1.0 + Design System v1.0 + SOUL.md
 */

export const brand = {
  name: "Artispreneur",
  product: "Agent by Artispreneur",
  tagline: "Art Means Business.",
  slogan: "Empowering Artists to Become Entrepreneurs",
  secondaryTagline: "Every Artist is an Entrepreneur.",
  domain: "artispreneur.com",
  email: {
    hello: "hello@artispreneur.com",
    support: "support@artispreneur.com",
  },

  mission:
    "Empower artists to become successful entrepreneurs by providing access to essential resources, knowledge, tools, and an AI business team tailored to their creative careers.",

  colors: {
    red: "#C0272D",
    redHover: "#A12024",
    gold: "#F5C100",
    goldHover: "#D9AB00",
    white: "#FFFFFF",
    charcoal: "#1A1A1A",
    warmGray: "#4A4A4A",
    parchment: "#F9F6EF",
    goldTint: "#FFF8D6",
    border: "#E5E5E5",
  },

  logo: {
    primaryPng: "/artispreneur-logo.png",
    markSvg: "/artispreneur-mark.svg",
    alt: "Artispreneur — Art Means Business",
  },

  pricing: {
    free: {
      name: "Free",
      price: 0,
      period: "forever",
      cta: "Start free",
      featured: false,
      blurb: "PAL intake, starter Soul.md, and limited Master Agent.",
      features: [
        "PAL onboarding + draft Master Soul",
        "Mission Control overview",
        "Academy starter courses",
        "Directory search (limited)",
        "Contract & EPK previews",
      ],
    },
    premium: {
      name: "Premium",
      price: 9.99,
      period: "month",
      cta: "Start Premium",
      featured: true,
      blurb: "Your AI team for day-to-day music business ops.",
      features: [
        "Everything in Free",
        "Full specialist roster (7 agents)",
        "EPK Builder + Contract Agent",
        "Directory outreach drafts",
        "Approval queue + deliverables vault",
        "250K AI tokens / month",
      ],
    },
    pro: {
      name: "Pro",
      price: 19.99,
      period: "month",
      cta: "Go Pro",
      featured: false,
      blurb: "Full management stack for serious independents & small labels.",
      features: [
        "Everything in Premium",
        "Cataba catalog + publishing prep",
        "Agency / Label workspace modes",
        "Priority model routing",
        "Full Academy + tutor",
        "1.5M AI tokens / month",
      ],
    },
  },

  products: [
    {
      id: "contracts",
      name: "Contract Builder",
      line: "Attorney-style drafts. Artist-approved.",
      body: "Split sheets, booking agreements, producer deals — guided by AI, locked behind your approval.",
      priceNote: "Included in Premium+",
    },
    {
      id: "epk",
      name: "EPK Builder",
      line: "Press kits that get you booked.",
      body: "Bios, assets, tech rider, and booking contact — generated from your Master Soul and catalog.",
      priceNote: "Included in Premium+",
    },
    {
      id: "directory",
      name: "Directory",
      line: "Blogs, playlists, venues, media.",
      body: "Search industry contacts, save prospects, and draft outreach — send only when you say so.",
      priceNote: "Search free · outreach paid",
    },
    {
      id: "academy",
      name: "Academy",
      line: "Learn it. Then execute it.",
      body: "Music-business courses with a tutor that turns lessons into tasks inside your workspace.",
      priceNote: "Starter free · full in Pro",
    },
    {
      id: "cataba",
      name: "Cataba",
      line: "Your catalog, cleaned for business.",
      body: "Upload discography, track splits/ISRC, and prep registration — the publishing layer of Agent.",
      priceNote: "Catalog free · agent in Pro",
    },
  ],

  specialists: [
    {
      name: "Master Agent",
      role: "Chief of staff",
      body: "Understands plain-language asks, runs PAL, and routes work — you never pick an agent first.",
    },
    {
      name: "Brand & EPK",
      role: "Identity & press",
      body: "Bios, EPK packages, brand voice, and press-ready assets from your Soul.md.",
    },
    {
      name: "Contracts & Business",
      role: "Legal ops (guided)",
      body: "Agreements, splits, LLC/PRO checklists — always human-approved before anything binds.",
    },
    {
      name: "Release & Distribution",
      role: "Release ops",
      body: "Metadata, 42-day calendars, DSP readiness, and delivery approval packets.",
    },
    {
      name: "Press & Outreach",
      role: "PR / playlist / radio",
      body: "Target lists and pitch drafts that sit in your approval queue until you send.",
    },
    {
      name: "Booking Manager",
      role: "Live & DJ",
      body: "Venue pitches, tech rider, availability, and inquiry pipeline.",
    },
    {
      name: "Finance Manager",
      role: "Money & royalties",
      body: "Budgets, royalty staging, and payout packets — never auto-pays.",
    },
  ],

  modes: [
    {
      id: "artist",
      name: "Artist",
      body: "Your career, catalog, and next release — one private workspace compiled around you.",
    },
    {
      id: "agency",
      name: "Agency",
      body: "Manage or market artists with shared templates, outreach, and approval workflows.",
    },
    {
      id: "label",
      name: "Label",
      body: "Roster, releases, rights hygiene, and partner reporting under one operating system.",
    },
  ],

  social: {
    instagram: "https://instagram.com/artispreneur",
    tiktok: "https://tiktok.com/@artispreneur",
    youtube: "https://youtube.com/@artispreneur",
  },
} as const;

export type Tier = keyof typeof brand.pricing;

/** ROSTR 5D phase palette — used in workspace / NPAO UI */
export const PHASE_COLORS = {
  PreD: "#8b7ff5",
  Design: "#4fb6e8",
  Development: "#f5c100",
  Deployment: "#4fd18b",
  Debugging: "#e8734f",
} as const;

export type Phase = keyof typeof PHASE_COLORS;

export const STATUS_COLORS = {
  ok: "#4fd18b",
  warn: "#f5c100",
  block: "#e0503a",
  info: "#4fb6e8",
  muted: "#8a857a",
} as const;
