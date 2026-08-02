import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, signIn } from "@/lib/auth/cognito-direct";
import { buildSessionCookie } from "@/lib/auth/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  returnTo: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and password.", code: "invalid_input" },
      { status: 400 },
    );
  }

  const returnTo = parsed.data.returnTo ?? "/dashboard";

  try {
    const tokens = await signIn(parsed.data.email, parsed.data.password);
    const { cookieHeader } = await buildSessionCookie(tokens);

    // Redirect with cookie in same response — avoids race between
    // Set-Cookie and the client-side window.location.href navigation.
    const res = NextResponse.redirect(
      new URL(returnTo, req.url),
      { status: 303 }
    );
    res.headers.set("Set-Cookie", cookieHeader);
    return res;
  } catch (e) {
    const err = e instanceof AuthError ? e : null;
    return NextResponse.json(
      {
        error: err?.message ?? "Sign-in failed.",
        code: err?.code ?? "auth_error",
        email: err?.code === "unconfirmed" ? parsed.data.email : undefined,
      },
      { status: err?.status ?? 500 },
    );
  }
}
