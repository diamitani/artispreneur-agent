import { NextRequest, NextResponse } from "next/server";
import { GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tableName } from "@/lib/db/client";
import { userPk, taskSk, projectSk } from "@/lib/db/schema";
import { getApiUser } from "@/lib/auth/api-utils";
import type { Task, TaskStatus, TaskPriority, TaskAssignee, NpaoPhase } from "@/types/task";

function isDbAvailable(): boolean {
  return !!process.env.DYNAMODB_TABLE;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbAvailable()) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  try {
    const result = await ddb().send(
      new GetCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: taskSk(id),
        },
      })
    );

    if (!result.Item) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task: Task = {
      id: result.Item.id,
      projectId: result.Item.projectId,
      userId: result.Item.userId,
      title: result.Item.title,
      description: result.Item.description,
      status: result.Item.status,
      priority: result.Item.priority,
      assignee: result.Item.assignee,
      dueDate: result.Item.dueDate,
      tags: result.Item.tags ?? [],
      npaoPhase: result.Item.npaoPhase,
      subtaskCount: result.Item.subtaskCount ?? 0,
      subtasksDone: result.Item.subtasksDone ?? 0,
      commentCount: result.Item.commentCount ?? 0,
      sortOrder: result.Item.sortOrder ?? 0,
      createdAt: result.Item.createdAt,
      updatedAt: result.Item.updatedAt,
      completedAt: result.Item.completedAt,
    };

    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to get task:", error);
    return NextResponse.json({ error: "Failed to get task" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbAvailable()) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const body = await request.json();
  const { title, description, status, priority, assignee, dueDate, tags, npaoPhase, sortOrder } = body as {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignee?: TaskAssignee;
    dueDate?: string;
    tags?: string[];
    npaoPhase?: NpaoPhase;
    sortOrder?: number;
  };

  const updates: string[] = [];
  const expressionValues: Record<string, unknown> = {};
  const expressionNames: Record<string, string> = {};

  if (title !== undefined) {
    updates.push("title = :title");
    expressionValues[":title"] = title.trim();
  }
  if (description !== undefined) {
    updates.push("description = :description");
    expressionValues[":description"] = description?.trim();
  }
  if (status !== undefined) {
    updates.push("#status = :status");
    expressionNames["#status"] = "status";
    expressionValues[":status"] = status;

    // Handle completedAt based on status changes
    if (status === "done") {
      updates.push("completedAt = :completedAt");
      expressionValues[":completedAt"] = new Date().toISOString();
    } else {
      updates.push("completedAt = :completedAt");
      expressionValues[":completedAt"] = null;
    }
  }
  if (priority !== undefined) {
    updates.push("priority = :priority");
    expressionValues[":priority"] = priority;
  }
  if (assignee !== undefined) {
    updates.push("assignee = :assignee");
    expressionValues[":assignee"] = assignee;
  }
  if (dueDate !== undefined) {
    updates.push("dueDate = :dueDate");
    expressionValues[":dueDate"] = dueDate;
  }
  if (tags !== undefined) {
    updates.push("tags = :tags");
    expressionValues[":tags"] = tags;
  }
  if (npaoPhase !== undefined) {
    updates.push("npaoPhase = :npaoPhase");
    expressionValues[":npaoPhase"] = npaoPhase;
  }
  if (sortOrder !== undefined) {
    updates.push("sortOrder = :sortOrder");
    expressionValues[":sortOrder"] = sortOrder;
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  updates.push("updatedAt = :updatedAt");
  expressionValues[":updatedAt"] = new Date().toISOString();

  try {
    const result = await ddb().send(
      new UpdateCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: taskSk(id),
        },
        UpdateExpression: `SET ${updates.join(", ")}`,
        ExpressionAttributeValues: expressionValues,
        ...(Object.keys(expressionNames).length > 0 && {
          ExpressionAttributeNames: expressionNames,
        }),
        ReturnValues: "ALL_NEW",
      })
    );

    if (!result.Attributes) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task: Task = {
      id: result.Attributes.id,
      projectId: result.Attributes.projectId,
      userId: result.Attributes.userId,
      title: result.Attributes.title,
      description: result.Attributes.description,
      status: result.Attributes.status,
      priority: result.Attributes.priority,
      assignee: result.Attributes.assignee,
      dueDate: result.Attributes.dueDate,
      tags: result.Attributes.tags ?? [],
      npaoPhase: result.Attributes.npaoPhase,
      subtaskCount: result.Attributes.subtaskCount ?? 0,
      subtasksDone: result.Attributes.subtasksDone ?? 0,
      commentCount: result.Attributes.commentCount ?? 0,
      sortOrder: result.Attributes.sortOrder ?? 0,
      createdAt: result.Attributes.createdAt,
      updatedAt: result.Attributes.updatedAt,
      completedAt: result.Attributes.completedAt,
    };

    return NextResponse.json(task);
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbAvailable()) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  try {
    // First get the task to find the projectId
    const getResult = await ddb().send(
      new GetCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: taskSk(id),
        },
      })
    );

    if (!getResult.Item) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const projectId = getResult.Item.projectId;

    // Delete the task
    await ddb().send(
      new DeleteCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: taskSk(id),
        },
      })
    );

    // Decrement the project's taskCount
    await ddb().send(
      new UpdateCommand({
        TableName: tableName(),
        Key: {
          pk: userPk(user.userId),
          sk: projectSk(projectId),
        },
        UpdateExpression: "SET taskCount = if_not_exists(taskCount, :one) - :one, updatedAt = :now",
        ExpressionAttributeValues: {
          ":one": 1,
          ":now": new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
