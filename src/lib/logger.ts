/**
 * Structured logger — console-based, Vercel captures stdout automatically.
 *
 * Usage:
 *   import { log } from "@/lib/logger";
 *   log.info("agent.chat", { userId, modelId, tokens: 412 });
 *   log.error("auth.signin", { email, error: err.message });
 */

type Level = "info" | "warn" | "error" | "debug";
type Meta = Record<string, unknown>;

function write(level: Level, event: string, meta?: Meta) {
  const ts = new Date().toISOString();
  const line = JSON.stringify({ ts, level, event, ...meta });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info:  (event: string, meta?: Meta) => write("info",  event, meta),
  warn:  (event: string, meta?: Meta) => write("warn",  event, meta),
  error: (event: string, meta?: Meta) => write("error", event, meta),
  debug: (event: string, meta?: Meta) => write("debug", event, meta),
  flush: () => Promise.resolve(),
};
