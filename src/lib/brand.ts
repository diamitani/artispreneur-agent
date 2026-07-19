export const brand = {
  red: "#c0272d",
  redBright: "#d90404",
  gold: "#f5c100",
  goldSoft: "#e8c97a",
  ink: "#0d0d0e",
  charcoal: "#141416",
  surface: "#17181b",
  surfaceRaised: "#1f2024",
  cream: "#f5efe0",
  muted: "#8a857a",
  warmGray: "#4a4a4a",
  line: "rgba(245, 239, 224, 0.08)",
} as const;

export type Brand = typeof brand;

/** ROSTR 5D phase palette — Navigate, Prioritize, Allocate, Orchestrate. */
export const PHASE_COLORS = {
  PreD: "#8b7ff5",
  Design: "#4fb6e8",
  Development: "#f5c100",
  Deployment: "#4fd18b",
  Debugging: "#e8734f",
} as const;

export type Phase = keyof typeof PHASE_COLORS;

/** Status semantics used across the rights ledger and approval gates. */
export const STATUS_COLORS = {
  ok: "#4fd18b",
  warn: "#f5c100",
  block: "#e0503a",
  info: "#4fb6e8",
  muted: "#8a857a",
} as const;
