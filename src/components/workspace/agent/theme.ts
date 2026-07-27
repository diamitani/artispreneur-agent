/**
 * Dashboard theme tokens, taken from the Artispreneur `Dashboard.html`
 * reference. Light command-center surface, crimson/gold brand accents.
 *
 * Kept as literals rather than CSS vars so this surface renders correctly
 * regardless of what the global theme is set to.
 */

export const T = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  line: "#E5E5E5",
  lineSoft: "#EBEBEB",
  text: "#1F1F1F",
  textMuted: "#6B6B6B",
  textDim: "#8A8A8A",
  red: "#D90404",
  redSoft: "#FEF2F2",
  gold: "#F2B705",
  goldSoft: "#FEF3C7",
  goldInk: "#92610A",
  green: "#059669",
  greenSoft: "#D1FAE5",
  greenInk: "#16A34A",
  violet: "#7C3AED",
  cyan: "#0891B2",
} as const;

/** Category accents for the centers, matching the reference palette. */
export const CENTER_ACCENT: Record<string, string> = {
  release: T.red,
  outreach: T.violet,
  booking: T.cyan,
  brand_epk: T.gold,
  rights: T.red,
  finance: T.green,
  content: T.violet,
  ops: T.textMuted,
};
