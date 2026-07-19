import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getCognitoConfig,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
  PKCE_VERIFIER_COOKIE,
} from "@/lib/auth/config";
import { exchangeAuthCode, verifyIdToken } from "@/lib/auth/cognito";
import { setSessionCookies } from "@/lib/auth/session";
import { defaultProjectId } from "@/lib/tenancy/hierarchy";
import { ensureUserShell } from "@/lib/tenancy/user-shell";

/**
 * Cognito OAuth redirect target.
 * Exchanges code → ID token, provisions Diamitani→Artispreneur→Agent user shell.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent(error)}`, origin),
    );
  }

  const cfg = getCognitoConfig(origin);
  if (!cfg || !code) {
    return NextResponse.redirect(new URL("/?auth_error=missing_code", origin));
  }

  const jar = await cookies();
  const savedState = jar.get(OAUTH_STATE_COOKIE)?.value;
  const verifier = jar.get(PKCE_VERIFIER_COOKIE)?.value;
  const returnTo = jar.get(OAUTH_RETURN_COOKIE)?.value || "/onboarding";

  jar.delete(OAUTH_STATE_COOKIE);
  jar.delete(PKCE_VERIFIER_COOKIE);
  jar.delete(OAUTH_RETURN_COOKIE);

  if (!savedState || !state || savedState !== state || !verifier) {
    return NextResponse.redirect(new URL("/?auth_error=invalid_state", origin));
  }

  const tokens = await exchangeAuthCode({
    code,
    redirectUri: cfg.redirectUri,
    codeVerifier: verifier,
  });

  if (!tokens?.id_token) {
    return NextResponse.redirect(new URL("/?auth_error=exchange_failed", origin));
  }

  const claims = await verifyIdToken(tokens.id_token);
  if (!claims) {
    return NextResponse.redirect(new URL("/?auth_error=invalid_token", origin));
  }

  const projectId = defaultProjectId(claims.sub, claims.name);
  await setSessionCookies({
    idToken: tokens.id_token,
    refreshToken: tokens.refresh_token,
    projectId,
  });

  await ensureUserShell({
    userId: claims.sub,
    email: claims.email,
    name: claims.name,
    projectId,
  });

  return NextResponse.redirect(new URL(returnTo, origin));
}
