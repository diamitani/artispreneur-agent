import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/login — legacy entry point, now a redirect to the branded pages.
 *
 * This used to start a PKCE flow against the Cognito Hosted UI, which is the
 * AWS-branded page users reported landing on. Sign-in and sign-up are handled
 * by /signin and /signup, which drive the same user pool through the Identity
 * Provider API.
 *
 * The route is kept rather than deleted so stale bookmarks, cached marketing
 * HTML, and links in already-sent emails heal instead of 404ing. The OAuth
 * callback at /api/auth/callback stays in place for social sign-in later.
 *
 * Query params:
 *   signup=1        → /signup
 *   return= / next= → forwarded as `next` (same-origin paths only)
 */
export function GET(request: NextRequest): NextResponse {
  const { searchParams } = request.nextUrl;
  const isSignup = searchParams.get("signup") === "1";

  // Accept both spellings — this route historically used `return`, while the
  // branded pages read `next`.
  const requested = searchParams.get("next") ?? searchParams.get("return") ?? "";

  // Only same-origin paths: an absolute URL here would make this an open
  // redirect that a phishing link could point anywhere.
  const next =
    requested.startsWith("/") && !requested.startsWith("//")
      ? requested
      : isSignup
        ? "/onboarding"
        : "/dashboard";

  const target = `${isSignup ? "/signup" : "/signin"}?next=${encodeURIComponent(next)}`;

  return NextResponse.redirect(new URL(target, request.url));
}
