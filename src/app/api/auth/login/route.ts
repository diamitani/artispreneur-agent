import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getCognitoConfig,
  isAuthDevBypass,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
  PKCE_VERIFIER_COOKIE,
} from "@/lib/auth/config";
import { buildHostedLoginUrl } from "@/lib/auth/cognito";
import { createPkce, randomState } from "@/lib/auth/pkce";
import { sessionCookieOptions, setSessionCookies } from "@/lib/auth/session";
import { defaultProjectId } from "@/lib/tenancy/hierarchy";

/**
 * Start Cognito Hosted UI OAuth (PKCE).
 * GET /api/auth/login?return=/onboarding&signup=1
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const returnTo = url.searchParams.get("return") || "/dashboard";
  const signup = url.searchParams.get("signup") === "1";
  const origin = url.origin;

  if (isAuthDevBypass()) {
    await setSessionCookies({
      idToken: "dev-bypass",
      projectId: defaultProjectId("dev-local-user", "Local Artist"),
    });
    return NextResponse.redirect(new URL(returnTo, origin));
  }

  const cfg = getCognitoConfig(origin);
  if (!cfg) {
    return NextResponse.json(
      {
        error: "Cognito is not configured",
        hint: "Set COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, COGNITO_DOMAIN in env.",
      },
      { status: 503 },
    );
  }

  const { verifier, challenge } = await createPkce();
  const state = randomState();
  const jar = await cookies();
  const opts = { ...sessionCookieOptions(600), httpOnly: true };

  jar.set(PKCE_VERIFIER_COOKIE, verifier, opts);
  jar.set(OAUTH_STATE_COOKIE, state, opts);
  jar.set(OAUTH_RETURN_COOKIE, returnTo.startsWith("/") ? returnTo : "/onboarding", opts);

  const loginUrl = buildHostedLoginUrl({
    redirectUri: cfg.redirectUri,
    state,
    codeChallenge: challenge,
    signup,
  });

  if (!loginUrl) {
    return NextResponse.json({ error: "Failed to build Cognito URL" }, { status: 500 });
  }

  return NextResponse.redirect(loginUrl);
}
