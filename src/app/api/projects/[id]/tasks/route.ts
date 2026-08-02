import { NextRequest, NextResponse } from "next/server";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, isDbConfigured, tableName } from "@/lib/db/client";
import { userPk, projectSk, taskSk } from "@/lib/db/schema";
import { getApiUser } from "@/lib/auth/api-utils";
import type { Task, TaskStatus, TaskPriority, TaskAssignee, NpaoPhase } from "@/types/task";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json([]);
  }

  try {
    // GSI1 is partitioned by PROJECT#, not by owner, so without this filter any
    // signed-in caller who knows a project id reads that project's task list.
    // Sibling routes all partition on pk = USER#{sub}; this one was the outlier.
    const result = await ddb().send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: "GSI1",
        KeyConditionExpression: "gsi1pk = :gsi1pk AND begins_with(gsi1sk, :gsi1skPrefix)",
        FilterExpression: "pk = :ownerPk",
        ExpressionAttributeValues: {
          ":gsi1pk": `PROJECT#${projectId}`,
          ":gsi1skPrefix": "TASK#",
          ":ownerPk": userPk(user.userId),
        },
      })
    );

    const tasks: Task[] = (result.Items ?? []).map((item) => ({
      id: item.id,
      projectId: item.projectId,
      userId: item.userId,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      assignee: item.assignee,
      dueDate: item.dueDate,
      tags: item.tags ?? [],
      npaoPhase: item.npaoPhase,
      subtaskCount: item.subtaskCount ?? 0,
      subtasksDone: item.subtasksDone ?? 0,
      commentCount: item.commentCount ?? 0,
      sortOrder: item.sortOrder ?? 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      completedAt: item.completedAt,
    }));

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Failed to list tasks:", error);
    return NextResponse.json([]);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, status, priority, assignee, dueDate, tags, npaoPhase } = body as {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignee?: TaskAssignee;
    dueDate?: string;
    tags?: string[];
    npaoPhase?: NpaoPhase;
  };

  if (!title || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const task: Task = {
    id,
    projectId,
    userId: user.userId,
    title: title.trim(),
    description: description?.trim(),
    status: status ?? "backlog",
    priority: priority ?? "none",
    assignee,
    dueDate,
    tags: tags ?? [],
    npaoPhase,
    subtaskCount: 0,
    subtasksDone: 0,
    commentCount: 0,
    sortOrder: Date.now(),
    createdAt: now,
    updatedAt: now,
  };

  if (!isDbConfigured()) {
    return NextResponse.json(task, { status: 201 });
  }

  try {
    // Write the task
    await ddb().send(
      new PutCommand({
        TableName: tableName(),
        Item: {
          pk: userPk(user.userId),
          sk: taskSk(id),
          gsi1pk: `PROJECT#${projectId}`,
          gsi1sk: `TASK#${id}`,
          ...task,
        },
      })
    );

    // Increment the project's taskCount
    await ddb().send(
      new UpdateCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: projectSk(projectId),
        },
        UpdateExpression: "SET taskCount = if_not_exists(taskCount, :zero) + :one, updatedAt = :now",
        ExpressionAttributeValues: {
          ":zero": 0,
          ":one": 1,
          ":now": now,
        },
      })
    );

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
