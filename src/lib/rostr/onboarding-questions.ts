/**
 * PAL Intake Questionnaire — Agent by Artispreneur
 *
 * Product rule: every question must feed Master Soul.md, Workspace Config,
 * or specialist roster activation. No vanity fields.
 *
 * Progressive disclosure: 4 steps → ~14 questions max.
 * Soft gate: incomplete answers still compile a draft Soul with gaps listed.
 */

export type Mode = "artist" | "agency" | "label";
export type FieldType = "text" | "textarea" | "select" | "multiselect" | "chips";

export type OnboardingField = {
  id: string;
  label: string;
  help?: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Maps into PAL L1 / Workspace Config Object */
  mapsTo: string;
};

export type OnboardingStep = {
  id: string;
  title: string;
  subtitle: string;
  npao: "N" | "A" | "P" | "O";
  fields: OnboardingField[];
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "identity",
    title: "Who you are",
    subtitle: "This becomes your artist identity in Master Soul.md — the file every agent reads first.",
    npao: "N",
    fields: [
      {
        id: "legal_name",
        label: "Legal / account name",
        type: "text",
        required: true,
        placeholder: "Patrick Diamitani",
        mapsTo: "artist_profile.legal_name",
      },
      {
        id: "stage_name",
        label: "Stage / brand name",
        type: "text",
        required: true,
        placeholder: "Patrick Diamitani",
        mapsTo: "artist_profile.stage_name",
      },
      {
        id: "mode",
        label: "What are you building as?",
        help: "Locks which product surfaces and specialist agents activate first.",
        type: "select",
        required: true,
        options: [
          { value: "artist", label: "Artist — my own career & catalog" },
          { value: "agency", label: "Agency — I manage or market artists" },
          { value: "label", label: "Label — roster, releases, rights" },
        ],
        mapsTo: "workspace.mode",
      },
      {
        id: "location",
        label: "Home base (city / market)",
        type: "text",
        required: true,
        placeholder: "Chicago, IL",
        mapsTo: "artist_profile.location",
      },
      {
        id: "genres",
        label: "Primary genres / sound",
        help: "Used for EPK copy, playlist pitches, and sync taxonomy.",
        type: "chips",
        required: true,
        placeholder: "hip-hop, EDM, future bass",
        options: [
          { value: "hip-hop", label: "Hip-hop" },
          { value: "edm", label: "EDM" },
          { value: "rnb", label: "R&B" },
          { value: "pop", label: "Pop" },
          { value: "electronic", label: "Electronic" },
          { value: "indie", label: "Indie" },
          { value: "afrobeats", label: "Afrobeats" },
          { value: "latin", label: "Latin" },
          { value: "country", label: "Country" },
          { value: "jazz", label: "Jazz" },
        ],
        mapsTo: "artist_profile.genres",
      },
    ],
  },
  {
    id: "stage",
    title: "Where you are",
    subtitle: "Business stage drives NPAO priority — we won't ask a first-release artist to run a label finance stack.",
    npao: "N",
    fields: [
      {
        id: "career_stage",
        label: "Career stage",
        type: "select",
        required: true,
        options: [
          { value: "starting", label: "Starting — little or no catalog yet" },
          { value: "emerging", label: "Emerging — releasing, building audience" },
          { value: "growing", label: "Growing — consistent releases / bookings" },
          { value: "established", label: "Established — income + team / roster" },
        ],
        mapsTo: "artist_profile.career_stage",
      },
      {
        id: "monthly_listeners",
        label: "Approx. monthly listeners (all platforms)",
        type: "select",
        required: false,
        options: [
          { value: "0-1k", label: "Under 1K" },
          { value: "1k-10k", label: "1K – 10K" },
          { value: "10k-50k", label: "10K – 50K" },
          { value: "50k-250k", label: "50K – 250K" },
          { value: "250k+", label: "250K+" },
          { value: "unknown", label: "Not sure yet" },
        ],
        mapsTo: "artist_profile.reach.monthly_listeners",
      },
      {
        id: "primary_goal_90d",
        label: "One primary goal for the next 90 days",
        help: "Pick the outcome that would make this quarter a win. Agents optimize for this first.",
        type: "select",
        required: true,
        options: [
          { value: "release", label: "Ship a single / EP with a real campaign" },
          { value: "rights", label: "Get rights, splits, and PRO setup clean" },
          { value: "booking", label: "Land paid shows / DJ bookings" },
          { value: "press", label: "Get press, blogs, or playlist placements" },
          { value: "brand", label: "Lock brand, EPK, and story" },
          { value: "money", label: "Open a new revenue channel (sync, merch, services)" },
          { value: "ops", label: "Set up the business (LLC, contracts, systems)" },
        ],
        mapsTo: "goals.primary_90d",
      },
      {
        id: "success_metric",
        label: "How will you know it worked? (one measurable win)",
        type: "textarea",
        required: true,
        placeholder: "e.g. Release Midnight Circuit Aug 29 with EPK ready and 3 warm booking leads",
        mapsTo: "goals.success_metric",
      },
    ],
  },
  {
    id: "voice",
    title: "How you show up",
    subtitle: "Brand voice + approval rules. Specialists draft freely; you stay in control of what ships.",
    npao: "A",
    fields: [
      {
        id: "voice_words",
        label: "3 words for your brand voice",
        type: "text",
        required: true,
        placeholder: "nocturnal, confident, cinematic",
        mapsTo: "brand.voice_words",
      },
      {
        id: "bio_short",
        label: "Short bio (2–3 sentences) — or leave blank and we'll draft from the rest",
        type: "textarea",
        required: false,
        placeholder:
          "Chicago hip-hop/EDM producer-DJ. Sound rooted in electronic crossover, lyric-driven rap, and club energy. Building Diamitani Music as a rights-first independent label.",
        mapsTo: "brand.bio_short",
      },
      {
        id: "do_not",
        label: "What should agents never say or do?",
        help: "Guardrails go straight into Master Soul.md.",
        type: "textarea",
        required: false,
        placeholder: "No hype language. No promising playlist adds. Never send outreach without my approval.",
        mapsTo: "brand.do_not",
      },
      {
        id: "approval_policy",
        label: "Default approval policy",
        type: "select",
        required: true,
        options: [
          {
            value: "approval_required",
            label: "Approval-first — draft everything; I approve before send/publish",
          },
          {
            value: "draft_and_queue",
            label: "Draft & queue — agents prepare; I batch-approve weekly",
          },
          {
            value: "autonomous_safe",
            label: "Autonomous on safe tasks only (research, drafts, internal notes)",
          },
        ],
        mapsTo: "permissions.default_mode",
      },
    ],
  },
  {
    id: "ops",
    title: "What to activate",
    subtitle: "We activate a focused specialist roster — not every agent on day one.",
    npao: "P",
    fields: [
      {
        id: "priority_surfaces",
        label: "Which outcomes do you want help with first?",
        type: "multiselect",
        required: true,
        options: [
          { value: "epk_brand", label: "EPK & brand assets" },
          { value: "contracts", label: "Contracts, splits, business setup" },
          { value: "release", label: "Release & distribution planning" },
          { value: "content", label: "Content & short-form campaigns" },
          { value: "press", label: "Press / playlist / radio outreach" },
          { value: "booking", label: "Booking & live opportunities" },
          { value: "finance", label: "Royalties, budgets, money tracking" },
        ],
        mapsTo: "roster.priority_surfaces",
      },
      {
        id: "next_release",
        label: "Next release (title + target window) — optional",
        type: "text",
        required: false,
        placeholder: "Midnight Circuit — Aug 29, 2026",
        mapsTo: "release_plan.next",
      },
      {
        id: "links",
        label: "Links we should know (Spotify, IG, site) — one per line",
        type: "textarea",
        required: false,
        placeholder: "https://diamitani-music.vercel.app/\nhttps://open.spotify.com/artist/...",
        mapsTo: "artist_profile.links",
      },
      {
        id: "open_prompt",
        label: "Anything else the Master Agent should know?",
        help: "Freeform intent — PAL compiles this into constraints and desired outputs.",
        type: "textarea",
        required: false,
        placeholder: "Building Diamitani Music as an AI-enabled label. Need rights hygiene before any sync pitching.",
        mapsTo: "intent.freeform",
      },
    ],
  },
];

/** Patrick Diamitani — demo / default seed for product previews */
export const PATRICK_DEMO_ANSWERS: Record<string, string | string[]> = {
  legal_name: "Patrick Diamitani",
  stage_name: "Patrick Diamitani",
  mode: "label",
  location: "Chicago, IL",
  genres: ["hip-hop", "edm", "electronic"],
  career_stage: "growing",
  monthly_listeners: "1k-10k",
  primary_goal_90d: "release",
  success_metric:
    "Ship Midnight Circuit (single) with rights-complete assets, EPK ready, and a 42-day campaign live by Aug 29, 2026",
  voice_words: "nocturnal, confident, cinematic",
  bio_short:
    "Chicago hip-hop/EDM producer-DJ and founder of Diamitani Music. Sound rooted in electronic crossover, lyric-driven rap, and club energy. Building a rights-first independent label that scales catalog like a technology company.",
  do_not:
    "No hype. No promising editorial playlist adds, sync placements, or stream counts. Never distribute, license, or send outreach without named approval. Never invent ownership or splits.",
  approval_policy: "approval_required",
  priority_surfaces: ["epk_brand", "contracts", "release", "press", "booking"],
  next_release: "Midnight Circuit — Aug 29, 2026",
  links: "https://diamitani-music.vercel.app/",
  open_prompt:
    "Operate Diamitani Music as holding + divisions. Priority is rights hygiene, then release ops, then sync pipeline. I am the founder and principal artist.",
};
