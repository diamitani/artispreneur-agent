import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tableName } from "@/lib/db/client";
import { userPk, projectSk, taskSk } from "@/lib/db/schema";
import { hubWriteText, hubWriteJson } from "@/lib/hub/index";
import { onboardingIntakeSchema } from "@/lib/pal/schemas";
import { compileSoulMd, generateInitialTasks } from "@/lib/pal/compiler";
import { getSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  // Authenticate
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;

  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = onboardingIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const intake = parsed.data;

  // Compile Soul.MD
  const { soulMd, markdown } = compileSoulMd(intake);

  // Write Soul.MD to hub
  const hubKey = `${userId}/00-config/soul.md`;
  await hubWriteText(hubKey, markdown);

  // Also persist structured SoulMd as JSON for programmatic access
  const soulJsonKey = `${userId}/00-config/soul.json`;
  await hubWriteJson(soulJsonKey, soulMd);

  // Create default project in DynamoDB
  const now = new Date().toISOString();
  const projectId = crypto.randomUUID();

  await ddb().send(
    new PutCommand({
      TableName: tableName(),
      Item: {
        pk: userPk(userId),
        sk: projectSk(projectId),
        gsi1pk: `PROJECT#${projectId}`,
        gsi1sk: userPk(userId),
        id: projectId,
        userId,
        name: `${intake.artistName} — Main Workspace`,
        description: `Primary workspace for ${intake.artistName}. Mode: ${intake.mode}.`,
        color: "#CC0000",
        status: "active",
        defaultView: "kanban",
        taskCount: 0,
        createdAt: now,
        updatedAt: now,
      },
    })
  );

  // Generate and create initial NPAO tasks
  const starterTasks = generateInitialTasks(intake);
  let taskCount = 0;

  for (const task of starterTasks) {
    const taskId = crypto.randomUUID();
    taskCount++;

    await ddb().send(
      new PutCommand({
        TableName: tableName(),
        Item: {
          pk: userPk(userId),
          sk: taskSk(taskId),
          gsi1pk: `PROJECT#${projectId}`,
          gsi1sk: taskSk(taskId),
          id: taskId,
          projectId,
          userId,
          title: task.title,
          description: task.description,
          status: "todo",
          priority: task.priority,
          npaoPhase: task.npaoPhase,
          tags: [],
          subtaskCount: 0,
          subtasksDone: 0,
          commentCount: 0,
          sortOrder: taskCount,
          createdAt: now,
          updatedAt: now,
        },
      })
    );
  }

  // Update project task count
  await ddb().send(
    new PutCommand({
      TableName: tableName(),
      Item: {
        pk: userPk(userId),
        sk: projectSk(projectId),
        gsi1pk: `PROJECT#${projectId}`,
        gsi1sk: userPk(userId),
        id: projectId,
        userId,
        name: `${intake.artistName} — Main Workspace`,
        description: `Primary workspace for ${intake.artistName}. Mode: ${intake.mode}.`,
        color: "#CC0000",
        status: "active",
        defaultView: "kanban",
        taskCount,
        createdAt: now,
        updatedAt: now,
      },
    })
  );

  // Update user profile: mark onboarding as completed
  await ddb().send(
    new PutCommand({
      TableName: tableName(),
      Item: {
        pk: userPk(userId),
        sk: "PROFILE",
        userId,
        email: session.email,
        name: session.name,
        artistName: intake.artistName,
        mode: intake.mode,
        plan: session.plan ?? "starter",
        onboardingCompleted: true,
        createdAt: now,
        updatedAt: now,
      },
    })
  );

  return NextResponse.json({
    success: true,
    redirect: "/dashboard",
    projectId,
    tasksCreated: taskCount,
  });
}
