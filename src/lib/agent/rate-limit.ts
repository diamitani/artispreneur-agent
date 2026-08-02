/**
 * Shared fixed-window rate limiter.
 *
 * The public demo route counted requests in a module-level `Map`. On Vercel
 * every serverless instance gets its own module scope, so the "20 per hour"
 * limit was really "20 per hour per warm lambda" — the cap scaled with load,
 * which is exactly backwards for an unauthenticated route that spends money on
 * Bedrock.
 *
 * When DynamoDB is configured the counter is a single atomic `ADD`, which is
 * correct across instances. Without it we fall back to the in-memory map, which
 * is honest for local development and a single long-lived server.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";
import { getAwsRegion, getInstanceTable, isInstanceTableConfigured } from "@/lib/aws/config";

let doc: DynamoDBDocumentClient | null = null;

function ddb() {
  if (!doc) {
    doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region: getAwsRegion() }), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return doc;
}

const memory = new Map<string, { count: number; reset: number }>();

/**
 * Raw IPs are personal data and we have no reason to keep them. Hashing means
 * the stored key identifies a bucket, not a person.
 */
function bucketId(subject: string): string {
  return createHash("sha256").update(subject).digest("hex").slice(0, 32);
}

export type RateVerdict = {
  ok: boolean;
  remaining: number;
  limit: number;
  /** Seconds until this window resets, for a Retry-After header. */
  resetsInSeconds: number;
};

/**
 * Consume one unit from `subject`'s window.
 *
 * `namespace` keeps unrelated limiters from sharing a bucket. A DynamoDB
 * failure is treated as allowed: an outage in the counter must not become an
 * outage in the feature.
 */
export async function consumeRateLimit(input: {
  namespace: string;
  subject: string;
  limit: number;
  windowSeconds: number;
  now?: Date;
}): Promise<RateVerdict> {
  const now = input.now ?? new Date();
  const ms = now.getTime();
  const windowMs = input.windowSeconds * 1000;
  const windowStart = Math.floor(ms / windowMs) * windowMs;
  const resetsInSeconds = Math.max(1, Math.ceil((windowStart + windowMs - ms) / 1000));
  const key = `${input.namespace}#${bucketId(input.subject)}#${windowStart}`;

  if (!isInstanceTableConfigured()) {
    const entry = memory.get(key);
    const count = (entry?.count ?? 0) + 1;
    memory.set(key, { count, reset: windowStart + windowMs });
    // Bound the map so a long-lived process cannot grow it without limit.
    if (memory.size > 5000) {
      for (const [k, v] of memory) if (v.reset < ms) memory.delete(k);
    }
    return {
      ok: count <= input.limit,
      remaining: Math.max(0, input.limit - count),
      limit: input.limit,
      resetsInSeconds,
    };
  }

  try {
    const out = await ddb().send(
      new UpdateCommand({
        TableName: getInstanceTable(),
        Key: { pk: `RATE#${key}`, sk: "COUNTER" },
        UpdateExpression: "ADD hits :one SET expires_at = :ttl",
        ExpressionAttributeValues: {
          ":one": 1,
          // TTL attribute so DynamoDB reaps these rows without a sweeper.
          ":ttl": Math.floor((windowStart + windowMs) / 1000) + 3600,
        },
        ReturnValues: "UPDATED_NEW",
      }),
    );
    const count = Number(out.Attributes?.hits ?? 1);
    return {
      ok: count <= input.limit,
      remaining: Math.max(0, input.limit - count),
      limit: input.limit,
      resetsInSeconds,
    };
  } catch (e) {
    console.error("[rate-limit]", e);
    return { ok: true, remaining: input.limit, limit: input.limit, resetsInSeconds };
  }
}
