/**
 * Skills Marketplace catalog — digital skill packs for Agent workspaces.
 * Prices are $0 during launch (SKILLS_FORCE_FREE / priceCents: 0).
 * Stripe + HubSpot ready when prices go live.
 *
 * Installed packs activate in Hermes runtime (PAL / ROSTR + Bedrock).
 */

import type { SpecialistId } from "@/lib/rostr/specialists";

export type SkillCategory =
  | "epk"
  | "legal"
  | "release"
  | "outreach"
  | "finance"
  | "brand"
  | "academy";

export type SkillProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: SkillCategory;
  /** Display price in USD; 0 = free */
  priceCents: number;
  /** Future Stripe Price ID when not using price_data */
  stripePriceId?: string;
  includes: string[];
  format: "SKILL.md pack" | "Workflow + templates" | "Playbook + prompts";
  fileSize: string;
  version: string;
  agent: string;
  /** ROSTR specialist this skill routes to when active in Hermes */
  specialistId: SpecialistId;
  featured?: boolean;
  popular?: boolean;
  badge?: string;
};

export const SKILL_CATEGORIES: { id: SkillCategory | "all"; label: string }[] = [
  { id: "all", label: "All skills" },
  { id: "epk", label: "EPK & Press" },
  { id: "legal", label: "Legal & Rights" },
  { id: "release", label: "Release Ops" },
  { id: "outreach", label: "Outreach" },
  { id: "finance", label: "Finance" },
  { id: "brand", label: "Brand" },
  { id: "academy", label: "Academy" },
];

/** Launch catalog — all free for now; set priceCents > 0 to enable paid Stripe Checkout */
export const SKILLS_CATALOG: SkillProduct[] = [
  {
    id: "skill_epk_builder",
    slug: "epk-builder-pro",
    name: "EPK Builder Pro",
    tagline: "One-sheet, bio variants, and press-ready kit.",
    description:
      "A complete digital skill pack that teaches your Agent how to assemble artist EPKs: short/long bios, one-sheet, tech rider stubs, photo checklist, and export-ready structure. Installs into your workspace Knowledge Vault.",
    category: "epk",
    priceCents: 0,
    includes: [
      "SKILL.md + prompt pack",
      "EPK outline templates",
      "Bio length variants",
      "Asset completeness checklist",
      "PDF / web export brief",
    ],
    format: "SKILL.md pack",
    fileSize: "184 KB",
    version: "1.2.0",
    agent: "Brand / EPK",
    specialistId: "brand-epk",
    featured: true,
    popular: true,
    badge: "Bestseller",
  },
  {
    id: "skill_contract_redflags",
    slug: "contract-red-flags",
    name: "Contract Red Flags",
    tagline: "Plain-language deal review checklist.",
    description:
      "Educational skill for spotting common music-deal pitfalls. Your Agent drafts clause explanations and a red-flag report — never signs on your behalf. Approval-first always.",
    category: "legal",
    priceCents: 0,
    includes: [
      "Red-flag checklist",
      "Clause explain prompts",
      "Split-sheet starter",
      "When-to-lawyer guide",
    ],
    format: "Playbook + prompts",
    fileSize: "96 KB",
    version: "1.0.1",
    agent: "Contracts",
    specialistId: "contracts",
    featured: true,
  },
  {
    id: "skill_release_42",
    slug: "42-day-release-plan",
    name: "42-Day Release Plan",
    tagline: "From masters to street date, day by day.",
    description:
      "A release-ops skill that builds a 42-day calendar: metadata, DSP fields, content drops, pitch windows, and approval gates. Digital download installs as a reusable workflow.",
    category: "release",
    priceCents: 0,
    includes: [
      "42-day timeline template",
      "Metadata QC prompts",
      "Content drop calendar",
      "Pitch window checklist",
    ],
    format: "Workflow + templates",
    fileSize: "128 KB",
    version: "1.1.0",
    agent: "Release",
    specialistId: "release",
    popular: true,
  },
  {
    id: "skill_venue_outreach",
    slug: "venue-outreach-crm",
    name: "Venue Outreach CRM",
    tagline: "Pitch drafts that wait for your send.",
    description:
      "Outreach skill for rooms, blogs, and playlists. Builds prospect lists, personalized pitches, and follow-ups — nothing sends without your approval.",
    category: "outreach",
    priceCents: 0,
    includes: [
      "Pitch email templates",
      "Follow-up sequences",
      "CRM field map",
      "Approval queue tags",
    ],
    format: "Workflow + templates",
    fileSize: "112 KB",
    version: "1.0.0",
    agent: "Booking / Press",
    specialistId: "booking",
  },
  {
    id: "skill_pro_setup",
    slug: "pro-registration-kit",
    name: "PRO Registration Kit",
    tagline: "ASCAP, BMI, SESAC — education to execution.",
    description:
      "Academy-linked skill that turns PRO lessons into Agent tasks: repertoire spreadsheet, registration checklist, and soul.md updates.",
    category: "academy",
    priceCents: 0,
    includes: [
      "PRO comparison brief",
      "Repertoire sheet template",
      "Registration checklist",
      "Lesson → task mapping",
    ],
    format: "Playbook + prompts",
    fileSize: "88 KB",
    version: "1.0.0",
    agent: "Academy Tutor",
    specialistId: "contracts",
    badge: "Academy",
  },
  {
    id: "skill_brand_system",
    slug: "artist-brand-system",
    name: "Artist Brand System",
    tagline: "Voice, visuals, and social pillars.",
    description:
      "Brand skill pack for positioning, voice rules, content pillars, and social hooks that stay consistent with your soul.md.",
    category: "brand",
    priceCents: 0,
    includes: [
      "Brand voice sheet",
      "Content pillar map",
      "Hook script prompts",
      "Visual direction brief",
    ],
    format: "SKILL.md pack",
    fileSize: "104 KB",
    version: "1.0.0",
    agent: "Content",
    specialistId: "content",
  },
  {
    id: "skill_royalty_staging",
    slug: "royalty-staging",
    name: "Royalty Staging",
    tagline: "Track channels before the money gets fuzzy.",
    description:
      "Finance skill for staging DSP, sync, and show income. Builds a simple P&L sketch and payout gates — educational, not tax advice.",
    category: "finance",
    priceCents: 0,
    includes: [
      "Revenue channel map",
      "Statement organizer prompts",
      "Budget sketch template",
      "Payout gate checklist",
    ],
    format: "Workflow + templates",
    fileSize: "92 KB",
    version: "1.0.0",
    agent: "Finance",
    specialistId: "finance",
  },
  {
    id: "skill_split_sheets",
    slug: "split-sheet-studio",
    name: "Split Sheet Studio",
    tagline: "Who owns what — before the release.",
    description:
      "Legal/ops skill for drafting split sheets and contributor grids. Your Agent prepares; you approve before anyone signs.",
    category: "legal",
    priceCents: 0,
    includes: [
      "Split sheet template",
      "Contributor grid",
      "ISRC/UPC prep notes",
      "Approval checklist",
    ],
    format: "SKILL.md pack",
    fileSize: "76 KB",
    version: "1.0.2",
    agent: "Contracts / Cataba",
    specialistId: "contracts",
    popular: true,
  },
];

export function getSkillBySlug(slug: string) {
  return SKILLS_CATALOG.find((s) => s.slug === slug) ?? null;
}

export function getSkillById(id: string) {
  return SKILLS_CATALOG.find((s) => s.id === id) ?? null;
}

export function formatPrice(cents: number) {
  if (cents <= 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
}

/** Effective price — launch forces free when SKILLS_FORCE_FREE !== "0" */
export function effectivePriceCents(skill: SkillProduct) {
  if (process.env.SKILLS_FORCE_FREE !== "0") return 0;
  return skill.priceCents;
}

export function isSkillFree(skill: SkillProduct) {
  return effectivePriceCents(skill) <= 0;
}
