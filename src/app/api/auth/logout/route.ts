import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";

/**
 * GET /api/auth/logout
 *
 * Clears the session cookie and redirects to the homepage.
 */
export async function GET(): Promise<NextResponse> {
  await clearSession();

  return NextResponse.redirect(
    new URL("/", process.env.APP_URL ?? "http://localhost:3000")
  );
}
