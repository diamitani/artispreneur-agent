import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, forgotPassword } from "@/lib/auth/cognito-direct";

export const runtime = "nodejs";

const Body = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email.", code: "invalid_input" }, { status: 400 });
  }

  try {
    const result = await forgotPassword(parsed.data.email);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const err = e instanceof AuthError ? e : null;
    // Never confirm whether an address is registered.
    if (err?.code === "invalid_credentials") {
      return NextResponse.json({ ok: true, destination: null });
    }
    return NextResponse.json(
      { error: err?.message ?? "Could not start a reset.", code: err?.code ?? "auth_error" },
      { status: err?.status ?? 500 },
    );
  }
}
