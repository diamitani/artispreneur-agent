import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, isAuthDevBypass } from "@/lib/auth/config";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/deploy"];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) return NextResponse.next();

  // Dev bypass. Uses the same strict predicate as getSession() and
  // getSessionUser() — isAuthDevBypass() also requires NODE_ENV !== production
  // and Cognito to be unconfigured. A bare AUTH_DEV_BYPASS check here meant
  // that with the flag left on in a production deploy, middleware waved every
  // request through to a page whose own session check would then refuse it.
  if (isAuthDevBypass()) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set("next", pathname);

  if (!sessionCookie?.value || sessionCookie.value.length < 64) {
    // No cookie or clearly malformed — clear it and redirect to sign in.
    const res = NextResponse.redirect(signInUrl);
    res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/deploy/:path*"],
};
