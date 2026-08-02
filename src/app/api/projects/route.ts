import { NextRequest, NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, isDbConfigured, tableName } from "@/lib/db/client";
import { userPk, projectSk } from "@/lib/db/schema";
import { getApiUser } from "@/lib/auth/api-utils";
import { getAwsInstanceProject } from "@/lib/aws/instance-registry";
import { defaultProjectId } from "@/lib/tenancy/hierarchy";
import { maxProjectsFor } from "@/lib/billing/plans";
import type { Project, ProjectView } from "@/types/project";

const COLOR_PALETTE = [
  "#CC0000", "#FED001", "#3B82F6", "#10B981", "#8B5CF6",
  "#F59E0B", "#EF4444", "#06B6D4", "#EC4899", "#14B8A6",
];

export async function GET() {
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
          ":skPrefix": "PROJECT#",
        },
      })
    );

    const projects: Project[] = (result.Items ?? []).map((item) => ({
      id: item.id,
      userId: item.userId,
      name: item.name,
      description: item.description,
      color: item.color,
      icon: item.icon,
      status: item.status,
      defaultView: item.defaultView,
      taskCount: item.taskCount ?? 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to list projects:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, color, icon, defaultView } = body as {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    defaultView?: ProjectView;
  };

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // The Free plan advertises "1 active project"; nothing enforced it before.
  if (isDbConfigured()) {
    const project = await getAwsInstanceProject(user.userId, defaultProjectId(user.userId)).catch(
      () => null,
    );
    const limit = maxProjectsFor(project?.plan);
    if (limit !== null) {
      const existing = await ddb().send(
        new QueryCommand({
          TableName: tableName(),
          KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
          ExpressionAttributeValues: {
            ":pk": userPk(user.userId),
            ":skPrefix": "PROJECT#",
          },
          Select: "COUNT",
        }),
      );
      if ((existing.Count ?? 0) >= limit) {
        return NextResponse.json(
          {
            error: `Your plan includes ${limit} active project. Upgrade for unlimited projects.`,
            code: "plan_limit",
            upgrade: "/dashboard/settings",
          },
          { status: 402 },
        );
      }
    }
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const project: Project = {
    id,
    userId: user.userId,
    name: name.trim(),
    description: description?.trim(),
    color: color ?? COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)] ?? "#CC0000",
    icon,
    status: "active",
    defaultView: defaultView ?? "kanban",
    taskCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  if (!isDbConfigured()) {
    // Previously this returned 201 with a project that was never persisted —
    // the user saw success and lost the data on the next page load.
    console.error("[projects] DYNAMODB_TABLE is not configured; refusing to fake a write");
    return NextResponse.json(
      { error: "Storage is not configured on this deployment." },
      { status: 503 },
    );
  }

  try {
    await ddb().send(
      new PutCommand({
        TableName: tableName(),
        Item: {
          pk: userPk(user.userId),
          sk: projectSk(id),
          gsi1pk: `PROJECT#${id}`,
          gsi1sk: `PROJECT#${id}`,
          ...project,
        },
      })
    );

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
