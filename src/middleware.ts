import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "artispreneur_session";

/** Soft-protect Agent product surfaces. Marketing stays public. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth =
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/skills/library") ||
    pathname.startsWith("/dashboard");

  if (!needsAuth) return NextResponse.next();

  // Dev bypass: allow through when AUTH_DEV_BYPASS=1 and Cognito unset
  const cognitoReady = Boolean(
    process.env.COGNITO_USER_POOL_ID &&
      process.env.COGNITO_CLIENT_ID &&
      process.env.COGNITO_DOMAIN,
  );
  const bypass =
    process.env.AUTH_DEV_BYPASS === "1" &&
    process.env.NODE_ENV !== "production" &&
    !cognitoReady;

  if (bypass) return NextResponse.next();

  // If Cognito is not configured yet, do not hard-block (pre-launch)
  if (!cognitoReady) return NextResponse.next();

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (session) return NextResponse.next();

  const login = new URL("/api/auth/login", req.url);
  login.searchParams.set("return", pathname + req.nextUrl.search);
  if (pathname.startsWith("/onboarding")) {
    login.searchParams.set("signup", "1");
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/workspace/:path*", "/onboarding/:path*", "/skills/library/:path*", "/dashboard/:path*"],
};
