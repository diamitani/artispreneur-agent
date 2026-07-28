import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment diagnostics.
 *
 * Answers "why doesn't it work?" without guessing. Reports which subsystems
 * are configured and, for each broken one, the exact variables to set.
 *
 * Reports presence only — never values, never secrets.
 */

function has(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function missing(names: string[]): string[] {
  return names.filter((n) => !has(n));
}

export async function GET() {
  const isProd = process.env.NODE_ENV === "production";

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
  const table =
    process.env.DYNAMODB_INSTANCE_TABLE || process.env.ARTISPRENEUR_INSTANCE_TABLE || "";
  const controlPlane = {
    ok: true, // falls back to hub-mirrored JSON
    dynamodb_table: table || null,
    mode: table ? "dynamodb" : "hub_json_fallback",
    fix: table ? null : "Optional: set DYNAMODB_INSTANCE_TABLE for a durable control plane.",
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
    !auth.ok && "auth",
    !storage.ok && "storage",
    !bedrock.ok && "bedrock",
  ].filter(Boolean) as string[];

  return NextResponse.json(
    {
      ok: blockers.length === 0,
      environment: isProd ? "production" : "development",
      blockers,
      next_steps: [auth.fix, storage.fix, bedrock.fix].filter(Boolean),
      auth,
      storage,
      control_plane: controlPlane,
      bedrock,
      agentcore,
    },
    { status: blockers.length ? 503 : 200 },
  );
}
