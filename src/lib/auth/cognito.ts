/**
 * Cognito Hosted UI OAuth (PKCE) + JWKS ID-token verification.
 * Pattern aligned with Diamitani FCRAgent / artispreneur-aws backends.
 */

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { getCognitoConfig } from "./config";

export type CognitoClaims = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  token_use?: string;
} & JWTPayload;

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function jwksFor(region: string, poolId: string) {
  const key = `${region}:${poolId}`;
  let jwks = jwksCache.get(key);
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(`https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`),
    );
    jwksCache.set(key, jwks);
  }
  return jwks;
}

export async function verifyIdToken(token: string): Promise<CognitoClaims | null> {
  const cfg = getCognitoConfig();
  if (!cfg) return null;

  try {
    const issuer = `https://cognito-idp.${cfg.region}.amazonaws.com/${cfg.userPoolId}`;
    const { payload } = await jwtVerify(token, jwksFor(cfg.region, cfg.userPoolId), {
      issuer,
    });

    if (payload.token_use === "id" && payload.aud !== cfg.clientId) return null;
    if (payload.token_use === "access" && payload.client_id !== cfg.clientId) return null;

    const sub = String(payload.sub || "");
    const email = String(payload.email || "").toLowerCase().trim();
    if (!sub || !email) return null;

    return {
      ...payload,
      sub,
      email,
      name: typeof payload.name === "string" ? payload.name : undefined,
      token_use: String(payload.token_use || ""),
    };
  } catch {
    return null;
  }
}

export async function exchangeAuthCode(params: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<{
  id_token: string;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
} | null> {
  const cfg = getCognitoConfig();
  if (!cfg) return null;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: cfg.clientId,
    code: params.code,
    redirect_uri: params.redirectUri,
    code_verifier: params.codeVerifier,
  });

  const res = await fetch(`https://${cfg.domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[cognito] token exchange failed", res.status, text.slice(0, 240));
    return null;
  }

  return (await res.json()) as {
    id_token: string;
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
}

export function buildHostedLoginUrl(opts: {
  redirectUri: string;
  state: string;
  codeChallenge: string;
  signup?: boolean;
}): string | null {
  const cfg = getCognitoConfig();
  if (!cfg) return null;

  const path = opts.signup ? "signup" : "login";
  const u = new URL(`https://${cfg.domain}/${path}`);
  u.searchParams.set("client_id", cfg.clientId);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", "openid email profile");
  u.searchParams.set("redirect_uri", opts.redirectUri);
  u.searchParams.set("state", opts.state);
  u.searchParams.set("code_challenge_method", "S256");
  u.searchParams.set("code_challenge", opts.codeChallenge);
  return u.toString();
}

export function buildLogoutUrl(logoutUri: string): string | null {
  const cfg = getCognitoConfig();
  if (!cfg) return null;
  const u = new URL(`https://${cfg.domain}/logout`);
  u.searchParams.set("client_id", cfg.clientId);
  u.searchParams.set("logout_uri", logoutUri);
  return u.toString();
}
