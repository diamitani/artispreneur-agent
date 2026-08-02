import { NextResponse } from "next/server";
import { sessionSecretIssue } from "@/lib/auth/session";
import { isCognitoConfigured } from "@/lib/auth/config";
import { isBedrockConfigured } from "@/lib/agent/bedrock";
import { productionEnvIssues } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Unauthenticated deploy health check.
 *
 * Every other status route (/api/agentcore/status, /api/aws/instance,
 * /api/integrations) requires a session — which is useless for catching the
 * failure that matters most, because a bad SESSION_SECRET makes signing in
 * impossible in the first place. That failure otherwise surfaces only as a
 * generic 500 "Sign-in failed." or a redirect loop.
 *
 * Reports booleans and human-readable reasons only. It never echoes a value,
 * so it is safe to leave open and to point an uptime monitor at.
 */
export function GET() {
  const isProd = process.env.NODE_ENV === "production";

  const secretIssue = sessionSecretIssue();

  // db/client.ts requires DYNAMODB_TABLE; aws/config.ts reads
  // DYNAMODB_INSTANCE_TABLE. Accept either as satisfying the control plane, and
  // say which one is actually missing.
  const dynamoTable = Boolean(
    process.env.DYNAMODB_TABLE || process.env.DYNAMODB_INSTANCE_TABLE,
  );

  // The hub defaults to the local filesystem, which is read-only on Vercel
  // outside /tmp. In production that silently loses onboarding output, the
  // usage ledger, and workspace API keys.
  const hubBackend = process.env.HUB_BACKEND ?? "fs";
  const hubDurable = hubBackend === "s3" && Boolean(process.env.S3_HUB_BUCKET);

  const checks = {
    session_secret: { ok: !secretIssue, reason: secretIssue },
    cognito: {
      ok: isCognitoConfigured(),
      reason: isCognitoConfigured() ? null : "COGNITO_USER_POOL_ID / COGNITO_CLIENT_ID / COGNITO_DOMAIN not set",
    },
    app_url: {
      ok: Boolean(process.env.APP_URL),
      reason: process.env.APP_URL
        ? null
        : "APP_URL not set — logout and checkout return URLs fall back to localhost",
    },
    dynamodb: {
      ok: dynamoTable,
      reason: dynamoTable ? null : "DYNAMODB_TABLE not set — writes are dropped silently",
    },
    hub_storage: {
      ok: hubDurable || !isProd,
      reason: hubDurable
        ? null
        : `HUB_BACKEND=${hubBackend}${process.env.S3_HUB_BUCKET ? "" : " and S3_HUB_BUCKET unset"} — workspace writes are not durable on serverless`,
    },
    bedrock: {
      ok: isBedrockConfigured(),
      reason: isBedrockConfigured() ? null : "no AWS or Bedrock credential present — agent chat will fail",
    },
    // A production deploy must never run with the auth bypass on.
    auth_bypass_off: {
      ok: !(isProd && process.env.AUTH_DEV_BYPASS === "1"),
      reason:
        isProd && process.env.AUTH_DEV_BYPASS === "1"
          ? "AUTH_DEV_BYPASS=1 in production"
          : null,
    },
  };

  // Anything that stops a real user signing up or keeping their data.
  const criticalKeys = [
    "session_secret",
    "cognito",
    "app_url",
    "dynamodb",
    "hub_storage",
    "auth_bypass_off",
  ] as const;

  const failing = criticalKeys.filter((k) => !checks[k].ok);
  const ok = isProd ? failing.length === 0 : true;

  // The full env audit, so a staging or local deploy can be asked "would this
  // configuration be safe in production?" before anyone promotes it. Names and
  // explanations only — never a value.
  const env_issues = productionEnvIssues().map((i) => ({
    key: i.key,
    level: i.level,
    message: i.message,
  }));

  return NextResponse.json(
    {
      ok,
      environment: process.env.NODE_ENV ?? "development",
      production_ready: env_issues.every((i) => i.level !== "error"),
      failing: failing.length ? failing : undefined,
      checks,
      env_issues,
    },
    { status: ok ? 200 : 503 },
  );
}
