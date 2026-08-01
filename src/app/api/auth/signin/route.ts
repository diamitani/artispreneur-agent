import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, signIn } from "@/lib/auth/cognito-direct";
import { createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** Email + password sign-in against the Cognito user pool. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and password.", code: "invalid_input" },
      { status: 400 },
    );
  }

  try {
    const tokens = await signIn(parsed.data.email, parsed.data.password);
    await createSession(tokens);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof AuthError ? e : null;
    return NextResponse.json(
      {
        error: err?.message ?? "Sign-in failed.",
        code: err?.code ?? "auth_error",
        // Lets the UI jump straight to the code screen.
        email: err?.code === "unconfirmed" ? parsed.data.email : undefined,
      },
      { status: err?.status ?? 500 },
    );
  }
}
