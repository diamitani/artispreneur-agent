export const APP_NAME = "Artispreneur";
export const APP_TAGLINE = "Art Means Business.";
export const APP_DESCRIPTION =
  "Your AI music business team. Plan, create, and grow — with agents that draft, you approve.";

export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  about: "/about",
  agents: "/agents",
  signin: "/signin",
  signup: "/signup",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  projects: "/dashboard/projects",
  outputs: "/dashboard/outputs",
  knowledge: "/dashboard/knowledge",
  skills: "/dashboard/skills",
  chat: "/dashboard/chat",
  settings: "/dashboard/settings",
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

export const PRICING = {
  starter: {
    name: "Starter",
    price: 0,
    period: "forever",
    cta: "Start Free",
    featured: false,
    description: "Academy + Tutor Agent, directory browsing, your first workspace.",
    features: [
      "Artispreneur Master Agent (light model)",
      "Academy courses + Tutor",
      "1 active project",
      "Basic knowledge vault",
      "Community support",
    ],
  },
  workspace: {
    name: "Workspace",
    price: 79,
    period: "month",
    cta: "Get the Workspace",
    featured: true,
    description: "The full AI business team. Every agent, every skill, one command center.",
    features: [
      "All specialist agents + Master Agent",
      "Unlimited projects",
      "Full knowledge vault + RAG",
      "Skills marketplace access",
      "Approval queue + audit log",
      "Composio integrations (Gmail, Drive, Sheets)",
      "Priority model access",
      "API access (apa_* keys)",
    ],
  },
  agency: {
    name: "Agency & Label",
    price: null,
    period: "per roster",
    cta: "Talk to Us",
    featured: false,
    description: "Organization hub, staff roles, client workspaces, and the Director agent.",
    features: [
      "Agency/Label Director Agent",
      "Multi-artist workspaces",
      "Shared playbooks + templates",
      "Portfolio reporting",
      "Team roles + permissions",
      "SSO + audit export",
      "Dedicated compute options",
    ],
  },
} as const;

export type SpecialistId =
  | "master"
  | "epk-brand"
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
    name: "Artispreneur Agent",
    role: "Your AI Chief of Staff",
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
    id: "epk-brand",
    name: "Brand & EPK",
    role: "Identity & Press Kit",
    description:
      "Builds your bios, EPK, brand voice, visual briefs, and press-ready packages — all matched to your Soul.md.",
    capabilities: ["EPK assembly", "Bio variants", "Brand system", "Asset checklists"],
    mvp: true,
  },
  {
    id: "press",
    name: "PR & Outreach",
    role: "Media, Playlist & Radio",
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
    name: "Contracts & Business",
    role: "Legal Ops (Guided)",
    description:
      "Split sheets, agreement drafts, LLC/PRO checklists — always educational, always human-approved.",
    capabilities: ["Split sheets", "Contract review", "PRO setup", "Entity formation"],
    mvp: false,
  },
];
