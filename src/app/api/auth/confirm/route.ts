import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, confirmSignUp, signIn } from "@/lib/auth/cognito-direct";
import { buildSessionCookie } from "@/lib/auth/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(12),
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
      const { session, cookieHeader } = await buildSessionCookie(tokens);
      const res = NextResponse.json({ ok: true, signedIn: true, session });
      res.headers.set("Set-Cookie", cookieHeader);
      return res;
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
