import { NextRequest, NextResponse } from "next/server";
import { GetCommand, UpdateCommand, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tableName } from "@/lib/db/client";
import { userPk, projectSk } from "@/lib/db/schema";
import { getApiUser } from "@/lib/auth/api-utils";
import type { Project, ProjectStatus, ProjectView } from "@/types/project";

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
          sk: projectSk(id),
        },
      })
    );

    if (!result.Item) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project: Project = {
      id: result.Item.id,
      userId: result.Item.userId,
      name: result.Item.name,
      description: result.Item.description,
      color: result.Item.color,
      icon: result.Item.icon,
      status: result.Item.status,
      defaultView: result.Item.defaultView,
      taskCount: result.Item.taskCount ?? 0,
      createdAt: result.Item.createdAt,
      updatedAt: result.Item.updatedAt,
    };

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to get project:", error);
    return NextResponse.json({ error: "Failed to get project" }, { status: 500 });
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
  const { name, description, color, icon, status, defaultView } = body as {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    status?: ProjectStatus;
    defaultView?: ProjectView;
  };

  const updates: string[] = [];
  const expressionValues: Record<string, unknown> = {};
  const expressionNames: Record<string, string> = {};

  if (name !== undefined) {
    updates.push("#name = :name");
    expressionNames["#name"] = "name";
    expressionValues[":name"] = name.trim();
  }
  if (description !== undefined) {
    updates.push("description = :description");
    expressionValues[":description"] = description?.trim();
  }
  if (color !== undefined) {
    updates.push("color = :color");
    expressionValues[":color"] = color;
  }
  if (icon !== undefined) {
    updates.push("icon = :icon");
    expressionValues[":icon"] = icon;
  }
  if (status !== undefined) {
    updates.push("#status = :status");
    expressionNames["#status"] = "status";
    expressionValues[":status"] = status;
  }
  if (defaultView !== undefined) {
    updates.push("defaultView = :defaultView");
    expressionValues[":defaultView"] = defaultView;
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
          sk: projectSk(id),
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
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project: Project = {
      id: result.Attributes.id,
      userId: result.Attributes.userId,
      name: result.Attributes.name,
      description: result.Attributes.description,
      color: result.Attributes.color,
      icon: result.Attributes.icon,
      status: result.Attributes.status,
      defaultView: result.Attributes.defaultView,
      taskCount: result.Attributes.taskCount ?? 0,
      createdAt: result.Attributes.createdAt,
      updatedAt: result.Attributes.updatedAt,
    };

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
    // Query all tasks for this project via GSI1
    const tasksResult = await ddb().send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: "GSI1",
        KeyConditionExpression: "gsi1pk = :gsi1pk AND begins_with(gsi1sk, :gsi1skPrefix)",
        ExpressionAttributeValues: {
          ":gsi1pk": `PROJECT#${id}`,
          ":gsi1skPrefix": "TASK#",
        },
      })
    );

    const taskItems = tasksResult.Items ?? [];

    // Batch delete tasks and the project
    const deleteRequests = [
      // Delete the project itself
      { DeleteRequest: { Key: { pk: userPk(user.userId), sk: projectSk(id) } } },
      // Delete all tasks
      ...taskItems.map((item) => ({
        DeleteRequest: { Key: { pk: item.pk, sk: item.sk } },
      })),
    ];

    // DynamoDB BatchWrite supports max 25 items per request
    const batches = [];
    for (let i = 0; i < deleteRequests.length; i += 25) {
      batches.push(deleteRequests.slice(i, i + 25));
    }

    for (const batch of batches) {
      await ddb().send(
        new BatchWriteCommand({
          RequestItems: {
            [tableName()]: batch,
          },
        })
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
