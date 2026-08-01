import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, confirmSignUp, signIn } from "@/lib/auth/cognito-direct";
import { createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(12),
  /** When present, the artist is signed in immediately after confirming. */
  password: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter the code from your email.", code: "invalid_input" },
      { status: 400 },
    );
  }

  try {
    await confirmSignUp(parsed.data.email, parsed.data.code);

    if (parsed.data.password) {
      const tokens = await signIn(parsed.data.email, parsed.data.password);
      await createSession(tokens);
      return NextResponse.json({ ok: true, signedIn: true });
    }

    return NextResponse.json({ ok: true, signedIn: false });
  } catch (e) {
    const err = e instanceof AuthError ? e : null;
    return NextResponse.json(
      { error: err?.message ?? "Confirmation failed.", code: err?.code ?? "auth_error" },
      { status: err?.status ?? 500 },
    );
  }
}
