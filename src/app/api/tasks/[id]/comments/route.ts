import { NextRequest, NextResponse } from "next/server";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tableName } from "@/lib/db/client";
import { userPk, taskSk, commentSk } from "@/lib/db/schema";
import { getApiUser } from "@/lib/auth/api-utils";
import type { Comment } from "@/types/task";

function isDbAvailable(): boolean {
  return !!process.env.DYNAMODB_TABLE;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbAvailable()) {
    return NextResponse.json([]);
  }

  try {
    const result = await ddb().send(
      new QueryCommand({
        TableName: tableName(),
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": userPk(user.userId),
          ":skPrefix": `TASK#${taskId}#CMT#`,
        },
      })
    );

    const comments: Comment[] = (result.Items ?? []).map((item) => ({
      id: item.id,
      taskId: item.taskId,
      authorId: item.authorId,
      authorName: item.authorName,
      authorType: item.authorType,
      body: item.body,
      createdAt: item.createdAt,
    }));

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Failed to list comments:", error);
    return NextResponse.json([]);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { body: commentBody } = body as { body?: string };

  if (!commentBody || commentBody.trim().length === 0) {
    return NextResponse.json({ error: "Body is required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const comment: Comment = {
    id,
    taskId,
    authorId: user.userId,
    authorName: user.name,
    authorType: "human",
    body: commentBody.trim(),
    createdAt: now,
  };

  if (!isDbAvailable()) {
    return NextResponse.json(comment, { status: 201 });
  }

  try {
    // Write the comment
    await ddb().send(
      new PutCommand({
        TableName: tableName(),
        Item: {
          pk: userPk(user.userId),
          sk: commentSk(taskId, now),
          ...comment,
        },
      })
    );

    // Increment the task's commentCount
    await ddb().send(
      new UpdateCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: taskSk(taskId),
        },
        UpdateExpression: "SET commentCount = if_not_exists(commentCount, :zero) + :one, updatedAt = :now",
        ExpressionAttributeValues: {
          ":zero": 0,
          ":one": 1,
          ":now": now,
        },
      })
    );

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
