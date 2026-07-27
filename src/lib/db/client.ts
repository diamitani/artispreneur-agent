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
 * Returns the DynamoDB table name from env.
 */
export function tableName(): string {
  const name = process.env.DYNAMODB_TABLE;
  if (!name) {
    throw new Error("DYNAMODB_TABLE environment variable is not set");
  }
  return name;
}
