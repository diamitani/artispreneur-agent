import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { compilePalIntake, type IntakeAnswers } from "@/lib/rostr/pal-compiler";
import { persistIntakeToDisk, saveIntakeMemory } from "@/lib/rostr/intake-store";
import { ensureUserShell } from "@/lib/tenancy/user-shell";
import { defaultProjectId } from "@/lib/tenancy/hierarchy";

/** Constant-time compare that does not leak the secret's length either. */
function timingSafeEqualStrings(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * Cognito (or other IdP) post-signup hook.
 * Prefer browser OAuth via /api/auth/login → /api/auth/callback for interactive users.
 * This webhook supports Cognito PostConfirmation Lambda / Admin API provisioning.
 */
export async function POST(req: Request) {
  try {
    // Skip-if-unset was fail-open: with no PAL_WEBHOOK_SECRET this route
    // provisions a workspace and compiles a Master Soul for any `userId` a
    // stranger cares to POST. The secret is mandatory.
    const secret = process.env.PAL_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[webhooks/signup] PAL_WEBHOOK_SECRET is required");
      return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
    }
    const provided =
      req.headers.get("x-pal-webhook-secret") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!provided || !timingSafeEqualStrings(provided, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      userId: string;
      email?: string;
      name?: string;
      answers?: IntakeAnswers;
    };

    if (!body.userId) {
      return NextResponse.json({ error: "userId required (Cognito sub)" }, { status: 400 });
    }

    const projectId = defaultProjectId(
      body.userId,
      typeof body.answers?.stage_name === "string"
        ? body.answers.stage_name
        : body.name,
    );

    await ensureUserShell({
      userId: body.userId,
      email: body.email || `${body.userId}@users.artispreneur.com`,
      name: body.name,
      projectId,
    });

    if (!body.answers || Object.keys(body.answers).length === 0) {
      return NextResponse.json({
        ok: true,
        status: "awaiting_onboarding",
        redirect: "/onboarding",
        projectId,
        hierarchy: "diamitani-industries → artispreneur-com → agent",
        message: "Account created. Complete PAL onboarding to compile Master Soul.",
      });
    }

    const result = compilePalIntake({
      userId: body.userId,
      answers: {
        ...body.answers,
        legal_name: body.answers.legal_name || body.name,
        stage_name: body.answers.stage_name || body.name,
      },
    });
    saveIntakeMemory(result);
    const persistedTo = await persistIntakeToDisk(result);

    return NextResponse.json({
      ok: true,
      status: "compiled",
      redirect: `/workspace?artist=${result.workspace_config.artist_id}`,
      projectId: result.workspace_config.artist_id,
      persistedTo,
      result,
    });
  } catch (err) {
    // Never echo the internal error. This route reaches DynamoDB, S3, and the
    // PAL compiler, and their messages carry bucket names, table names, and
    // account ids.
    console.error("[webhooks/signup]", err);
    return NextResponse.json(
      { ok: false, error: "Signup webhook failed." },
      { status: 500 },
    );
  }
}
