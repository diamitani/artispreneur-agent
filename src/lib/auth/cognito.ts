/**
 * Cognito PKCE helpers for OAuth 2.0 Authorization Code flow.
 * Uses Web Crypto API (Edge-compatible) and `jose` for JWKS verification.
 */

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

// ─── Environment helpers ───────────────────────────────────────────────────────

function env(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
}

function cognitoRegion(): string {
  return process.env.COGNITO_REGION ?? process.env.AWS_REGION ?? "us-east-1";
}

function cognitoPoolId(): string {
  return env("COGNITO_USER_POOL_ID");
}

function cognitoClientId(): string {
  return env("COGNITO_CLIENT_ID");
}

function cognitoDomain(): string {
  return env("COGNITO_DOMAIN");
}

function cognitoRedirectUri(): string {
  return env("COGNITO_REDIRECT_URI");
}

// ─── PKCE helpers (Web Crypto) ─────────────────────────────────────────────────

/**
 * Generate a cryptographically random code verifier (43-128 chars, URL-safe).
 */
export function generateCodeVerifier(): string {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return base64UrlEncode(buffer);
}

/**
 * Derive a code challenge from a code verifier using SHA-256.
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(buffer: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ─── Auth URL builder ──────────────────────────────────────────────────────────

export interface BuildAuthUrlOptions {
  signup?: boolean;
  returnTo?: string;
  codeChallenge: string;
}

/**
 * Build the Cognito Hosted UI authorization URL with PKCE.
 */
export function buildAuthUrl(options: BuildAuthUrlOptions): string {
  const domain = cognitoDomain();
  const clientId = cognitoClientId();
  const redirectUri = cognitoRedirectUri();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid email profile",
    code_challenge_method: "S256",
    code_challenge: options.codeChallenge,
  });

  // Encode returnTo in state so we can redirect after callback
  if (options.returnTo) {
    params.set("state", options.returnTo);
  }

  const baseUrl = `https://${domain}`;
  const path = options.signup ? "/signup" : "/oauth2/authorize";

  return `${baseUrl}${path}?${params.toString()}`;
}

// ─── Token exchange ────────────────────────────────────────────────────────────

export interface TokenSet {
  id_token: string;
  access_token: string;
  refresh_token: string;
}

/**
 * Exchange an authorization code for tokens using PKCE code_verifier.
 */
export async function exchangeCode(
  code: string,
  codeVerifier: string
): Promise<TokenSet> {
  const domain = cognitoDomain();
  const clientId = cognitoClientId();
  const redirectUri = cognitoRedirectUri();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
    code_verifier: codeVerifier,
  });

  const response = await fetch(`https://${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return {
    id_token: data.id_token,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  };
}

// ─── Token refresh ─────────────────────────────────────────────────────────────

/**
 * Refresh tokens using the refresh_token grant.
 */
export async function refreshTokens(
  refreshToken: string
): Promise<Omit<TokenSet, "refresh_token"> & { refresh_token?: string }> {
  const domain = cognitoDomain();
  const clientId = cognitoClientId();

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(`https://${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token refresh failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return {
    id_token: data.id_token,
    access_token: data.access_token,
    refresh_token: data.refresh_token, // may be undefined on refresh
  };
}

// ─── JWKS verification ─────────────────────────────────────────────────────────

let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!_jwks) {
    const region = cognitoRegion();
    const poolId = cognitoPoolId();
    const issuer = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;
    _jwks = createRemoteJWKSet(
      new URL(`${issuer}/.well-known/jwks.json`)
    );
  }
  return _jwks;
}

export interface CognitoIdTokenPayload extends JWTPayload {
  sub: string;
  email?: string;
  name?: string;
  "cognito:username"?: string;
  email_verified?: boolean;
  token_use?: string;
}

/**
 * Verify a Cognito JWT (id_token or access_token) against the JWKS endpoint.
 * Returns the decoded payload.
 */
export async function verifyToken(token: string): Promise<CognitoIdTokenPayload> {
  const region = cognitoRegion();
  const poolId = cognitoPoolId();
  const clientId = cognitoClientId();
  const issuer = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;

  const jwks = getJWKS();

  const { payload } = await jwtVerify(token, jwks, {
    issuer,
    audience: clientId,
  });

  return payload as CognitoIdTokenPayload;
}
