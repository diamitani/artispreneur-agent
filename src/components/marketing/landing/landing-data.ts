/**
 * Content for the Artispreneur homepage.
 *
 * Kept separate from the components so copy can change without touching
 * layout. Pricing is deliberately NOT here — it comes from
 * `src/lib/constants.ts` (PRICING) so the homepage and /pricing can never
 * drift apart.
 */

export const NAV_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#how", label: "How it works" },
  { href: "#demo", label: "Live demo" },
  { href: "#pricing", label: "Pricing" },
] as const;

/**
 * Numbers shown under the hero. These are public claims, so the two that can
 * drift are computed from the source of truth in Landing.tsx rather than
 * typed here — see HERO_STATS usage.
 */
export const HERO_STAT_LABELS = {
  agents: "Agents in your roster",
  skills: "Documented agent skills",
  folders: "Workspace folders deployed",
  deploy: "From signup to workspace",
} as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell it who you are",
    body: "A short intake — your act, your genre, where you are in your career, what you are trying to get done this quarter. It compiles into your Soul file, the context every agent reads before it drafts anything.",
    surface: "Onboarding",
  },
  {
    step: "02",
    title: "Your workspace deploys",
    body: "We provision control-plane records, build your 17-folder workspace, bind agent compute, and install your agent with its knowledge base. You watch it happen step by step. It takes about a minute.",
    surface: "UserOps",
  },
  {
    step: "03",
    title: "Start delegating",
    body: "Ask in plain language. The agent routes to the right specialist, drafts the work, and drops it in your approval queue. Nothing sends, files, or publishes until you say so.",
    surface: "Workspace",
  },
] as const;

/** Product surfaces — these map to real routes in the app. */
export const PRODUCT_SURFACES = [
  {
    id: "business",
    title: "Business Center",
    body: "EIN, LLC, C-Corp, business banking, PRO registration, copyright, and DSP distribution — tracked as real tasks with real status, not a checklist you print out.",
    bullets: ["EIN & entity formation", "ASCAP / BMI / SoundExchange", "Business banking", "Copyright registration"],
    accent: "crimson",
  },
  {
    id: "brand",
    title: "Brand Center",
    body: "Your EPK, bios at every length, one-sheet, visual direction, and social content — all generated against your brand voice instead of a blank prompt box.",
    bullets: ["EPK builder", "Bio variants", "Content pillars", "Press-ready assets"],
    accent: "gold",
  },
  {
    id: "booking",
    title: "Booking Center",
    body: "Find rooms that book your style, draft the outreach, track the pipeline. Every pitch waits in your approval queue before it sends.",
    bullets: ["Venue research", "Outreach drafts", "Follow-up sequences", "CRM pipeline"],
    accent: "crimson",
  },
  {
    id: "academy",
    title: "Academy",
    body: "Music business courses that turn into agent tasks. Finish the PRO lesson, and the agent has your repertoire sheet ready to file.",
    bullets: ["Structured courses", "Progress tracking", "Lesson → task handoff", "Tutor agent"],
    accent: "gold",
  },
] as const;

/**
 * Roster shown on the homepage. Sourced from the Core Agents & Skills v1
 * spec — see `src/lib/agents/roster.ts` for the full skill inventory.
 */
export const AGENT_ROSTER = [
  {
    name: "Day to Day Manager",
    role: "Master agent — plans, delegates, follows up",
    master: true,
  },
  { name: "Publishing Manager", role: "PROs, royalties, catalogue, splits" },
  { name: "Finance Manager", role: "Banking, income tracking, P&L" },
  { name: "PR Manager", role: "Campaigns, press, social, advertising" },
  { name: "Booking Manager", role: "Gig discovery, outreach, booking CRM" },
  { name: "Legal Manager", role: "LLC & EIN formation, contracts" },
  { name: "Brand Manager", role: "Brand identity, EPK, website, merch" },
] as const;

export const TRUST_POINTS = [
  {
    title: "Approval-first, always",
    body: "Agents draft. You approve. Nothing leaves your workspace — no email, no pitch, no filing — without an explicit yes from you. Every action is logged.",
  },
  {
    title: "Your workspace is yours",
    body: "Every retrieval is filtered by workspace ID server-side. Cross-tenant access is denied at the storage layer, not by prompt instructions.",
  },
  {
    title: "Educational, not legal advice",
    body: "Contract and tax skills explain and prepare. They flag what needs a lawyer or an accountant instead of pretending to be one.",
  },
] as const;

export const FAQ = [
  {
    q: "What actually happens when I sign up?",
    a: "Your workspace deploys: control-plane records are created, a 17-folder storage structure is built, agent compute is bound, and your agent is installed with its knowledge base. You watch each step complete live. Then you land in your dashboard with a working agent.",
  },
  {
    q: "Do the agents do things without asking me?",
    a: "No. Every outgoing action passes through your approval queue. Agents write drafts into a pending folder; approving promotes them to sent. Nothing is sent, filed, or published on your behalf until you approve it.",
  },
  {
    q: "Is the free plan actually free?",
    a: "Yes — no credit card. You get the Master Agent, the Academy, one active project, and a fully deployed workspace, forever. Upgrade when you need the full specialist roster.",
  },
  {
    q: "Can it really file my LLC or register my PRO?",
    a: "It prepares everything and walks you through the filing — entity name checks, the operating agreement draft, your EIN path, your repertoire sheet. The submissions you make yourself, because they are legally yours to make.",
  },
  {
    q: "What happens to my music and my files?",
    a: "They live in your workspace under your account — masters, stems, artwork, contracts, statements. The agent reads them to do your work. They are never used to train models and never shared across accounts.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime, and you keep access through the end of the billing period. Your workspace and everything in it stays exportable.",
  },
] as const;

export const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "#product", label: "Product" },
      { href: "#how", label: "How it works" },
      { href: "#pricing", label: "Pricing" },
      { href: "/skills", label: "Skills marketplace" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/workspace", label: "Mission Control" },
      { href: "/agents", label: "Agents" },
      { href: "/features", label: "Features" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/for-agencies", label: "For agencies" },
      { href: "/for-labels", label: "For labels" },
      { href: "/faq", label: "FAQ" },
    ],
  },
] as const;

/** Seeded into the demo chat so a visitor always sees something useful first. */
export const DEMO_GREETING =
  "Hey — I'm the Artispreneur agent. Ask me anything about the business side of your music: PRO registration, distribution, setting up your LLC, sync licensing, taxes, or planning a release.";

export const DEMO_PROMPTS = [
  "How do I register with a PRO?",
  "Should I form an LLC for my music?",
  "Plan a release for my next single",
  "How does sync licensing actually pay?",
] as const;
