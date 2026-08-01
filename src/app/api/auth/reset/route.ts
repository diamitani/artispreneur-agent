import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, confirmForgotPassword, passwordIssues, signIn } from "@/lib/auth/cognito-direct";
import { createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(12),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter the code and a new password.", code: "invalid_input" },
      { status: 400 },
    );
  }

  const issues = passwordIssues(parsed.data.password);
  if (issues.length) {
    return NextResponse.json(
      { error: `Password needs: ${issues.join(", ").toLowerCase()}.`, code: "weak_password" },
      { status: 400 },
    );
  }

  try {
    await confirmForgotPassword(parsed.data);
    const tokens = await signIn(parsed.data.email, parsed.data.password);
    await createSession(tokens);
    return NextResponse.json({ ok: true, signedIn: true });
  } catch (e) {
    const err = e instanceof AuthError ? e : null;
    return NextResponse.json(
      { error: err?.message ?? "Could not reset your password.", code: err?.code ?? "auth_error" },
      { status: err?.status ?? 500 },
    );
  }
}
