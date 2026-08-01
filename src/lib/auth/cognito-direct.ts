/**
 * Direct Cognito authentication — server-side, no Hosted UI.
 *
 * The Hosted UI is an AWS-branded page we cannot restyle past a logo and a
 * few colours. These calls drive the same Cognito user pool through the
 * Identity Provider API instead, so sign-in and sign-up are ordinary
 * Artispreneur pages while identity still lives in AWS.
 *
 * Everything here runs on the server. The browser never sees the app client
 * secret and never holds a raw Cognito token — the session cookie issued by
 * `createSession` is the only credential the client carries.
 */

import { createHmac } from "node:crypto";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  DescribeUserPoolClientCommand,
  type AuthenticationResultType,
} from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoConfig } from "./config";

export class AuthError extends Error {
  constructor(
    message: string,
    /** Stable code the UI can branch on. */
    readonly code: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

let client: CognitoIdentityProviderClient | null = null;

function cognito() {
  const cfg = getCognitoConfig();
  if (!cfg) {
    throw new AuthError(
      "Sign-in is not configured on this deployment.",
      "not_configured",
      503,
    );
  }
  client ??= new CognitoIdentityProviderClient({ region: cfg.region });
  return { client, cfg };
}

export function isDirectAuthConfigured() {
  return getCognitoConfig() !== null;
}

/**
 * Cognito requires SECRET_HASH only when the app client was created with a
 * secret. A public client (the recommended setup for a web app) has none.
 */
function secretHash(username: string, clientId: string): string | undefined {
  const secret = process.env.COGNITO_CLIENT_SECRET;
  if (!secret) return undefined;
  return createHmac("sha256", secret)
    .update(username + clientId)
    .digest("base64");
}

/** Map Cognito's error names onto messages that are safe and useful to show. */
function translate(e: unknown): AuthError {
  const name = (e as { name?: string })?.name ?? "";
  const raw = (e as { message?: string })?.message ?? "Authentication failed.";

  switch (name) {
    case "NotAuthorizedException":
      // Deliberately identical to the unknown-user case — revealing which
      // half is wrong lets an attacker enumerate registered emails.
      return new AuthError("Incorrect email or password.", "invalid_credentials", 401);
    case "UserNotFoundException":
      return new AuthError("Incorrect email or password.", "invalid_credentials", 401);
    case "UserNotConfirmedException":
      return new AuthError(
        "Your email isn't verified yet. Check your inbox for the code.",
        "unconfirmed",
        403,
      );
    case "UsernameExistsException":
      return new AuthError(
        "An account with that email already exists.",
        "already_exists",
        409,
      );
    case "CodeMismatchException":
      return new AuthError("That code isn't right. Check it and try again.", "bad_code");
    case "ExpiredCodeException":
      return new AuthError(
        "That code has expired. Request a new one.",
        "expired_code",
      );
    case "InvalidPasswordException":
      return new AuthError(
        "Password doesn't meet the requirements: at least 8 characters, with an uppercase letter, a lowercase letter, and a number.",
        "weak_password",
      );
    case "InvalidParameterException":
      return new AuthError(raw, "invalid_parameter");
    case "LimitExceededException":
    case "TooManyRequestsException":
    case "TooManyFailedAttemptsException":
      return new AuthError(
        "Too many attempts. Wait a few minutes and try again.",
        "rate_limited",
        429,
      );
    case "PasswordResetRequiredException":
      return new AuthError(
        "You need to reset your password before signing in.",
        "reset_required",
        403,
      );
    default:
      return new AuthError(raw, "auth_error", 500);
  }
}

function toTokens(result: AuthenticationResultType | undefined) {
  if (!result?.IdToken || !result.AccessToken) {
    throw new AuthError("Cognito did not return a session.", "no_session", 500);
  }
  return {
    id_token: result.IdToken,
    access_token: result.AccessToken,
    // Refresh tokens are absent on some challenge flows; the session layer
    // treats an empty string as "nothing to refresh with".
    refresh_token: result.RefreshToken ?? "",
  };
}

// ── Operations ──────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const { client, cfg } = cognito();
  const username = email.trim().toLowerCase();

  try {
    const res = await client.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: cfg.clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          ...(secretHash(username, cfg.clientId)
            ? { SECRET_HASH: secretHash(username, cfg.clientId)! }
            : {}),
        },
      }),
    );

    // A challenge (MFA, forced password change) needs a UI we do not have
    // yet — fail loudly rather than pretending sign-in succeeded.
    if (res.ChallengeName) {
      throw new AuthError(
        `This account requires an additional step (${res.ChallengeName}) that isn't supported yet.`,
        "challenge_required",
        501,
      );
    }

    return toTokens(res.AuthenticationResult);
  } catch (e) {
    if (e instanceof AuthError) throw e;
    throw translate(e);
  }
}

export async function signUp(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const { client, cfg } = cognito();
  const username = input.email.trim().toLowerCase();

  try {
    const res = await client.send(
      new SignUpCommand({
        ClientId: cfg.clientId,
        Username: username,
        Password: input.password,
        UserAttributes: [
          { Name: "email", Value: username },
          ...(input.name?.trim()
            ? [{ Name: "name", Value: input.name.trim() }]
            : []),
        ],
        ...(secretHash(username, cfg.clientId)
          ? { SecretHash: secretHash(username, cfg.clientId)! }
          : {}),
      }),
    );

    return {
      /** False when the pool is set to auto-confirm. */
      needsConfirmation: !res.UserConfirmed,
      destination: res.CodeDeliveryDetails?.Destination ?? null,
    };
  } catch (e) {
    throw translate(e);
  }
}

export async function confirmSignUp(email: string, code: string) {
  const { client, cfg } = cognito();
  const username = email.trim().toLowerCase();

  try {
    await client.send(
      new ConfirmSignUpCommand({
        ClientId: cfg.clientId,
        Username: username,
        ConfirmationCode: code.trim(),
        ...(secretHash(username, cfg.clientId)
          ? { SecretHash: secretHash(username, cfg.clientId)! }
          : {}),
      }),
    );
  } catch (e) {
    throw translate(e);
  }
}

export async function resendCode(email: string) {
  const { client, cfg } = cognito();
  const username = email.trim().toLowerCase();

  try {
    const res = await client.send(
      new ResendConfirmationCodeCommand({
        ClientId: cfg.clientId,
        Username: username,
        ...(secretHash(username, cfg.clientId)
          ? { SecretHash: secretHash(username, cfg.clientId)! }
          : {}),
      }),
    );
    return { destination: res.CodeDeliveryDetails?.Destination ?? null };
  } catch (e) {
    throw translate(e);
  }
}

export async function forgotPassword(email: string) {
  const { client, cfg } = cognito();
  const username = email.trim().toLowerCase();

  try {
    const res = await client.send(
      new ForgotPasswordCommand({
        ClientId: cfg.clientId,
        Username: username,
        ...(secretHash(username, cfg.clientId)
          ? { SecretHash: secretHash(username, cfg.clientId)! }
          : {}),
      }),
    );
    return { destination: res.CodeDeliveryDetails?.Destination ?? null };
  } catch (e) {
    throw translate(e);
  }
}

export async function confirmForgotPassword(input: {
  email: string;
  code: string;
  password: string;
}) {
  const { client, cfg } = cognito();
  const username = input.email.trim().toLowerCase();

  try {
    await client.send(
      new ConfirmForgotPasswordCommand({
        ClientId: cfg.clientId,
        Username: username,
        ConfirmationCode: input.code.trim(),
        Password: input.password,
        ...(secretHash(username, cfg.clientId)
          ? { SecretHash: secretHash(username, cfg.clientId)! }
          : {}),
      }),
    );
  } catch (e) {
    throw translate(e);
  }
}

/**
 * Verify the user pool client can actually serve the branded pages.
 *
 * The single most common misconfiguration is an app client without
 * ALLOW_USER_PASSWORD_AUTH, which fails only at a real user's first sign-in
 * with an opaque InvalidParameterException. This surfaces it up front.
 *
 * Requires `cognito-idp:DescribeUserPoolClient`. If the runtime role lacks it,
 * that is reported as unknown rather than as a failure.
 */
export async function authPreflight(): Promise<{
  configured: boolean;
  ready: boolean | null;
  authFlows: string[];
  hasClientSecret: boolean;
  issues: string[];
}> {
  const cfg = getCognitoConfig();
  if (!cfg) {
    return {
      configured: false,
      ready: false,
      authFlows: [],
      hasClientSecret: false,
      issues: ["COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID are not set."],
    };
  }

  const { client } = cognito();
  const issues: string[] = [];

  try {
    const res = await client.send(
      new DescribeUserPoolClientCommand({
        UserPoolId: cfg.userPoolId,
        ClientId: cfg.clientId,
      }),
    );

    const flows = res.UserPoolClient?.ExplicitAuthFlows ?? [];
    const hasSecret = Boolean(res.UserPoolClient?.ClientSecret);

    if (!flows.includes("ALLOW_USER_PASSWORD_AUTH")) {
      issues.push(
        "App client is missing ALLOW_USER_PASSWORD_AUTH — the branded sign-in pages cannot authenticate without it.",
      );
    }
    if (!flows.includes("ALLOW_REFRESH_TOKEN_AUTH")) {
      issues.push("App client is missing ALLOW_REFRESH_TOKEN_AUTH — sessions will not refresh.");
    }
    if (hasSecret && !process.env.COGNITO_CLIENT_SECRET) {
      issues.push(
        "App client has a secret but COGNITO_CLIENT_SECRET is not set — every call will fail on SECRET_HASH.",
      );
    }
    if (!hasSecret && process.env.COGNITO_CLIENT_SECRET) {
      issues.push(
        "COGNITO_CLIENT_SECRET is set but the app client has no secret — remove it or Cognito will reject the hash.",
      );
    }

    return {
      configured: true,
      ready: issues.length === 0,
      authFlows: flows,
      hasClientSecret: hasSecret,
      issues,
    };
  } catch (e) {
    const name = (e as { name?: string })?.name ?? "";
    // Missing describe permission is a gap in observability, not in auth.
    const permissionDenied =
      name === "AccessDeniedException" || name === "NotAuthorizedException";
    return {
      configured: true,
      ready: null,
      authFlows: [],
      hasClientSecret: Boolean(process.env.COGNITO_CLIENT_SECRET),
      issues: [
        permissionDenied
          ? "Could not read the app client — grant cognito-idp:DescribeUserPoolClient to check configuration automatically."
          : `Could not read the app client: ${(e as Error)?.message ?? name}`,
      ],
    };
  }
}

/** Cognito's default password policy, surfaced so the UI can show it live. */
export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "lower", label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "upper", label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "number", label: "A number", test: (p: string) => /[0-9]/.test(p) },
] as const;

export function passwordIssues(password: string) {
  return PASSWORD_RULES.filter((r) => !r.test(password)).map((r) => r.label);
}
