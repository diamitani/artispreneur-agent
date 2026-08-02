/**
 * Environment validation.
 *
 * The failure mode this exists to prevent is not a crash — it is the deployment
 * that boots, serves pages, returns 200s, and quietly drops every write. That
 * happened three ways at once:
 *
 *   - `DYNAMODB_TABLE` unset → the projects and tasks routes returned `[]` and
 *     `201` for data that was never stored.
 *   - `HUB_BACKEND` defaults to `fs`, whose root is under `process.cwd()`.
 *     Vercel's filesystem is read-only outside /tmp, so onboarding output, the
 *     usage ledger, and workspace API keys were written to nowhere.
 *   - `APP_URL` unset → logout and Stripe Checkout return URLs pointed at
 *     localhost, so a paying user landed on a dead page after paying.
 *
 * None of those raised an error. This module turns them into one place that can
 * be read — by /api/health, by a boot log, and by tests.
 *
 * It deliberately does NOT throw at import time. A module-level throw in Next
 * takes down every route including /api/health, which is the one thing you need
 * working when the configuration is wrong.
 */

import { z } from "zod";

const NonEmpty = z.string().trim().min(1);

/**
 * Vars the app reads. Everything is optional here; what is *required* depends
 * on the environment, and that is expressed in `productionEnvIssues()` below so
 * local development is never blocked by a production-only requirement.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),

  // Session
  SESSION_SECRET: z.string().optional(),

  // App
  APP_URL: z.string().url().optional().or(z.literal("")),

  // Auth
  COGNITO_USER_POOL_ID: NonEmpty.optional(),
  COGNITO_CLIENT_ID: NonEmpty.optional(),
  COGNITO_CLIENT_SECRET: z.string().optional(),
  COGNITO_DOMAIN: NonEmpty.optional(),
  AUTH_DEV_BYPASS: z.string().optional(),

  // Storage
  DYNAMODB_TABLE: NonEmpty.optional(),
  DYNAMODB_INSTANCE_TABLE: NonEmpty.optional(),
  HUB_BACKEND: z.enum(["fs", "s3"]).optional(),
  S3_HUB_BUCKET: NonEmpty.optional(),

  // Inference
  AWS_REGION: NonEmpty.optional(),
  BEDROCK_MODEL_ID: NonEmpty.optional(),

  // Billing
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Webhooks
  PAL_WEBHOOK_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export type EnvIssue = {
  /** The variable (or group) at fault. */
  key: string;
  /** What goes wrong if it stays this way — written for a human, not a log. */
  message: string;
  /** `error` blocks a safe production deploy; `warn` degrades a feature. */
  level: "error" | "warn";
};

/** Shape errors only — type and format, not presence rules. */
export function envShapeIssues(source: NodeJS.ProcessEnv = process.env): EnvIssue[] {
  const parsed = EnvSchema.safeParse(source);
  if (parsed.success) return [];
  return parsed.error.issues.map((i) => ({
    key: i.path.join(".") || "(env)",
    message: i.message,
    level: "error" as const,
  }));
}

/**
 * What must be true before this deployment can safely take real users.
 *
 * Callable in any environment — it answers "would this configuration be safe in
 * production?", so tests and a local preflight can ask it too.
 */
export function productionEnvIssues(
  source: NodeJS.ProcessEnv = process.env,
): EnvIssue[] {
  const issues: EnvIssue[] = [...envShapeIssues(source)];
  const has = (k: keyof Env) => Boolean(source[k]?.trim());

  // Session — src/lib/auth/session.ts owns the detailed rules (placeholder,
  // minimum length); this only checks presence so the two cannot disagree.
  if (!has("SESSION_SECRET")) {
    issues.push({
      key: "SESSION_SECRET",
      message: "Not set — every request that touches a session throws.",
      level: "error",
    });
  }

  if (!has("APP_URL")) {
    issues.push({
      key: "APP_URL",
      message:
        "Not set — logout and Stripe Checkout return URLs fall back to localhost.",
      level: "error",
    });
  }

  if (!has("DYNAMODB_TABLE") && !has("DYNAMODB_INSTANCE_TABLE")) {
    issues.push({
      key: "DYNAMODB_TABLE",
      message: "Not set — project and task writes are refused.",
      level: "error",
    });
  }

  if (source.HUB_BACKEND !== "s3" || !has("S3_HUB_BUCKET")) {
    issues.push({
      key: "HUB_BACKEND",
      message:
        "Workspace storage is not durable. Set HUB_BACKEND=s3 and S3_HUB_BUCKET — the fs backend writes under process.cwd(), which is read-only on serverless.",
      level: "error",
    });
  }

  if (!has("COGNITO_USER_POOL_ID") || !has("COGNITO_CLIENT_ID") || !has("COGNITO_DOMAIN")) {
    issues.push({
      key: "COGNITO_*",
      message: "Incomplete — nobody can sign up or sign in.",
      level: "error",
    });
  }

  // Dev bypass is already gated on NODE_ENV and Cognito being unconfigured, so
  // it cannot actually open a production deployment. It is still worth naming:
  // it means someone shipped a local .env.
  if (source.AUTH_DEV_BYPASS === "1") {
    issues.push({
      key: "AUTH_DEV_BYPASS",
      message:
        "Set to 1. It is ignored in production, but its presence means a development env file reached this deployment.",
      level: "warn",
    });
  }

  if (!has("BEDROCK_MODEL_ID")) {
    issues.push({
      key: "BEDROCK_MODEL_ID",
      message: "Not set — the agent falls back to a default model id.",
      level: "warn",
    });
  }

  // Billing is optional (the free plan works without it), but half-configured
  // is worse than off: checkout succeeds and the plan never changes.
  const stripeKey = has("STRIPE_SECRET_KEY");
  const stripeHook = has("STRIPE_WEBHOOK_SECRET");
  if (stripeKey !== stripeHook) {
    issues.push({
      key: "STRIPE_*",
      message: stripeKey
        ? "STRIPE_SECRET_KEY is set without STRIPE_WEBHOOK_SECRET — payments would be taken and no plan would ever be upgraded."
        : "STRIPE_WEBHOOK_SECRET is set without STRIPE_SECRET_KEY — checkout cannot start.",
      level: "error",
    });
  }

  return issues;
}

/** True when nothing would block this configuration from serving real users. */
export function isProductionReady(source: NodeJS.ProcessEnv = process.env): boolean {
  return productionEnvIssues(source).every((i) => i.level !== "error");
}
