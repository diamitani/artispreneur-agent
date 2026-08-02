/**
 * Structured logger — Logtail (Better Stack) in production, console in dev.
 *
 * Usage:
 *   import { log } from "@/lib/logger";
 *   log.info("agent.chat", { userId, modelId, tokens: 412 });
 *   log.error("auth.signin", { email, error: err.message });
 *   log.warn("vault.ingest", { file: "contract.pdf", reason: "too large" });
 */

import { Logtail } from "@logtail/node";

const token = process.env.LOGTAIL_SOURCE_TOKEN;

let _logtail: Logtail | null = null;

function getLogtail(): Logtail | null {
  if (!token) return null;
  if (!_logtail) _logtail = new Logtail(token);
  return _logtail;
}

type Level = "info" | "warn" | "error" | "debug";
type Meta = Record<string, unknown>;

function write(level: Level, event: string, meta?: Meta) {
  const payload = { event, ...meta };

  // Always log to console (Vercel captures stdout)
  const line = `[${level.toUpperCase()}] ${event} ${meta ? JSON.stringify(meta) : ""}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);

  // Ship to Logtail when configured
  const lt = getLogtail();
  if (!lt) return;

  switch (level) {
    case "info":  lt.info(event, payload); break;
    case "warn":  lt.warn(event, payload); break;
    case "error": lt.error(event, payload); break;
    case "debug": lt.debug(event, payload); break;
  }
}

export const log = {
  info:  (event: string, meta?: Meta) => write("info",  event, meta),
  warn:  (event: string, meta?: Meta) => write("warn",  event, meta),
  error: (event: string, meta?: Meta) => write("error", event, meta),
  debug: (event: string, meta?: Meta) => write("debug", event, meta),
  /** Flush pending Logtail batches — call in onFinish / cleanup handlers. */
  flush: () => getLogtail()?.flush(),
};
