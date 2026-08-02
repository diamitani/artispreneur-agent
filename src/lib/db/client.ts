import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let _client: DynamoDBDocumentClient | null = null;

/**
 * Returns a singleton DynamoDB Document Client.
 * Lazily initialized on first call.
 */
export function ddb(): DynamoDBDocumentClient {
  if (!_client) {
    const rawClient = new DynamoDBClient({
      region: process.env.AWS_REGION ?? "us-east-1",
    });
    _client = DynamoDBDocumentClient.from(rawClient, {
      marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    });
  }
  return _client;
}

/**
 * The DynamoDB table name.
 *
 * DYNAMODB_TABLE is canonical. DYNAMODB_INSTANCE_TABLE is accepted as a
 * fallback because infra/DEPLOY.md documented that name and existing
 * deployments set it — they point at the same physical table, and requiring
 * only one of them made this module throw while the instance registry
 * worked fine. See src/lib/aws/config.ts:getInstanceTable.
 */
export function tableName(): string {
  const name = process.env.DYNAMODB_TABLE || process.env.DYNAMODB_INSTANCE_TABLE;
  if (!name) {
    throw new Error("DYNAMODB_TABLE environment variable is not set");
  }
  return name;
}

/**
 * Whether persistence is available at all.
 *
 * Six API routes each carried their own copy of this, all checking only
 * DYNAMODB_TABLE, so a deployment that set DYNAMODB_INSTANCE_TABLE (the name
 * infra/DEPLOY.md documented) looked storage-less to every one of them while
 * the instance registry worked. One definition, both names.
 */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DYNAMODB_TABLE || process.env.DYNAMODB_INSTANCE_TABLE);
}
