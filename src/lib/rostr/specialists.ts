/**
 * Specialist roster — Agent by Artispreneur
 * Master Agent routes; specialists execute. Max 7 active on day one.
 */

export type SpecialistId =
  | "brand-epk"
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
  surface: string;
  blurb: string;
  skills: string[];
};

export const SPECIALISTS: Specialist[] = [
  {
    id: "brand-epk",
    name: "Brand & EPK",
    role: "Identity & press kit",
    surface: "epk_brand",
    blurb: "Bios, EPK, brand voice, visual briefs, and press-ready packages.",
    skills: ["EPK builder", "Bio writer", "Brand system", "Press kit"],
  },
  {
    id: "contracts",
    name: "Contracts & Business",
    role: "Legal ops (guided)",
    surface: "contracts",
    blurb: "Split sheets, agreements, LLC/PRO checklists — always human-approved.",
    skills: ["Split sheets", "Contract drafts", "PRO checklist", "Entity setup"],
  },
  {
    id: "release",
    name: "Release & Distribution",
    role: "Release operations",
    surface: "release",
    blurb: "Metadata, 42-day calendars, DSP readiness, and delivery approval packets.",
    skills: ["Release plan", "Metadata QC", "Pitch fields", "Delivery checklist"],
  },
  {
    id: "content",
    name: "Content Producer",
    role: "Campaign creative",
    surface: "content",
    blurb: "Short-form hooks, content matrices, and campaign asset lists.",
    skills: ["Content calendar", "Hook scripts", "UGC briefs", "Asset list"],
  },
  {
    id: "press",
    name: "Press & Outreach",
    role: "PR / playlist / radio",
    surface: "press",
    blurb: "Target lists, pitch drafts, and submission tracking — send only after approval.",
    skills: ["Media list", "Pitch drafts", "Playlist targets", "Follow-ups"],
  },
  {
    id: "booking",
    name: "Booking Manager",
    role: "Live & DJ opportunities",
    surface: "booking",
    blurb: "Venue/DJ outreach, tech rider, availability, and inquiry pipeline.",
    skills: ["Venue pitch", "Tech rider", "Availability", "Pipeline"],
  },
  {
    id: "finance",
    name: "Finance Manager",
    role: "Money & royalties",
    surface: "finance",
    blurb: "Budgets, royalty statement staging, and payout approval packets.",
    skills: ["Budget", "Royalty staging", "P&L sketch", "Payout gate"],
  },
];

export function specialistsForSurfaces(surfaces: string[]): Specialist[] {
  const set = new Set(surfaces);
  const matched = SPECIALISTS.filter((s) => set.has(s.surface));
  // Always include Brand & Contracts as foundation if roster is thin
  if (matched.length === 0) {
    return SPECIALISTS.filter((s) => s.id === "brand-epk" || s.id === "contracts");
  }
  if (matched.length === 1 && matched[0].id !== "brand-epk") {
    return [SPECIALISTS[0], ...matched];
  }
  return matched;
}
