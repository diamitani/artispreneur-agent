/** SaaS marketing content — industry voice for artists, labels, agencies, operators */

export const NAV_LINKS = [
  { href: "/features", label: "Product" },
  { href: "/skills", label: "Skills" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;

export const PROBLEM_PAINS = [
  {
    label: "01",
    title: "The business buries the music",
    body: "EPKs, venue pitches, split sheets, and street-date calendars live in twelve tabs — and none of them talk to each other.",
  },
  {
    label: "02",
    title: "Generic tools don't know your lane",
    body: "They don't know your genre, your boundaries, or when the record drops. Every answer starts from zero.",
  },
  {
    label: "03",
    title: "One wrong send costs trust",
    body: "Pitch emails and deal language need your eyes. Nothing leaves the building until you say so.",
  },
] as const;

export const SOLUTION_PILLARS = [
  {
    tag: "INTAKE",
    title: "Tell us who you are",
    body: "A short sit-down on your goals, genre, release plans, and hard lines. That becomes your operating profile — so the work sounds like you.",
  },
  {
    tag: "TEAM",
    title: "Run the business day",
    body: "Talk to your Agent like a manager. Specialists draft EPKs, outreach, splits, and release plans. You approve before anything ships.",
  },
  {
    tag: "SKILLS",
    title: "Add the playbooks you need",
    body: "Grab skill packs for press kits, deal review, 42-day releases, venue outreach, and more — then put them to work in your workspace.",
  },
] as const;

export const FEATURE_BLOCKS = [
  {
    id: "hermes",
    eyebrow: "Your Agent",
    title: "A manager-grade chief of staff",
    body: "Ask in plain language — book rooms, finish the EPK, stage the release. Your Agent routes the work, drafts the package, and waits for your approval before anything goes out.",
    points: [
      "Talk like you talk to a manager",
      "Specialists for press, deals, release, money",
      "Nothing sends without your say-so",
    ],
  },
  {
    id: "pal",
    eyebrow: "Your profile",
    title: "Setup that actually sticks",
    body: "Onboarding isn't a throwaway form. Your goals, brand voice, and boundaries become the brief every specialist works from — so you're not re-explaining yourself every session.",
    points: [
      "Artist profile + priorities locked in",
      "Full specialist team from day one",
      "Update the brief when the strategy changes",
    ],
  },
  {
    id: "skills",
    eyebrow: "Skills Marketplace",
    title: "Playbooks you can plug in",
    body: "Browse like a store. Add packs for EPKs, contract red flags, release calendars, venue outreach, royalties, and splits — free during launch.",
    points: [
      "EPK, deals, release, outreach, finance",
      "Install once, use every session",
      "Built for how the industry actually works",
    ],
  },
  {
    id: "aws",
    eyebrow: "Your workspace",
    title: "Private. Scoped. Yours.",
    body: "One workspace per artist — or a roster of them for agencies and labels. Files, drafts, and memory stay in your house. Staff only see what you assign.",
    points: [
      "Artist, agency, and label modes",
      "Approval queue with a clear trail",
      "Built for teams that move catalogs and careers",
    ],
  },
] as const;

export const SOCIAL_PROOF = [
  { value: "7", label: "Specialists on roster" },
  { value: "You", label: "Approve every send" },
  { value: "$0", label: "Starter forever" },
  { value: "EPK+", label: "Skills ready to install" },
] as const;

export const HOW_STEPS = [
  {
    num: "01 / SIGN UP",
    title: "Open your workspace",
    desc: "One account. One private house for the artist or the roster. No card to start.",
  },
  {
    num: "02 / BRIEF",
    title: "Tell us the story",
    desc: "Goals, genre, release plans, and boundaries — so the team works from your brief, not a generic prompt.",
  },
  {
    num: "03 / SETUP",
    title: "Walk into a ready room",
    desc: "Operating profile, first 30-day plan, and your specialist team — standing by in minutes.",
  },
  {
    num: "04 / RUN",
    title: "Work the business",
    desc: "Ask for the EPK, the pitch list, the split sheet. Specialists draft. You approve. Every move is logged.",
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
    desc: "Guided deal questionnaire → reviewed draft, plain-language clauses, red-flag checklist before you sign.",
    icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8",
  },
  {
    name: "EPK Builder",
    gate: "PRO",
    desc: "Bio variants, one-sheet, press release, asset checklist — press-ready kit for the room and the blog.",
    icon: "M12 2a10 10 0 100 20c1.1 0 2-.9 2-2v-.5c0-.3.2-.5.5-.5H17a3 3 0 000-6h-1.4A10 10 0 0012 2z",
  },
  {
    name: "Directory Outreach & CRM",
    gate: "PRO",
    desc: "Matched blogs, playlists, radio & venues. Personalized pitches and follow-ups — nothing sends until you approve.",
    icon: "M22 2L11 13 M22 2l-7 20-4-9-9-4z",
  },
  {
    name: "Academy Tutor",
    gate: "FREE",
    desc: "Courses that turn into execution: lessons become tasks on the right specialist's desk.",
    icon: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
  },
  {
    name: "Cataba Publishing & Catalog",
    gate: "PRO",
    desc: "Master catalog, split sheets, ISRC/UPC tracking, PRO registration checklists, release-readiness.",
    icon: "M9 18V5l12-2v13 M6 21a3 3 0 100-6 3 3 0 000 6z M18 19a3 3 0 100-6 3 3 0 000 6z",
  },
  {
    name: "Finance Manager",
    gate: "PRO",
    desc: "Budgets, invoices, statement staging, and money across DSP, sync, and shows — before it gets fuzzy.",
    icon: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  },
];

export const TRUST_POINTS = [
  "Research and drafts move on their own — sending never does.",
  "Every approval leaves a clear trail: who signed off, what went out, when.",
  "Your files, notes, and directory stays stay in your workspace — not a shared soup.",
];

export const MODE_CARDS = [
  {
    tag: "ARTIST",
    name: "Independent artist",
    desc: "One private workspace. A chief-of-staff Agent plus the specialists — press, deals, release, money — working your brief.",
    foot: "1 artist workspace",
  },
  {
    tag: "AGENCY",
    name: "Agency / management",
    desc: "Run a client roster from one command center. Staff roles, client workspaces, shared playbooks, and approvals that respect the artist.",
    foot: "Client workspaces · team seats",
  },
  {
    tag: "LABEL",
    name: "Label / operator",
    desc: "Release calendar, readiness scorecards, budgets, catalog and rights — while each artist keeps their own voice and boundaries.",
    foot: "Roster workspaces · ops capacity",
  },
];

export const PRICE_TOP = [
  {
    name: "Starter",
    sub: "Academy, Tutor Agent, directory browsing, and your first workspace — on us.",
    price: "$0",
    per: "forever",
    feats: [
      "Academy courses + Tutor Agent",
      "Light Agent for day-to-day asks",
      "Directory browsing",
      "Catalog upload on Cataba",
    ],
    cta: "Start free",
    featured: false,
    dark: false,
  },
  {
    name: "Workspace",
    sub: "The full business team. Every specialist, every skill, one command center.",
    price: "$79",
    per: "/month",
    feats: [
      "All 7 specialists + Master Agent",
      "Approval queue + activity trail",
      "Gmail, Drive, Sheets connections",
      "Priority jobs when the calendar is tight",
      "Bring your own model keys (optional)",
    ],
    cta: "Get the Workspace",
    featured: true,
    dark: true,
  },
  {
    name: "Agency & Label",
    sub: "Roster ops — staff roles, client houses, Director Agent, reporting.",
    price: "Custom",
    per: "per roster",
    feats: [
      "Agency Director / Roster Director",
      "Client artist workspaces",
      "Shared playbooks + weekly briefs",
      "SSO, exportable audit, dedicated capacity",
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
    sub: "Deal review checklists and exportable press kits — the toolkit most artists need first.",
  },
  {
    name: "Directory & Outreach",
    price: "$24",
    per: "/mo",
    sub: "Pitch lists, follow-ups, and a real CRM. Directory export available as a one-time download.",
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
    q: "Can the Agent send emails or publish without me?",
    a: "No. It can research, plan, and draft all day — but pitches, posts, spends, and signatures wait for your explicit approval. Every approval is logged.",
  },
  {
    q: "What is my operating profile?",
    a: "It's the brief your team works from — who you are, what you're chasing, how you sound, and what you won't do. Built from onboarding so you're not re-explaining yourself every time. You can update it when the strategy changes.",
  },
  {
    q: "Who is this for?",
    a: "Independent artists running their own careers. Managers and agencies with a client roster. Label and catalog operators who need release, rights, and outreach moving without losing artist voice.",
  },
  {
    q: "What are Skills?",
    a: "Skill packs are playbooks you add to your workspace — EPK builder, contract red flags, 42-day release plan, venue outreach, royalty staging, split sheets, and more. Free during launch. Install once; your Agent uses them when you ask.",
  },
  {
    q: "Is my work private?",
    a: "Yes. Your files, drafts, and notes stay in your workspace. On agency or label plans, staff only see the artist houses you assign — and artists keep their own boundaries.",
  },
  {
    q: "Is this legal or tax advice?",
    a: "No. Legal and finance specialists give education, templates, and checklists — clearly labeled. When it's time to sign or file, we tell you to bring in a qualified professional.",
  },
  {
    q: "Can agencies and labels run multiple artists?",
    a: "Yes. Agency and Label modes give you a command center, client or roster workspaces, shared playbooks, and approval routes that still respect each artist's voice.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. Starter is free forever. Upgrade to Workspace when you want the full specialist team and Skills power.",
  },
];
