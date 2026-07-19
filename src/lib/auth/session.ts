import { cookies } from "next/headers";
import {
  isAuthDevBypass,
  SESSION_COOKIE,
} from "./config";
import { verifyIdToken, type CognitoClaims } from "./cognito";
import {
  ORG,
  PRODUCT,
  TENANT,
  agentProjectScope,
  defaultProjectId,
  workspaceLogicalPath,
} from "@/lib/tenancy/hierarchy";

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

type SessionPayload = {
  idToken: string;
  refreshToken?: string;
  projectId?: string;
};

export function sessionCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function setSessionCookies(payload: SessionPayload) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, JSON.stringify(payload), sessionCookieOptions());
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function readSessionPayload(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

function claimsToUser(claims: CognitoClaims, projectId?: string): SessionUser {
  const pid = projectId || defaultProjectId(claims.sub, claims.name);
  const scope = agentProjectScope(claims.sub, pid);
  return {
    sub: claims.sub,
    email: claims.email,
    name: claims.name,
    orgId: ORG.id,
    tenantId: TENANT.id,
    productId: PRODUCT.id,
    projectId: pid,
    workspacePath: workspaceLogicalPath(scope),
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (isAuthDevBypass()) {
    const sub = "dev-local-user";
    const projectId = defaultProjectId(sub, "Local Artist");
    const scope = agentProjectScope(sub, projectId);
    return {
      sub,
      email: "dev@artispreneur.com",
      name: "Local Artist",
      orgId: ORG.id,
      tenantId: TENANT.id,
      productId: PRODUCT.id,
      projectId,
      workspacePath: workspaceLogicalPath(scope),
    };
  }

  const payload = await readSessionPayload();
  if (!payload?.idToken) return null;

  const claims = await verifyIdToken(payload.idToken);
  if (!claims) return null;

  return claimsToUser(claims, payload.projectId);
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
