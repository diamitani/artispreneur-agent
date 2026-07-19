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

export function getInstanceTable() {
  return (
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
