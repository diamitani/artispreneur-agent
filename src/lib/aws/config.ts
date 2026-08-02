/**
 * Shared AWS config for the Artispreneur Agent instance system.
 * Platform IAM / keys stay server-side (Cognito, Bedrock, S3 hub, DynamoDB).
 */

export function getAwsRegion() {
  return (
    process.env.AWS_HUB_REGION ||
    process.env.BEDROCK_REGION ||
    process.env.AWS_REGION ||
    "us-east-1"
  );
}

/** fs (default, local/Vercel ephemeral) | s3 (durable hub) */
export type HubBackend = "fs" | "s3";

export function getHubBackend(): HubBackend {
  const raw = (process.env.HUB_BACKEND || "fs").toLowerCase();
  return raw === "s3" ? "s3" : "fs";
}

export function getHubBucket() {
  return process.env.S3_HUB_BUCKET || process.env.ARTISPRENEUR_HUB_BUCKET || "";
}

/**
 * The control-plane table.
 *
 * There is one physical table (pk/sk + GSI1, see infrastructure/template.yaml),
 * but the code grew two names for it: this side read DYNAMODB_INSTANCE_TABLE
 * while src/lib/db/client.ts required DYNAMODB_TABLE. infra/DEPLOY.md set only
 * the former, so projects and tasks threw on every request while the instance
 * registry worked — a split that looked like a bug in the projects API.
 *
 * DYNAMODB_TABLE is the canonical name. The others are kept as fallbacks so an
 * existing deployment does not break on upgrade.
 */
export function getInstanceTable() {
  return (
    process.env.DYNAMODB_TABLE ||
    process.env.DYNAMODB_INSTANCE_TABLE ||
    process.env.ARTISPRENEUR_INSTANCE_TABLE ||
    ""
  );
}

export function isS3HubConfigured() {
  return getHubBackend() === "s3" && Boolean(getHubBucket());
}

export function isInstanceTableConfigured() {
  return Boolean(getInstanceTable());
}

/** True when durable AWS instance plane is intended (S3 and/or Dynamo) */
export function isAwsInstancePlaneEnabled() {
  return isS3HubConfigured() || isInstanceTableConfigured();
}
