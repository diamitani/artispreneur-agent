import { NextRequest, NextResponse } from "next/server";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  buildAuthUrl,
} from "@/lib/auth/cognito";

/**
 * GET /api/auth/login
 *
 * Initiates the Cognito OAuth PKCE flow.
 * Query params:
 *   - signup: "1" to open the signup page instead
 *   - return: URL to redirect to after authentication
 */

/** Everything that must be present before a sign-in can even start. */
const REQUIRED_ENV = [
  "COGNITO_USER_POOL_ID",
  "COGNITO_CLIENT_ID",
  "COGNITO_DOMAIN",
  "COGNITO_REDIRECT_URI",
  "SESSION_SECRET",
] as const;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const isSignup = searchParams.get("signup") === "1";
  const returnTo = searchParams.get("return") ?? "/dashboard";

  // Fail usefully. Previously a missing variable threw deep inside
  // buildAuthUrl and surfaced as a bare 500 that told the operator nothing.
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]?.trim());
  if (missing.length) {
    console.error("[auth/login] Sign-in unavailable, missing env:", missing.join(", "));
    const url = new URL("/signin", request.url);
    url.searchParams.set("error", "not_configured");
    url.searchParams.set("missing", missing.join(","));
    return NextResponse.redirect(url);
  }

  try {
    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Build the Cognito authorization URL
    const authUrl = buildAuthUrl({
      signup: isSignup,
      returnTo,
      codeChallenge,
    });

    // Create response that redirects to Cognito
    const response = NextResponse.redirect(authUrl);

    // Store code_verifier in a short-lived, HTTP-only cookie for the callback
    response.cookies.set("aa_pkce_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (err) {
    console.error("[auth/login] Failed to build authorization URL:", err);
    const url = new URL("/signin", request.url);
    url.searchParams.set("error", "login_failed");
    return NextResponse.redirect(url);
  }
}
