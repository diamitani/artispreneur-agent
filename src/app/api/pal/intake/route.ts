import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { compilePalIntake, type IntakeAnswers } from "@/lib/rostr/pal-compiler";
import { persistIntakeToDisk, saveIntakeMemory } from "@/lib/rostr/intake-store";
import { PATRICK_DEMO_ANSWERS } from "@/lib/rostr/onboarding-questions";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * PAL intake — compile the onboarding questionnaire into Master Soul.md.
 *
 * This route previously used `@/lib/pal/compiler` and wrote to a flat hub key
 * (`{userId}/00-config/soul.md`) through the non-scoped hub API. The Hermes
 * runtime reads `00-config/master-soul.md` from the *tenancy-scoped* workspace,
 * so nothing the artist filled in ever reached their agent — `soul_loaded`
 * stayed false no matter how many times they completed onboarding.
 *
 * It now runs the ROSTR compiler and persists via `persistIntakeToDisk`, which
 * writes master-soul.md, artist-profile.json, workspace-config.json,
 * permissions.yaml, and the NPAO plan to the correct scope, and syncs the
 * instance registry.
 */
const Body = z.object({
  /** Answers keyed by field id — see src/lib/rostr/onboarding-questions.ts */
  answers: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
  /** "demo" / "patrick" load the seeded example answers for a preview. */
  seed: z.string().optional(),
  /** Set false to preview a compile without writing to the workspace. */
  persist: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const answers: IntakeAnswers =
    parsed.data.seed === "demo" || parsed.data.seed === "patrick"
      ? { ...PATRICK_DEMO_ANSWERS }
      : (parsed.data.answers ?? {});

  if (!Object.keys(answers).length) {
    return NextResponse.json({ ok: false, error: "No answers supplied." }, { status: 400 });
  }

  try {
    const result = compilePalIntake({ userId: session.sub, answers });

    // The compiler derives an artist_id by slugifying the stage name. Force it
    // to the session's project id so the Soul lands in the workspace this
    // user's agent actually reads, rather than a parallel one keyed by name.
    result.workspace_config.artist_id = session.projectId;

    saveIntakeMemory(result);

    let workspacePath: string | null = null;
    if (parsed.data.persist !== false) {
      workspacePath = await persistIntakeToDisk(result);
    }

    return NextResponse.json({
      ok: true,
      persisted: parsed.data.persist !== false,
      workspace_path: workspacePath,
      result,
    });
  } catch (e) {
    console.error("[pal/intake]", e);
    // Logged above with the detail. The client gets a fixed string — this path
    // reaches S3 and DynamoDB, whose errors name buckets, tables, and accounts.
    return NextResponse.json(
      { ok: false, error: "Could not compile your intake. Try again." },
      { status: 500 },
    );
  }
}
