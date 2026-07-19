import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/auth/session";
import { buildLogoutUrl, getCognitoConfig } from "@/lib/auth";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  await clearSessionCookies();

  const cfg = getCognitoConfig(origin);
  const logoutUri = process.env.COGNITO_LOGOUT_URI || `${origin}/`;
  const hosted = cfg ? buildLogoutUrl(logoutUri) : null;

  return NextResponse.redirect(hosted || new URL("/", origin));
}
