/** Content for the "Artispreneur Landing v0" design (imported from Claude Design). */

export const NAV_LINKS = [
  { href: "#pillars", label: "Formation" },
  { href: "#demo", label: "Agent" },
  { href: "#ecosystem", label: "Academy" },
  { href: "#pricing", label: "Pricing" },
] as const;

export const HERO_CHECKS = [
  "Legal Registration",
  "P.R.O. Setup",
  "Business Banking",
  "AI Manager",
  "Contracts",
] as const;

export const FEATURE_TILES = [
  { glyph: "B", color: "var(--lv0-red)", title: "Business Registration", body: "EIN, LLC, C-Corp, Sole Prop" },
  { glyph: "P", color: "var(--lv0-gold)", title: "P.R.O. Registration", body: "ASCAP, BMI, SoundExchange" },
  { glyph: "$", color: "#22c55e", title: "Business Bank Account", body: "Mercury, Brex, local banks" },
  { glyph: "C", color: "#3b82f6", title: "Contracts", body: "Templates & AI red-flag review" },
  { glyph: "D", color: "#8b5cf6", title: "Directory", body: "Industry contacts database" },
  { glyph: "E", color: "#f59e0b", title: "EPK Builder", body: "Press kits that get you booked" },
  { glyph: "M", color: "var(--lv0-red)", title: "Artist Catalogue", body: "Songs, metadata, splits" },
  { glyph: "A", color: "var(--lv0-gold)", title: "AI Agent Workspace", body: "Knowledge base & automations" },
] as const;

export const PILLARS = [
  { icon: "◆", title: "AI Assistant Manager", body: "Your personal AI team handles day-to-day operations and strategic management." },
  { icon: "▤", title: "Artist Business Plan", body: "Generate marketing, sales, operational models, and financial projections." },
  { icon: "➔", title: "Artist Roadmap", body: "A clear timeline and steps to execute your releases and business goals." },
  { icon: "◈", title: "Brand & Identity", body: "Build your EPK, bio one-sheeter, and visual identity seamlessly." },
] as const;

export const LEGAL_LIST = [
  "Legal Business Registration (LLC/C-Corp)",
  "Business Banking Setup",
  "Connect to Plaid",
  "Upload statements & transactions",
] as const;

export const LEGAL_CARDS = [
  { icon: "§", title: "Legal Formation", body: "Register your EIN, LLC, or C-Corp entirely online through our platform." },
  { icon: "\u{1F3E6}", title: "Business Accounts", body: "Instant banking setup via partner integrations after EIN approval." },
  { icon: "\u{1F4C8}", title: "Financial Ledger (P&L)", body: "Track income and expenses natively. Connect bank feeds via Plaid." },
  { icon: "◐", title: "Finance & Tax Assistant", body: "AI categorizes your spending and prepares you for tax season automatically." },
] as const;

export const RIGHTS_CARDS = [
  {
    icon: "\u{1F6E1}",
    title: "P.R.O. & Royalties",
    items: [
      "Register with P.R.O.s (ASCAP/BMI)",
      "Track royalties across DSPs",
      "Claim unclaimed tracks & royalties",
      "Generate dynamic split sheets",
    ],
  },
  {
    icon: "♪",
    title: "Catalog & Contracts",
    items: [
      "Upload songs & extract metadata",
      "Manage and share your catalog",
      "Field requests for sync & collabs",
      "Review, create, and send contracts",
    ],
  },
  {
    icon: "◎",
    title: "Directory & CRM",
    items: [
      "Curated industry contacts database",
      "AI-assisted outreach copywriting",
      "Track relationships and campaigns",
      "Host EPKs and send pitches directly",
    ],
  },
] as const;

export const ECOSYSTEM_CARDS = [
  {
    href: "#demo",
    color: "var(--lv0-red)",
    icon: "◆",
    title: "The AI Assistant",
    body: "Context-aware AI manager that handles day-to-day tasks, from split sheets to bookkeeping.",
    go: "How it works →",
  },
  {
    href: "https://academy.artispreneur.com",
    external: true,
    color: "var(--lv0-gold)",
    icon: "\u{1F4D6}",
    title: "The Academy",
    body: "High-fidelity, cinematic courses designed to turn independent artists into successful entrepreneurs.",
    go: "Start Learning →",
  },
  {
    href: "https://directory.artispreneur.com",
    external: true,
    color: "#fff",
    icon: "\u{1F399}",
    title: "Media Network",
    body: "News, interviews, podcasts, and deep dives into the modern music industry.",
    go: "Read & Watch →",
  },
] as const;

export const PRICE_CARDS = [
  {
    name: "Free",
    amount: "$0",
    per: "/forever",
    desc: "Gemini Flash credits included. All 6 agents, academy, directory.",
    feats: ["All 6 AI agents", "Gemini API credits", "1,000 messages/month", "16 courses · 307 modules", "183 contact directory"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "BYOK",
    amount: "$0",
    per: " + your key",
    desc: "Connect OpenAI, Anthropic, Groq, or Ollama. Unlimited usage.",
    feats: ["Everything in Free", "Unlimited messages", "Google Drive sync", "Signal/Wire messaging", "Any LLM provider"],
    cta: "Start with BYOK",
    featured: true,
  },
  {
    name: "Pro",
    amount: "$29",
    per: "/month",
    desc: "Managed compute. Dedicated agent instance. Priority support.",
    feats: ["Everything in BYOK", "Managed LLM compute", "Advanced analytics", "Priority support", "Team collaboration"],
    cta: "Go Pro",
    featured: false,
  },
] as const;

export const FOOTER_LINKS = [
  { href: "#pillars", label: "Formation" },
  { href: "#demo", label: "Agent" },
  { href: "#ecosystem", label: "Academy" },
  { href: "https://directory.artispreneur.com", label: "Directory", external: true },
  { href: "https://contracts.artispreneur.com", label: "Contracts", external: true },
  { href: "/api/auth/login?return=/workspace", label: "Dashboard" },
  { href: "#pricing", label: "Pricing" },
] as const;

type ChatMessage = { role: "agent" | "user"; html: string };

export const CHAT_WELCOME: ChatMessage = {
  role: "agent",
  html: "\u{1F44B} Hey! I'm your Artispreneur agent.<br><br>I can help you with:<br>• Registering songs with your PRO<br>• Distribution strategy<br>• Music licensing opportunities<br>• Setting up your LLC<br>• Business taxes & finance<br>• Building your brand<br><br>What do you want to work on?",
};

export const CHAT_RESPONSES: Record<string, string> = {
  pro: "Great question about PROs! Here's what I can do:<br><br>1️⃣ Register you with ASCAP, BMI, or SESAC as a writer and publisher<br>2️⃣ Register your songs with correct metadata and splits<br>3️⃣ Track royalty payments quarterly<br>4️⃣ Create professional splitsheets for collaborators<br><br>Want me to get started on any of these?",
  distribut: "For distribution, I recommend comparing:<br><br>• UnitedMasters — keeps 100% royalties<br>• CD Baby — one-time fee, wide reach<br>• DistroKid — unlimited uploads<br>• TuneCore — publishing admin included<br><br>What kind of release are you planning?",
  license: "Sync licensing is a great revenue stream!<br><br>1️⃣ Build your catalog with proper metadata<br>2️⃣ Identify music supervisors in your genre<br>3️⃣ Create tailored pitch templates<br>4️⃣ Submit to libraries like Musicbed, Artlist, Pond5<br><br>Want me to start researching opportunities?",
  llc: "Setting up an LLC is smart for protecting your assets. I can:<br><br>1️⃣ Walk you through name selection<br>2️⃣ File formation documents with your state<br>3️⃣ Draft your Operating Agreement<br>4️⃣ Register for your EIN with the IRS<br><br>Which state are you in?",
  tax: "Music business taxes can be complex. Here's what I'll help with:<br><br>• Track all music income (streaming, shows, sync)<br>• Identify deductible expenses<br>• File Schedule C with quarterly estimates<br>• Stay compliant year-round<br><br>Want me to analyze your current setup?",
  promot: "Let's build your promotion strategy:<br><br>1️⃣ Social media content calendar<br>2️⃣ Playlist pitching (Spotify, Apple Music)<br>3️⃣ Blog and press outreach<br>4️⃣ Collaborative posts with other artists<br><br>What's your next release?",
  default: "I can help with all of this:<br><br>\u{1F3B5} Register with a PRO (BMI/ASCAP/SESAC)<br>\u{1F4C0} Distribute to streaming platforms<br>\u{1F3AC} License music for TV, film, games<br>⚖️ Set up your LLC and business contracts<br>\u{1F4B0} Manage taxes and finances<br>\u{1F4E3} Build promotion strategies<br><br>What would you like to work on first?",
};

export const CHAT_FOLLOWUP_HTML =
  'Ready to get started for real? <a href="/api/auth/login?signup=1&return=/onboarding" class="lv0-chat-cta">Create your free workspace →</a>';
