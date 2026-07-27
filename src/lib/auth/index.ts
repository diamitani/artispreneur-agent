/**
 * Auth barrel.
 *
 * v3 rewrote `session.ts` around a `Session` of `{ userId, email, name, plan }`,
 * but the API routes across the app are written against a workspace-scoped
 * `SessionUser` (`sub` + `projectId` + `workspacePath`). Rather than rewrite
 * every route, this adapts the new session into that shape in one place —
 * derived server-side, so a caller can still only ever reach its own workspace.
 */

import {
  ORG,
  PRODUCT,
  TENANT,
  agentProjectScope,
  defaultProjectId,
  workspaceLogicalPath,
} from "@/lib/tenancy/hierarchy";
import { isAuthDevBypass } from "./config";
import { getSession } from "./session";

export {
  getCognitoConfig,
  isCognitoConfigured,
  isAuthDevBypass,
  SESSION_COOKIE,
  PKCE_VERIFIER_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_RETURN_COOKIE,
} from "./config";

export {
  generateCodeVerifier,
  generateCodeChallenge,
  buildAuthUrl,
  exchangeCode,
  refreshTokens,
  verifyToken,
  type TokenSet,
  type CognitoIdTokenPayload,
} from "./cognito";

export { createSession, getSession, clearSession, type SessionTokens } from "./session";

/** Workspace-scoped view of the signed-in user. */
export type SessionUser = {
  sub: string;
  email: string;
  name?: string;
  orgId: typeof ORG.id;
  tenantId: typeof TENANT.id;
  productId: typeof PRODUCT.id;
  projectId: string;
  workspacePath: string;
};

function toSessionUser(input: { sub: string; email: string; name?: string }): SessionUser {
  const projectId = defaultProjectId(input.sub, input.name);
  const scope = agentProjectScope(input.sub, projectId);
  return {
    sub: input.sub,
    email: input.email,
    name: input.name,
    orgId: ORG.id,
    tenantId: TENANT.id,
    productId: PRODUCT.id,
    projectId,
    workspacePath: workspaceLogicalPath(scope),
  };
}

/**
 * Current user as a workspace scope, or null when signed out.
 * Identity always comes from the verified session — never from request input.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isAuthDevBypass()) {
    return toSessionUser({
      sub: "dev-local-user",
      email: "dev@artispreneur.com",
      name: "Local Artist",
    });
  }

  const session = await getSession();
  if (!session?.userId) return null;

  return toSessionUser({
    sub: session.userId,
    email: session.email,
    name: session.name,
  });
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
