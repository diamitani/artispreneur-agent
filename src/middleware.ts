import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isAuthDevBypass } from "@/lib/auth/config";

/**
 * Middleware for route protection.
 * Protects /dashboard/* and /onboarding/* routes.
 * Skips auth check when AUTH_DEV_BYPASS=1.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/deploy"];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Check if this route requires protection
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Dev bypass. Uses the same strict predicate as getSession() and
  // getSessionUser() — isAuthDevBypass() also requires NODE_ENV !== production
  // and Cognito to be unconfigured. A bare AUTH_DEV_BYPASS check here meant
  // that with the flag left on in a production deploy, middleware waved every
  // request through to a page whose own session check would then refuse it.
  if (isAuthDevBypass()) {
    return NextResponse.next();
  }

  // Check for session cookie presence
  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  if (!sessionCookie?.value) {
    // No session — redirect to sign in
    const signInUrl = new URL("/signin", request.url);
    // The auth pages read `next`; `return` was silently ignored,
    // so the user always landed on /dashboard instead of where they were going.
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Session cookie exists — allow request to proceed
  // Full verification happens in getSession() within pages/API routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/deploy/:path*"],
};
