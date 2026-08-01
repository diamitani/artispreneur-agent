import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, passwordIssues, signUp } from "@/lib/auth/cognito-direct";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().max(120).optional(),
});

/** Create the Cognito user. Confirmation happens on /api/auth/confirm. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and a password of at least 8 characters.", code: "invalid_input" },
      { status: 400 },
    );
  }

  // Check locally first so the artist gets the full list of what's missing
  // rather than Cognito's one-at-a-time complaint.
  const issues = passwordIssues(parsed.data.password);
  if (issues.length) {
    return NextResponse.json(
      { error: `Password needs: ${issues.join(", ").toLowerCase()}.`, code: "weak_password" },
      { status: 400 },
    );
  }

  try {
    const result = await signUp(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const err = e instanceof AuthError ? e : null;
    return NextResponse.json(
      { error: err?.message ?? "Sign-up failed.", code: err?.code ?? "auth_error" },
      { status: err?.status ?? 500 },
    );
  }
}
