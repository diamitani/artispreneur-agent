/**
 * AWS Instance Registry — DynamoDB control plane for Agent workspaces.
 *
 * Single-table (multi-tenant blueprint):
 *   PK=USER#{cognitoSub}  SK=PROFILE
 *   PK=USER#{cognitoSub}  SK=PROJECT#{projectId}
 *   PK=USER#{cognitoSub}  SK=AGENT#hermes
 *   PK=KEY#{sha256}       SK=META          (apa_* resolution)
 *   PK=USER#{cognitoSub}  SK=USAGE#{day}   (optional rollup)
 *
 * When DYNAMODB_INSTANCE_TABLE is unset, mirrors to hub JSON under
 *   global/aws-instances/... so local/dev stays coherent.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  getAwsRegion,
  getInstanceTable,
  isInstanceTableConfigured,
} from "@/lib/aws/config";
import { hubBackendLabel, hubReadGlobalJson, hubWriteGlobalJson } from "@/lib/hub/store";
import { ORG, PRODUCT, TENANT } from "@/lib/tenancy/hierarchy";

export type InstanceProfile = {
  pk: string;
  sk: "PROFILE";
  user_id: string;
  email: string;
  name?: string | null;
  org_id: string;
  tenant_id: string;
  product_id: string;
  auth_provider: "aws_cognito";
  created_at: string;
  updated_at: string;
};

export type InstanceProject = {
  pk: string;
  sk: string;
  user_id: string;
  project_id: string;
  workspace_path: string;
  s3_prefix: string;
  hub_backend: "fs" | "s3";
  plan: string;
  completeness: number | null;
  hermes_runtime: "hermes+pal-rostr";
  active_skill_slugs: string[];
  created_at: string;
  updated_at: string;
};

export type InstanceHermesAgent = {
  pk: string;
  sk: "AGENT#hermes";
  user_id: string;
  project_id: string;
  runtime: "hermes+pal-rostr";
  llm_provider: "amazon_bedrock";
  model_id: string;
  soul_loaded: boolean;
  active_skills: number;
  updated_at: string;
};

export type InstanceKeyIndex = {
  pk: string;
  sk: "META";
  key_id: string;
  user_id: string;
  project_id: string;
  workspace_path: string;
  key_prefix: string;
  revoked_at: string | null;
};

let doc: DynamoDBDocumentClient | null = null;

function ddb() {
  if (!doc) {
    doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region: getAwsRegion() }), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return doc;
}

function table() {
  return getInstanceTable();
}

function userPk(userId: string) {
  return `USER#${userId}`;
}

function projectSk(projectId: string) {
  return `PROJECT#${projectId}`;
}

function keyPk(hash: string) {
  return `KEY#${hash}`;
}

async function putItem(item: Record<string, unknown>) {
  if (isInstanceTableConfigured()) {
    await ddb().send(new PutCommand({ TableName: table(), Item: item }));
    return;
  }
  const pk = String(item.pk);
  const sk = String(item.sk);
  const file = `aws-instances/${pk.replace(/#/g, "_")}/${sk.replace(/#/g, "_")}.json`;
  await hubWriteGlobalJson(file, item);
}

async function getItem<T>(pk: string, sk: string): Promise<T | null> {
  if (isInstanceTableConfigured()) {
    const out = await ddb().send(
      new GetCommand({ TableName: table(), Key: { pk, sk } }),
    );
    return (out.Item as T) || null;
  }
  const file = `aws-instances/${pk.replace(/#/g, "_")}/${sk.replace(/#/g, "_")}.json`;
  return hubReadGlobalJson<T>(file);
}

/** Provision / refresh USER + PROJECT (+ AGENT#hermes) on Cognito login */
export async function ensureAwsInstance(input: {
  userId: string;
  email: string;
  name?: string;
  projectId: string;
  workspacePath: string;
}) {
  const now = new Date().toISOString();
  const pk = userPk(input.userId);

  const existingProfile = await getItem<InstanceProfile>(pk, "PROFILE");
  const profile: InstanceProfile = {
    pk,
    sk: "PROFILE",
    user_id: input.userId,
    email: input.email,
    name: input.name ?? existingProfile?.name ?? null,
    org_id: ORG.id,
    tenant_id: TENANT.id,
    product_id: PRODUCT.id,
    auth_provider: "aws_cognito",
    created_at: existingProfile?.created_at || now,
    updated_at: now,
  };
  await putItem(profile);

  const sk = projectSk(input.projectId);
  const existingProject = await getItem<InstanceProject>(pk, sk);
  const project: InstanceProject = {
    pk,
    sk,
    user_id: input.userId,
    project_id: input.projectId,
    workspace_path: input.workspacePath,
    s3_prefix: input.workspacePath,
    hub_backend: hubBackendLabel(),
    plan: existingProject?.plan || "starter",
    completeness: existingProject?.completeness ?? null,
    hermes_runtime: "hermes+pal-rostr",
    active_skill_slugs: existingProject?.active_skill_slugs || [],
    created_at: existingProject?.created_at || now,
    updated_at: now,
  };
  await putItem(project);

  const agent: InstanceHermesAgent = {
    pk,
    sk: "AGENT#hermes",
    user_id: input.userId,
    project_id: input.projectId,
    runtime: "hermes+pal-rostr",
    llm_provider: "amazon_bedrock",
    model_id: process.env.BEDROCK_MODEL_ID || "deepseek.v3.2",
    soul_loaded: false,
    active_skills: project.active_skill_slugs.length,
    updated_at: now,
  };
  await putItem(agent);

  return { profile, project, agent };
}

export async function getAwsInstanceProject(userId: string, projectId: string) {
  return getItem<InstanceProject>(userPk(userId), projectSk(projectId));
}

export async function getAwsInstanceProfile(userId: string) {
  return getItem<InstanceProfile>(userPk(userId), "PROFILE");
}

export async function getAwsHermesAgent(userId: string) {
  return getItem<InstanceHermesAgent>(userPk(userId), "AGENT#hermes");
}

/** Sync PAL completeness + active skills onto the instance record */
export async function syncInstanceRuntime(input: {
  userId: string;
  projectId: string;
  completeness?: number | null;
  soulLoaded?: boolean;
  activeSkillSlugs?: string[];
}) {
  const now = new Date().toISOString();
  const pk = userPk(input.userId);
  const sk = projectSk(input.projectId);
  const project = await getItem<InstanceProject>(pk, sk);
  if (!project) return null;

  const next: InstanceProject = {
    ...project,
    completeness:
      input.completeness !== undefined ? input.completeness : project.completeness,
    active_skill_slugs: input.activeSkillSlugs ?? project.active_skill_slugs,
    hub_backend: hubBackendLabel(),
    updated_at: now,
  };
  await putItem(next);

  const agent = await getItem<InstanceHermesAgent>(pk, "AGENT#hermes");
  if (agent) {
    const nextAgent: InstanceHermesAgent = {
      ...agent,
      project_id: input.projectId,
      soul_loaded: input.soulLoaded ?? agent.soul_loaded,
      active_skills: next.active_skill_slugs.length,
      model_id: process.env.BEDROCK_MODEL_ID || agent.model_id,
      updated_at: now,
    };
    await putItem(nextAgent);
  }

  return next;
}

/** Store apa key hash index */
export async function putApiKeyIndex(input: {
  keyHash: string;
  keyId: string;
  userId: string;
  projectId: string;
  workspacePath: string;
  keyPrefix: string;
  revokedAt: string | null;
}) {
  const item: InstanceKeyIndex = {
    pk: keyPk(input.keyHash),
    sk: "META",
    key_id: input.keyId,
    user_id: input.userId,
    project_id: input.projectId,
    workspace_path: input.workspacePath,
    key_prefix: input.keyPrefix,
    revoked_at: input.revokedAt,
  };
  await putItem(item);

  await hubWriteGlobalJson(`agent-keys/by-hash/${input.keyHash}.json`, {
    key_id: input.keyId,
    user_id: input.userId,
    project_id: input.projectId,
    workspace_path: input.workspacePath,
    key_prefix: input.keyPrefix,
    revoked_at: input.revokedAt,
  });
}

export async function getApiKeyIndex(keyHash: string) {
  const fromDdb = await getItem<InstanceKeyIndex>(keyPk(keyHash), "META");
  if (fromDdb) {
    return {
      key_id: fromDdb.key_id,
      user_id: fromDdb.user_id,
      project_id: fromDdb.project_id,
      workspace_path: fromDdb.workspace_path,
      key_prefix: fromDdb.key_prefix,
      revoked_at: fromDdb.revoked_at,
    };
  }
  return hubReadGlobalJson<{
    key_id: string;
    user_id: string;
    project_id: string;
    workspace_path: string;
    key_prefix: string;
    revoked_at: string | null;
  }>(`agent-keys/by-hash/${keyHash}.json`);
}

export async function touchInstanceUsageDay(input: {
  userId: string;
  projectId: string;
  day: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}) {
  if (!isInstanceTableConfigured()) return;

  const pk = userPk(input.userId);
  const sk = `USAGE#${input.day}`;
  try {
    await ddb().send(
      new UpdateCommand({
        TableName: table(),
        Key: { pk, sk },
        UpdateExpression:
          "SET project_id = :p, input_tokens = if_not_exists(input_tokens, :z) + :i, output_tokens = if_not_exists(output_tokens, :z) + :o, estimated_cost_usd = if_not_exists(estimated_cost_usd, :z) + :c, calls = if_not_exists(calls, :z) + :one, updated_at = :u",
        ExpressionAttributeValues: {
          ":p": input.projectId,
          ":i": input.inputTokens,
          ":o": input.outputTokens,
          ":c": input.costUsd,
          ":z": 0,
          ":one": 1,
          ":u": new Date().toISOString(),
        },
      }),
    );
  } catch (e) {
    console.error("[instance-usage]", e);
  }
}

export function instancePlaneStatus() {
  return {
    hub_backend: hubBackendLabel(),
    s3_bucket: process.env.S3_HUB_BUCKET || null,
    dynamodb_table: getInstanceTable() || null,
    dynamodb_enabled: isInstanceTableConfigured(),
    region: getAwsRegion(),
  };
}
