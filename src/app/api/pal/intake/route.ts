import { NextResponse } from "next/server";
import { compilePalIntake, type IntakeAnswers } from "@/lib/rostr/pal-compiler";
import { persistIntakeToDisk, saveIntakeMemory } from "@/lib/rostr/intake-store";
import { PATRICK_DEMO_ANSWERS } from "@/lib/rostr/onboarding-questions";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * PAL Roster Agent webhook
 *
 * POST /api/pal/intake
 * Body: { userId?: string, answers: IntakeAnswers, seed?: "patrick" }
 *
 * userId defaults to Cognito session sub when present.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      userId?: string;
      answers?: IntakeAnswers;
      seed?: string;
      persist?: boolean;
    };

    const session = await getSessionUser();

    const answers =
      body.seed === "patrick"
        ? (PATRICK_DEMO_ANSWERS as IntakeAnswers)
        : (body.answers ?? {});

    if (!body.seed && Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: "answers required (or seed: \"patrick\" for demo)" },
        { status: 400 },
      );
    }

    const result = compilePalIntake({
      userId: body.userId || session?.sub,
      answers,
    });

    saveIntakeMemory(result);

    let persistedTo: string | null = null;
    if (body.persist !== false) {
      persistedTo = await persistIntakeToDisk(result);
    }

    return NextResponse.json({
      ok: true,
      agent: "pal-roster",
      message: "PAL compilation complete — Master Soul and roster ready",
      persistedTo,
      result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PAL intake failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/** Health / discovery */
export async function GET() {
  return NextResponse.json({
    agent: "pal-roster",
    version: "2.0",
    webhook: "/api/pal/intake",
    methods: ["POST"],
    description:
      "ROSTR PAL Roster Agent — compiles onboarding into Master Soul.md, workspace config, and specialist roster",
    example: {
      userId: "user_123",
      answers: { stage_name: "Patrick Diamitani", mode: "label" },
      seed: "patrick",
    },
  });
}
