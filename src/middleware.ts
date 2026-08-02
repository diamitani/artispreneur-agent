import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/deploy"];
const SESSION_COOKIE = "aa_session";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) return NextResponse.next();

  if (process.env.AUTH_DEV_BYPASS === "1") return NextResponse.next();

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
