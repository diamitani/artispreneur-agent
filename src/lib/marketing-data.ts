/** SaaS marketing content — PAL site-spec + product source of truth */

export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/skills", label: "Skills" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
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
