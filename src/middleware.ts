import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection.
 * Protects /dashboard/* and /onboarding/* routes.
 * Skips auth check when AUTH_DEV_BYPASS=1.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/deploy"];
const SESSION_COOKIE = "aa_session";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Check if this route requires protection
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Dev bypass — skip auth for local development without Cognito
  if (process.env.AUTH_DEV_BYPASS === "1") {
    return NextResponse.next();
  }

  // Check for session cookie presence
  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  if (!sessionCookie?.value) {
    // No session — redirect to sign in
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("return", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Session cookie exists — allow request to proceed
  // Full verification happens in getSession() within pages/API routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/deploy/:path*"],
};
