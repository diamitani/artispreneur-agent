import { describe, expect, it } from "vitest";
import { envShapeIssues, isProductionReady, productionEnvIssues } from "./env";

/** A configuration with nothing wrong, to mutate one field at a time. */
const GOOD: NodeJS.ProcessEnv = {
  NODE_ENV: "production",
  SESSION_SECRET: "a".repeat(48),
  APP_URL: "https://app.artispreneur.com",
  COGNITO_USER_POOL_ID: "us-east-1_abc123",
  COGNITO_CLIENT_ID: "client123",
  COGNITO_DOMAIN: "artispreneur.auth.us-east-1.amazoncognito.com",
  DYNAMODB_TABLE: "artispreneur-prod",
  HUB_BACKEND: "s3",
  S3_HUB_BUCKET: "artispreneur-hub",
  BEDROCK_MODEL_ID: "deepseek.v3.2",
};

/** GOOD minus one variable, which is how each case below is built. */
function without(key: keyof typeof GOOD): NodeJS.ProcessEnv {
  const copy = { ...GOOD };
  delete copy[key];
  return copy;
}

function errorsFor(env: NodeJS.ProcessEnv): string[] {
  return productionEnvIssues(env)
    .filter((i) => i.level === "error")
    .map((i) => i.key);
}

describe("productionEnvIssues", () => {
  it("passes a fully configured deployment", () => {
    expect(productionEnvIssues(GOOD)).toEqual([]);
    expect(isProductionReady(GOOD)).toBe(true);
  });

  it("catches a missing session secret", () => {
    const env = without("SESSION_SECRET");
    expect(errorsFor(env)).toContain("SESSION_SECRET");
    expect(isProductionReady(env)).toBe(false);
  });

  it("catches a missing APP_URL", () => {
    // Silent, and the symptom is a paying user landing on localhost after
    // Stripe redirects them back.
    expect(errorsFor(without("APP_URL"))).toContain("APP_URL");
  });

  it("accepts either DynamoDB table variable", () => {
    const env = without("DYNAMODB_TABLE");
    expect(errorsFor({ ...env, DYNAMODB_INSTANCE_TABLE: "t" })).not.toContain(
      "DYNAMODB_TABLE",
    );
    expect(errorsFor(env)).toContain("DYNAMODB_TABLE");
  });

  it("rejects the default fs hub backend", () => {
    // The fs root is under process.cwd(), read-only on serverless — this is
    // how onboarding output and workspace API keys go to nowhere.
    expect(errorsFor(without("HUB_BACKEND"))).toContain("HUB_BACKEND");
    expect(errorsFor({ ...GOOD, HUB_BACKEND: "fs" })).toContain("HUB_BACKEND");
  });

  it("rejects s3 without a bucket", () => {
    expect(errorsFor(without("S3_HUB_BUCKET"))).toContain("HUB_BACKEND");
  });

  it("catches incomplete Cognito config", () => {
    expect(errorsFor(without("COGNITO_CLIENT_ID"))).toContain("COGNITO_*");
  });

  it("treats half-configured Stripe as an error, not a warning", () => {
    // A key with no webhook secret takes money and never upgrades the plan.
    expect(errorsFor({ ...GOOD, STRIPE_SECRET_KEY: "sk_live_x" })).toContain("STRIPE_*");
    expect(errorsFor({ ...GOOD, STRIPE_WEBHOOK_SECRET: "whsec_x" })).toContain("STRIPE_*");
  });

  it("accepts both Stripe vars set, and neither set", () => {
    expect(
      errorsFor({ ...GOOD, STRIPE_SECRET_KEY: "sk_live_x", STRIPE_WEBHOOK_SECRET: "whsec_x" }),
    ).not.toContain("STRIPE_*");
    expect(errorsFor(GOOD)).not.toContain("STRIPE_*");
  });

  it("warns about a stray dev bypass without blocking", () => {
    const issues = productionEnvIssues({ ...GOOD, AUTH_DEV_BYPASS: "1" });
    const bypass = issues.find((i) => i.key === "AUTH_DEV_BYPASS");
    expect(bypass?.level).toBe("warn");
    expect(isProductionReady({ ...GOOD, AUTH_DEV_BYPASS: "1" })).toBe(true);
  });

  it("warns about a missing model id without blocking", () => {
    const env = without("BEDROCK_MODEL_ID");
    expect(productionEnvIssues(env).find((i) => i.key === "BEDROCK_MODEL_ID")?.level).toBe(
      "warn",
    );
    expect(isProductionReady(env)).toBe(true);
  });

  it("reports every problem at once rather than stopping at the first", () => {
    expect(errorsFor({ NODE_ENV: "production" }).length).toBeGreaterThanOrEqual(5);
  });
});

describe("envShapeIssues", () => {
  it("accepts a clean environment", () => {
    expect(envShapeIssues(GOOD)).toEqual([]);
  });

  it("rejects a malformed APP_URL", () => {
    expect(envShapeIssues({ ...GOOD, APP_URL: "app.artispreneur.com" })).toHaveLength(1);
  });

  it("rejects an unknown hub backend", () => {
    expect(envShapeIssues({ ...GOOD, HUB_BACKEND: "gcs" })).toHaveLength(1);
  });
});
