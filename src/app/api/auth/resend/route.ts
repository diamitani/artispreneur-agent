import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, resendCode } from "@/lib/auth/cognito-direct";

export const runtime = "nodejs";

const Body = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email.", code: "invalid_input" }, { status: 400 });
  }

  try {
    return NextResponse.json({ ok: true, ...(await resendCode(parsed.data.email)) });
  } catch (e) {
    const err = e instanceof AuthError ? e : null;
    return NextResponse.json(
      { error: err?.message ?? "Could not resend the code.", code: err?.code ?? "auth_error" },
      { status: err?.status ?? 500 },
    );
  }
}
