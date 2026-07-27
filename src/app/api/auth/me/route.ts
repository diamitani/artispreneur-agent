import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

/**
 * GET /api/auth/me
 *
 * Returns the current user session data as JSON, or 401 if not authenticated.
 */
export async function GET(): Promise<NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json(session);
}
