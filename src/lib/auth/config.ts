/**
 * Cognito OAuth config — AWS backend identity for Artispreneur Agent.
 * Public client IDs are safe in the browser; secrets stay server-only.
 */

export type CognitoConfig = {
  region: string;
  userPoolId: string;
  clientId: string;
  domain: string; // e.g. artispreneur-agent.auth.us-east-1.amazoncognito.com
  redirectUri: string;
};

export function getCognitoConfig(origin?: string): CognitoConfig | null {
  const region = process.env.COGNITO_REGION || process.env.AWS_REGION || "us-east-1";
  const userPoolId = process.env.COGNITO_USER_POOL_ID || "";
  const clientId = process.env.COGNITO_CLIENT_ID || "";
  const domain = (process.env.COGNITO_DOMAIN || "").replace(/^https?:\/\//, "");
  const appUrl = process.env.APP_URL || origin || "http://localhost:3000";
  const redirectUri =
    process.env.COGNITO_REDIRECT_URI || `${appUrl.replace(/\/$/, "")}/api/auth/callback`;

  if (!userPoolId || !clientId || !domain) return null;

  return { region, userPoolId, clientId, domain, redirectUri };
}

export function isCognitoConfigured(): boolean {
  return getCognitoConfig() !== null;
}

/** Local-only bypass when Cognito env is missing (never enable in production). */
export function isAuthDevBypass(): boolean {
  return (
    process.env.AUTH_DEV_BYPASS === "1" &&
    process.env.NODE_ENV !== "production" &&
    !isCognitoConfigured()
  );
}

// These are the names actually written and read. They previously disagreed
// with the literals in session.ts / the auth routes ("aa_session",
// "aa_pkce_verifier"); nothing imported the wrong values, but any future
// import would have silently read a cookie that is never set.
export const SESSION_COOKIE = "aa_session";
export const PKCE_VERIFIER_COOKIE = "aa_pkce_verifier";
export const OAUTH_STATE_COOKIE = "artispreneur_oauth_state";
export const OAUTH_RETURN_COOKIE = "artispreneur_oauth_return";
