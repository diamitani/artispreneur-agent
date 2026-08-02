import { NextRequest, NextResponse } from "next/server";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, isDbConfigured, tableName } from "@/lib/db/client";
import { userPk, taskSk, subtaskSk } from "@/lib/db/schema";
import { getApiUser } from "@/lib/auth/api-utils";
import type { Subtask } from "@/types/task";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json([]);
  }

  try {
    const result = await ddb().send(
      new QueryCommand({
        TableName: tableName(),
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": userPk(user.userId),
          ":skPrefix": `TASK#${taskId}#SUB#`,
        },
      })
    );

    const subtasks: Subtask[] = (result.Items ?? []).map((item) => ({
      id: item.id,
      taskId: item.taskId,
      title: item.title,
      done: item.done ?? false,
      sortOrder: item.sortOrder ?? 0,
    }));

    return NextResponse.json(subtasks);
  } catch (error) {
    console.error("Failed to list subtasks:", error);
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
  const { title } = body as { title?: string };

  if (!title || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const id = crypto.randomUUID();

  const subtask: Subtask = {
    id,
    taskId,
    title: title.trim(),
    done: false,
    sortOrder: Date.now(),
  };

  if (!isDbConfigured()) {
    return NextResponse.json(subtask, { status: 201 });
  }

  try {
    // Write the subtask
    await ddb().send(
      new PutCommand({
        TableName: tableName(),
        Item: {
          pk: userPk(user.userId),
          sk: subtaskSk(taskId, id),
          ...subtask,
        },
      })
    );

    // Increment the task's subtaskCount
    await ddb().send(
      new UpdateCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: taskSk(taskId),
        },
        UpdateExpression: "SET subtaskCount = if_not_exists(subtaskCount, :zero) + :one, updatedAt = :now",
        ExpressionAttributeValues: {
          ":zero": 0,
          ":one": 1,
          ":now": new Date().toISOString(),
        },
      })
    );

    return NextResponse.json(subtask, { status: 201 });
  } catch (error) {
    console.error("Failed to create subtask:", error);
    return NextResponse.json({ error: "Failed to create subtask" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const body = await request.json();
  const { subtaskId, done } = body as { subtaskId?: string; done?: boolean };

  if (!subtaskId) {
    return NextResponse.json({ error: "subtaskId is required" }, { status: 400 });
  }
  if (done === undefined) {
    return NextResponse.json({ error: "done is required" }, { status: 400 });
  }

  try {
    // Update the subtask's done status
    await ddb().send(
      new UpdateCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: subtaskSk(taskId, subtaskId),
        },
        UpdateExpression: "SET done = :done",
        ExpressionAttributeValues: {
          ":done": done,
        },
      })
    );

    // Update the task's subtasksDone count
    const increment = done ? 1 : -1;
    await ddb().send(
      new UpdateCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: taskSk(taskId),
        },
        UpdateExpression: "SET subtasksDone = if_not_exists(subtasksDone, :zero) + :inc, updatedAt = :now",
        ExpressionAttributeValues: {
          ":zero": 0,
          ":inc": increment,
          ":now": new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({ success: true, subtaskId, done });
  } catch (error) {
    console.error("Failed to update subtask:", error);
    return NextResponse.json({ error: "Failed to update subtask" }, { status: 500 });
  }
}
