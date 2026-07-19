import { NextResponse } from "next/server";
import { compilePalIntake, type IntakeAnswers } from "@/lib/rostr/pal-compiler";
import { persistIntakeToDisk, saveIntakeMemory } from "@/lib/rostr/intake-store";
import { ensureUserShell } from "@/lib/tenancy/user-shell";
import { defaultProjectId } from "@/lib/tenancy/hierarchy";

/**
 * Cognito (or other IdP) post-signup hook.
 * Prefer browser OAuth via /api/auth/login → /api/auth/callback for interactive users.
 * This webhook supports Cognito PostConfirmation Lambda / Admin API provisioning.
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.PAL_WEBHOOK_SECRET;
    if (secret) {
      const provided =
        req.headers.get("x-pal-webhook-secret") ||
        req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
      if (provided !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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
    const message = err instanceof Error ? err.message : "Signup webhook failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
