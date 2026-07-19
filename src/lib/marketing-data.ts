/** SaaS marketing content — PAL site-spec + product source of truth */

export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/skills", label: "Skills" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;

export const PROBLEM_PAINS = [
  {
    label: "01",
    title: "Ops bury the music",
    body: "EPKs, outreach, splits, and release calendars live in twelve tabs — none of them talk to each other.",
  },
  {
    label: "02",
    title: "Generic AI forgets you",
    body: "Chatbots don't know your genre, boundaries, or release date. Every answer starts from zero.",
  },
  {
    label: "03",
    title: "One wrong send costs trust",
    body: "Pitch emails and deal language need a human gate. Autonomy without approval is a liability.",
  },
] as const;

export const SOLUTION_PILLARS = [
  {
    tag: "PAL",
    title: "Compile your intent",
    body: "Short onboarding becomes a Master Soul, roster, and NPAO plan — not a generic prompt.",
  },
  {
    tag: "HERMES",
    title: "Run the business day",
    body: "Chat with your chief of staff on Bedrock DeepSeek. Specialists draft; you approve.",
  },
  {
    tag: "SKILLS",
    title: "Install real playbooks",
    body: "Marketplace packs drop into your vault and activate in Hermes — EPK, release, outreach, rights.",
  },
] as const;

export const FEATURE_BLOCKS = [
  {
    id: "hermes",
    eyebrow: "Hermes Agent",
    title: "A manager-grade chief of staff",
    body: "Ask in plain language. Hermes routes to the right specialist, drafts the artifact, and waits for your approval before anything ships.",
    points: [
      "Bedrock DeepSeek on Artispreneur infra",
      "Soul + roster + Skills in every turn",
      "Workspace apa_* keys + usage ledger",
    ],
  },
  {
    id: "pal",
    eyebrow: "PAL / ROSTR",
    title: "Onboarding that becomes an OS",
    body: "PAL compiles your answers into soul.md, artist profile, specialist roster, and a first NPAO plan — the runtime brain for Hermes.",
    points: [
      "Soft-gate Mission Control",
      "7 specialist agents day one",
      "Recompile when goals change",
    ],
  },
  {
    id: "skills",
    eyebrow: "Skills Library",
    title: "Capability packs you can install",
    body: "Browse like a store. Claim free packs at launch. Install into Hermes so playbooks load on every chat.",
    points: [
      "EPK, contracts, release, outreach, finance",
      "Stripe + HubSpot ready for paid",
      "AWS hub vault under your instance",
    ],
  },
  {
    id: "aws",
    eyebrow: "AWS Instance",
    title: "Multi-tenant by design",
    body: "Diamitani → Artispreneur → Agent → your Cognito user → project workspace. Hub on S3, control plane on DynamoDB USER#.",
    points: [
      "Cognito OAuth (not Mantle)",
      "Hierarchical Rostr Hub paths",
      "Approval-first audit posture",
    ],
  },
] as const;

export const SOCIAL_PROOF = [
  { value: "7", label: "Specialist agents" },
  { value: "PAL", label: "Compiled Soul runtime" },
  { value: "$0", label: "Starter forever" },
  { value: "0", label: "Sends without approval" },
] as const;

export const HOW_STEPS = [
  {
    num: "01 / SIGN UP",
    title: "Create your account",
    desc: "One account, one private workspace. No credit card to start.",
  },
  {
    num: "02 / PAL INTAKE",
    title: "Answer a short questionnaire",
    desc: "Your goals, genre, release plans, and boundaries — compiled into your operating profile.",
  },
  {
    num: "03 / SOUL.MD",
    title: "Your workspace is provisioned",
    desc: "soul.md, artist profile, a first-30-days plan, and your agent team — generated in minutes.",
  },
  {
    num: "04 / BUILD",
    title: "Work with your team",
    desc: "Ask for anything. Specialists draft; you approve. Every action is logged.",
  },
];

export const AGENT_CARDS = [
  {
    name: "Legal Business Setup",
    gate: "CORE",
    desc: "LLC vs sole prop education, EIN prep, business bank checklist, contractor onboarding.",
    icon: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
  },
  {
    name: "Contract Agent",
    gate: "PRO",
    desc: "Guided deal questionnaire → reviewed contract draft, plain-language clause explanations, red-flag checklist.",
    icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8",
  },
  {
    name: "EPK Builder",
    gate: "PRO",
    desc: "Bio variants, one-sheet, press release, asset completeness scoring, exportable web + PDF EPK.",
    icon: "M12 2a10 10 0 100 20c1.1 0 2-.9 2-2v-.5c0-.3.2-.5.5-.5H17a3 3 0 000-6h-1.4A10 10 0 0012 2z",
  },
  {
    name: "Directory Outreach & CRM",
    gate: "PRO",
    desc: "Matched blogs, playlists, radio & venues. Personalized pitches, follow-ups, and a real CRM — approval-gated.",
    icon: "M22 2L11 13 M22 2l-7 20-4-9-9-4z",
  },
  {
    name: "Academy Tutor",
    gate: "FREE",
    desc: "Interactive courses that turn into execution: lessons become tasks assigned to the right agent.",
    icon: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
  },
  {
    name: "Cataba Publishing & Catalog",
    gate: "PRO",
    desc: "Master catalog, split sheets, ISRC/UPC tracking, PRO registration checklists, release-readiness reports.",
    icon: "M9 18V5l12-2v13 M6 21a3 3 0 100-6 3 3 0 000 6z M18 19a3 3 0 100-6 3 3 0 000 6z",
  },
  {
    name: "Finance Manager",
    gate: "PRO",
    desc: "Budgets, invoices, statement organization, and revenue-channel tracking across DSP, sync, and shows.",
    icon: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  },
];

export const TRUST_POINTS = [
  "Drafting, research, and planning run autonomously — sending never does.",
  "Every approval creates an immutable audit record: who, what, when, where.",
  "Your files, memory, and directory data are scoped to your workspace only.",
];

export const MODE_CARDS = [
  {
    tag: "ARTIST",
    name: "My Artispreneur Agent",
    desc: "One private workspace. A Master Agent that acts like a manager-grade chief of staff, plus the full specialist roster.",
    foot: "1 workspace · pooled compute",
  },
  {
    tag: "AGENCY",
    name: "Agency Director",
    desc: "A portfolio command center. Staff roles, client artist workspaces, shared playbooks, client-approval routes, weekly operating briefs.",
    foot: "N client workspaces · priority queues",
  },
  {
    tag: "LABEL",
    name: "Roster Director",
    desc: "Roster release calendar, readiness scorecards, budgets, catalog & rights vault — while every artist keeps their own voice and boundaries.",
    foot: "roster workspaces · reserved capacity",
  },
];

export const PRICE_TOP = [
  {
    name: "Starter",
    sub: "Academy + Tutor Agent, directory browsing, your first workspace.",
    price: "$0",
    per: "forever",
    feats: [
      "Academy courses + Tutor Agent",
      "Master Agent (light model)",
      "Directory browsing",
      "Catalog upload on Cataba",
    ],
    cta: "Start free",
    featured: false,
    dark: false,
  },
  {
    name: "Workspace",
    sub: "The full AI business team. Every agent, every skill, one command center.",
    price: "$79",
    per: "/month",
    feats: [
      "All 7 specialist agents + Master Agent",
      "Approval queue + audit log",
      "Full Composio integrations (Gmail, Drive, Sheets)",
      "Priority jobs + larger models",
      "BYOK supported",
    ],
    cta: "Get the Workspace",
    featured: true,
    dark: true,
  },
  {
    name: "Agency & Label",
    sub: "Organization hub, staff roles, client workspaces, and the Director agent.",
    price: "Custom",
    per: "per roster",
    feats: [
      "Agency Director / Roster Director",
      "Client artist workspaces",
      "Shared playbooks + reporting",
      "SSO, audit export, dedicated compute options",
    ],
    cta: "Talk to us",
    featured: false,
    dark: false,
  },
];

export const PRICE_BOTTOM = [
  {
    name: "Contract Agent + EPK Builder",
    price: "$29",
    per: "/mo",
    sub: "The Pro Toolkit. Guided contracts, red-flag checklists, exportable web + PDF EPKs.",
  },
  {
    name: "Directory & Outreach",
    price: "$24",
    per: "/mo",
    sub: "Outreach Agent + CRM. Directory download available as a $20 one-time export.",
  },
  {
    name: "Cataba Publishing Agent",
    price: "$24",
    per: "/mo",
    sub: "Split sheets, ISRC/UPC prep, PRO registration checklists. Catalog upload stays free.",
  },
];

export const COURSE_CHIPS = [
  "Copyright Your Music",
  "Register with a PRO",
  "How to License Your Music",
  "Incorporate Your Brand",
  "Music Streaming Guide",
  "PR Email Campaigns",
];

export const FAQS = [
  {
    q: "Can the agents send emails or publish without me?",
    a: "No. Agents research, plan, and draft autonomously — but sending messages, publishing, spending money, and signing documents always require your explicit approval. Every approval is logged in an immutable audit record.",
  },
  {
    q: "What is soul.md?",
    a: "It's your operating profile — identity, goals, brand voice, boundaries, and current priorities — generated from your PAL onboarding answers. Hermes and every specialist read it before working for you, so nothing you get back is generic. You can recompile anytime.",
  },
  {
    q: "What is Hermes?",
    a: "Hermes is the Master Agent runtime inside Agent by Artispreneur. It runs on Amazon Bedrock (DeepSeek), loads your PAL-compiled Soul, specialist roster, and installed Skills Library packs, then drafts work for your approval.",
  },
  {
    q: "How do Skills work?",
    a: "Skills are digital playbooks in the marketplace. Claim or purchase a pack, install it into your library, and Hermes injects the SKILL.md protocol into chat. Free during launch.",
  },
  {
    q: "Is my workspace on AWS?",
    a: "Yes. Identity is Cognito. Your hub (Soul, skills, usage) lives under the Diamitani → Artispreneur → Agent hierarchy on the instance hub (S3 in production, local fs in dev). Control plane records use DynamoDB USER# keys.",
  },
  {
    q: "Is this legal or tax advice?",
    a: "No. The Legal Business Setup and Contract agents provide education, templates, and checklists — clearly labeled as informational. For signatures and filings we recommend qualified professionals, and the agents will tell you when to bring one in.",
  },
  {
    q: "Who can see my files and data?",
    a: "Only you. Every file, memory, and retrieval is scoped to your workspace. In Agency and Label modes, staff see only the artist workspaces explicitly assigned to them — and artists always keep their own boundary.",
  },
  {
    q: "Can I bring my own model keys?",
    a: "Yes. Paid plans support BYOK through encrypted secrets storage. Your usage is marked accordingly, but workspace safety rules, action limits, and audit logging still apply. Platform Bedrock credentials are never shared with customers.",
  },
];
