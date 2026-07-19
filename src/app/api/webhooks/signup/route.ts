import { NextResponse } from "next/server";
import { compilePalIntake, type IntakeAnswers } from "@/lib/rostr/pal-compiler";
import { persistIntakeToDisk, saveIntakeMemory } from "@/lib/rostr/intake-store";

/**
 * Signup → PAL trigger
 * Auth providers (Clerk/Cognito/etc.) can POST here after account creation.
 * If answers aren't ready yet, we create a stub workspace and send the user to /onboarding.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      userId: string;
      email?: string;
      name?: string;
      answers?: IntakeAnswers;
    };

    if (!body.userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    if (!body.answers || Object.keys(body.answers).length === 0) {
      return NextResponse.json({
        ok: true,
        status: "awaiting_onboarding",
        redirect: "/onboarding",
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
      persistedTo,
      result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup webhook failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
