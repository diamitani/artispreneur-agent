export const APP_NAME = "Artispreneur";
export const APP_TAGLINE = "Art Means Business.";
export const APP_DESCRIPTION =
  "Your AI music business team. Plan, create, and grow — with agents that draft, you approve.";

export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  about: "/about",
  agents: "/agents",
  contact: "/contact",
  terms: "/terms",
  privacy: "/privacy",
  signin: "/signin",
  signup: "/signup",
  onboarding: "/onboarding",
  deploy: "/deploy",
  dashboard: "/dashboard",
  projects: "/dashboard/projects",
  outputs: "/dashboard/outputs",
  knowledge: "/dashboard/knowledge",
  skills: "/dashboard/skills",
  chat: "/dashboard/chat",
  integrations: "/dashboard/integrations",
  settings: "/dashboard/settings",
  // Centers
  business: "/dashboard/business",
  brand: "/dashboard/brand",
  booking: "/dashboard/booking",
  academy: "/dashboard/academy",
  profile: "/dashboard/profile",
  // Outside the dashboard shell
  workspace: "/workspace",
  skillsMarketplace: "/skills",
  skillsLibrary: "/skills/library",
} as const;

export const BRAND = {
  name: "Artispreneur",
  domain: "artispreneur.com",
  email: { hello: "hello@artispreneur.com", support: "support@artispreneur.com" },
  social: {
    instagram: "https://instagram.com/artispreneur",
    tiktok: "https://tiktok.com/@artispreneur",
    youtube: "https://youtube.com/@artispreneur",
  },
} as const;

/**
 * Plan catalog — the single source of truth for pricing.
 *
 * Both the homepage and `/pricing` render from this, and the plan keys
 * (`starter` / `workspace` / `agency`) are the values stored on the user
 * profile in DynamoDB — see `src/types/user.ts`. Renaming a key is a data
 * migration; renaming a `name` is just copy.
 */
export const PRICING = {
  starter: {
    name: "Free",
    price: 0,
    period: "forever",
    cta: "Start Free",
    featured: false,
    description: "Meet your agent, take the Academy, and get your first workspace deployed.",
    features: [
      "Artispreneur Master Agent",
      "Academy courses + Tutor",
      "1 active project",
      "Basic knowledge vault",
      "Workspace auto-deployed on signup",
    ],
  },
  workspace: {
    name: "Artist",
    price: 9.99,
    period: "month",
    cta: "Start Artist",
    featured: true,
    description: "The full AI business team. Every agent, every skill, one command center.",
    features: [
      "All 8 specialist agents",
      "Unlimited projects",
      "Full knowledge vault + RAG",
      "Every skill in the marketplace",
      "Approval queue + audit log",
      "Composio integrations (Gmail, Drive, Sheets)",
      "Priority model access",
    ],
  },
  agency: {
    name: "Unlimited",
    price: 99,
    period: "month",
    cta: "Go Unlimited",
    featured: false,
    description: "Unlimited everything — built for power users, agencies, and labels.",
    features: [
      "Everything in Artist, unmetered",
      "Multi-artist workspaces",
      "Agency / Label Director Agent",
      "Shared playbooks + portfolio reporting",
      "Team roles + permissions",
      "SSO + audit export",
      "API access (apa_* keys)",
    ],
  },
} as const;

export type SpecialistId =
  | "master"
  | "brand-epk"
  | "publishing"
  | "contracts"
  | "release"
  | "content"
  | "press"
  | "booking"
  | "finance";

export type Specialist = {
  id: SpecialistId;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  mvp: boolean;
};

export const SPECIALISTS: Specialist[] = [
  {
    id: "master",
    name: "Day to Day Manager",
    role: "Master Agent / Artist COO",
    description:
      "Plans, clarifies, coordinates. Understands your goals, loads your context, and delegates work to the right specialist — so you never have to pick an agent yourself.",
    capabilities: [
      "Business strategy & planning",
      "Task coordination & routing",
      "Progress tracking",
      "Context-aware recommendations",
    ],
    mvp: true,
  },
  {
    id: "brand-epk",
    name: "Brand Manager",
    role: "Brand & Creative Direction",
    description:
      "Builds your bios, EPK, brand voice, visual briefs, and press-ready packages — all matched to your Soul.md.",
    capabilities: ["EPK assembly", "Bio variants", "Brand system", "Asset checklists"],
    mvp: true,
  },
  {
    id: "publishing",
    name: "Publishing Manager",
    role: "Rights & Royalty Operations",
    description:
      "Registers your works with PROs, audits for unclaimed royalties, builds your catalogue, and generates split sheets.",
    capabilities: ["PRO registration", "Royalty recovery", "Catalogue & metadata", "Split sheets"],
    mvp: true,
  },
  {
    id: "press",
    name: "PR Manager",
    role: "Campaigns, Press & Advertising",
    description:
      "Researches targets, drafts pitches, manages follow-ups — nothing sends without your approval.",
    capabilities: ["Media research", "Pitch drafts", "Playlist targeting", "Follow-up management"],
    mvp: true,
  },
  {
    id: "release",
    name: "Release Manager",
    role: "Distribution & Release Ops",
    description:
      "42-day calendars, metadata QC, DSP readiness, and delivery approval packets for every release.",
    capabilities: ["Release timelines", "Metadata review", "Distribution checklists", "Campaign calendars"],
    mvp: true,
  },
  {
    id: "content",
    name: "Content Producer",
    role: "Campaign Creative",
    description:
      "Short-form hooks, content matrices, campaign asset lists, and social strategies.",
    capabilities: ["Content calendars", "Hook scripts", "UGC briefs", "Campaign assets"],
    mvp: false,
  },
  {
    id: "booking",
    name: "Booking Manager",
    role: "Live & DJ Opportunities",
    description:
      "Venue research, tech riders, availability management, and booking pipeline.",
    capabilities: ["Venue outreach", "Tech riders", "Routing", "Pipeline management"],
    mvp: false,
  },
  {
    id: "finance",
    name: "Finance Manager",
    role: "Money & Royalties",
    description:
      "Budgets, royalty statement staging, revenue channel mapping, and payout approval packets.",
    capabilities: ["Budget sketches", "Royalty staging", "Revenue mapping", "Payout gates"],
    mvp: false,
  },
  {
    id: "contracts",
    name: "Legal Manager",
    role: "Legal Ops & Business Formation",
    description:
      "Split sheets, agreement drafts, LLC/PRO checklists — always educational, always human-approved.",
    capabilities: ["Split sheets", "Contract review", "PRO setup", "Entity formation"],
    mvp: false,
  },
];
