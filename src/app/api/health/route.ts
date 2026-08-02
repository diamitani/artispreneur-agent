import { NextResponse } from "next/server";
import { sessionSecretIssue } from "@/lib/auth/session";
import { productionEnvIssues } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment diagnostics.
 *
 * Answers "why doesn't it work?" without guessing. Reports which subsystems are
 * configured and, for each broken one, the exact variables to set.
 *
 * Unauthenticated by design. Every other status route (/api/agentcore/status,
 * /api/aws/instance, /api/integrations) requires a session, which is useless
 * for catching the failure that matters most: a bad SESSION_SECRET makes
 * signing in impossible in the first place, so an authenticated check could
 * never reach it. That failure otherwise surfaces only as a generic 500 or a
 * sign-in redirect loop.
 *
 * Reports presence and human-readable reasons only — never values, never
 * secrets. Safe to leave open and to point an uptime monitor at.
 */

function has(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function missing(names: string[]): string[] {
  return names.filter((n) => !has(n));
}

export async function GET() {
  const isProd = process.env.NODE_ENV === "production";

  // ── Session ─────────────────────────────────────────────────────────────
  // The secret is used to derive the AES key for the session cookie. A missing
  // one throws on every request; the published .env.example placeholder makes
  // every session forgeable, because the cookie is a self-contained blob with
  // no server-side store.
  const secretIssue = sessionSecretIssue();
  const session = {
    ok: !secretIssue,
    reason: secretIssue,
    fix: secretIssue
      ? "Auth is down. Generate a real secret (openssl rand -base64 48) and set SESSION_SECRET. It must be 32+ characters and must not be the .env.example placeholder."
      : null,
  };

  // ── Auth ────────────────────────────────────────────────────────────────
  const cognitoVars = [
    "COGNITO_USER_POOL_ID",
    "COGNITO_CLIENT_ID",
    "COGNITO_DOMAIN",
    "COGNITO_REDIRECT_URI",
  ];
  const cognitoMissing = missing(cognitoVars);
  const devBypassRequested = process.env.AUTH_DEV_BYPASS === "1";
  // The bypass is deliberately inert in production.
  const devBypassActive = devBypassRequested && !isProd && cognitoMissing.length > 0;

  const auth = {
    ok: cognitoMissing.length === 0 || devBypassActive,
    mode: cognitoMissing.length === 0 ? "cognito" : devBypassActive ? "dev_bypass" : "broken",
    missing: cognitoMissing,
    dev_bypass_requested: devBypassRequested,
    dev_bypass_active: devBypassActive,
    fix:
      cognitoMissing.length === 0
        ? null
        : devBypassActive
          ? null
          : isProd
            ? `Sign-in is down. Set these in your host's environment: ${cognitoMissing.join(", ")}. COGNITO_REDIRECT_URI must exactly match the callback URL registered on the Cognito app client, e.g. https://YOUR-DOMAIN/api/auth/callback.`
            : `Set ${cognitoMissing.join(", ")} in .env.local, or set AUTH_DEV_BYPASS=1 to skip auth locally.`,
  };

  // ── App origin ──────────────────────────────────────────────────────────
  // Logout and Stripe Checkout return URLs are built from it. Unset, a paying
  // user lands on localhost after checkout.
  const appUrl = {
    ok: has("APP_URL") || !isProd,
    fix: has("APP_URL")
      ? null
      : "Set APP_URL to this deployment's absolute origin. Logout and Stripe Checkout return URLs fall back to localhost without it.",
  };

  // ── Storage (the Rostr Hub) ─────────────────────────────────────────────
  const hubBackend = (process.env.HUB_BACKEND || "fs").toLowerCase();
  const bucket = process.env.S3_HUB_BUCKET || process.env.ARTISPRENEUR_HUB_BUCKET || "";
  // Serverless filesystems are per-invocation: writes vanish between requests.
  const ephemeral = hubBackend !== "s3" && (isProd || Boolean(process.env.VERCEL));

  const storage = {
    ok: !ephemeral && (hubBackend !== "s3" || Boolean(bucket)),
    backend: hubBackend === "s3" && bucket ? "s3" : "fs",
    bucket: bucket || null,
    ephemeral,
    fix: ephemeral
      ? "Your workspace data will not persist. Each serverless invocation gets a fresh filesystem, so compiles and deliverables disappear between requests. Set HUB_BACKEND=s3 and S3_HUB_BUCKET=<your-bucket>."
      : hubBackend === "s3" && !bucket
        ? "HUB_BACKEND=s3 but S3_HUB_BUCKET is unset."
        : null,
  };

  // ── Control plane ───────────────────────────────────────────────────────
  // DYNAMODB_TABLE is canonical; DYNAMODB_INSTANCE_TABLE is the name older
  // deploy docs used. Both point at the same physical table and both are
  // accepted — see src/lib/aws/config.ts:getInstanceTable.
  const table =
    process.env.DYNAMODB_TABLE ||
    process.env.DYNAMODB_INSTANCE_TABLE ||
    process.env.ARTISPRENEUR_INSTANCE_TABLE ||
    "";
  const controlPlane = {
    // In production this is not optional: without it, project and task writes
    // are refused rather than silently dropped.
    ok: Boolean(table) || !isProd,
    dynamodb_table: table ? "configured" : null,
    mode: table ? "dynamodb" : "hub_json_fallback",
    fix: table
      ? null
      : isProd
        ? "Set DYNAMODB_TABLE. Project and task writes are refused without it."
        : "Optional locally: set DYNAMODB_TABLE for a durable control plane.",
  };

  // ── Agent model ─────────────────────────────────────────────────────────
  const hasCreds =
    has("AWS_BEARER_TOKEN_BEDROCK") ||
    has("BEDROCK_API_KEY") ||
    (has("AWS_ACCESS_KEY_ID") && has("AWS_SECRET_ACCESS_KEY")) ||
    has("AWS_PROFILE") ||
    has("AWS_ROLE_ARN");
  const modelId = process.env.BEDROCK_MODEL_ID || "deepseek.v3.2";

  const bedrock = {
    ok: hasCreds,
    model_id: modelId,
    region: process.env.BEDROCK_REGION || process.env.AWS_REGION || "us-east-1",
    fix: hasCreds
      ? null
      : "Agents cannot run. Set AWS_BEARER_TOKEN_BEDROCK, or AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY.",
  };

  // ── Billing ─────────────────────────────────────────────────────────────
  // Optional — the free plan works without it. But half-configured is worse
  // than off: checkout succeeds and no plan is ever upgraded.
  const stripeKey = has("STRIPE_SECRET_KEY");
  const stripeHook = has("STRIPE_WEBHOOK_SECRET");
  const billing = {
    ok: stripeKey === stripeHook,
    enabled: stripeKey && stripeHook,
    fix:
      stripeKey === stripeHook
        ? null
        : stripeKey
          ? "STRIPE_SECRET_KEY is set without STRIPE_WEBHOOK_SECRET. Payments would be taken and no plan would ever be upgraded. Create an endpoint at <origin>/api/billing/webhook and set its signing secret."
          : "STRIPE_WEBHOOK_SECRET is set without STRIPE_SECRET_KEY — checkout cannot start.",
  };

  // ── AgentCore (all optional) ────────────────────────────────────────────
  const agentcore = {
    ok: true,
    runtime: has("AGENTCORE_RUNTIME_ARN"),
    memory: has("AGENTCORE_MEMORY_ID"),
    identity: has("AGENTCORE_WORKLOAD_NAME"),
    gateway: has("AGENTCORE_GATEWAY_URL"),
    fix: null as string | null,
  };

  const blockers = [
    !session.ok && "session",
    !auth.ok && "auth",
    !appUrl.ok && "app_url",
    !storage.ok && "storage",
    !controlPlane.ok && "control_plane",
    !bedrock.ok && "bedrock",
    !billing.ok && "billing",
  ].filter(Boolean) as string[];

  // The full env audit, so a staging or local deploy can be asked "would this
  // configuration be safe in production?" before anyone promotes it.
  const env_issues = productionEnvIssues().map((i) => ({
    key: i.key,
    level: i.level,
    message: i.message,
  }));

  return NextResponse.json(
    {
      ok: blockers.length === 0,
      environment: isProd ? "production" : "development",
      production_ready: env_issues.every((i) => i.level !== "error"),
      blockers,
      next_steps: [
        session.fix,
        auth.fix,
        appUrl.fix,
        storage.fix,
        controlPlane.fix,
        bedrock.fix,
        billing.fix,
      ].filter(Boolean),
      session,
      auth,
      app_url: appUrl,
      storage,
      control_plane: controlPlane,
      bedrock,
      billing,
      agentcore,
      env_issues,
    },
    { status: blockers.length ? 503 : 200 },
  );
}
