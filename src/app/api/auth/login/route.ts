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
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const isSignup = searchParams.get("signup") === "1";
  const returnTo = searchParams.get("return") ?? "/dashboard";

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
}
