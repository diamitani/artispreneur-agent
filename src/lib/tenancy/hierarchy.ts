/**
 * Workspace hierarchy (AWS-backed Rostr Hub paths)
 *
 * Diamitani Industries          → org (holding)
 *   └── artispreneur.com        → tenant (product family)
 *         └── agent             → product (this app)
 *               └── users/{sub} → Cognito identity
 *                     └── projects/{id} → artist workspace / web apps / etc.
 */

import path from "path";

export const ORG = {
  id: "diamitani-industries",
  name: "Diamitani Industries",
  slug: "diamitani-industries",
} as const;

export const TENANT = {
  id: "artispreneur-com",
  name: "Artispreneur",
  domain: "artispreneur.com",
  slug: "artispreneur-com",
} as const;

export const PRODUCT = {
  id: "agent",
  name: "Artispreneur Agent",
  slug: "agent",
  host: "agent.artispreneur.com",
} as const;

export type WorkspaceScope = {
  orgId: typeof ORG.id;
  tenantId: typeof TENANT.id;
  productId: typeof PRODUCT.id;
  userId: string; // Cognito sub
  projectId: string; // artist / project workspace id
};

/** Logical path used in APIs, soul.md, and S3 keys */
export function workspaceLogicalPath(scope: WorkspaceScope): string {
  return [
    "orgs",
    scope.orgId,
    "tenants",
    scope.tenantId,
    "products",
    scope.productId,
    "users",
    scope.userId,
    "projects",
    scope.projectId,
  ].join("/");
}

/** Local Rostr Hub root (mirrors future S3 prefix) */
export function workspaceFsRoot(scope: WorkspaceScope, cwd = process.cwd()): string {
  return path.join(cwd, ".data", workspaceLogicalPath(scope));
}

/** Build scope for an Agent user project */
export function agentProjectScope(userId: string, projectId: string): WorkspaceScope {
  return {
    orgId: ORG.id,
    tenantId: TENANT.id,
    productId: PRODUCT.id,
    userId,
    projectId,
  };
}

/** Default project id from Cognito sub + optional stage name slug */
export function defaultProjectId(userId: string, stageName?: string): string {
  if (stageName) {
    const slug = stageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48);
    if (slug) return `artispreneur-${slug}`;
  }
  return `artispreneur-${userId.slice(0, 12)}`;
}

export const HIERARCHY_LABELS = [
  { level: "org", id: ORG.id, name: ORG.name },
  { level: "tenant", id: TENANT.id, name: TENANT.name },
  { level: "product", id: PRODUCT.id, name: PRODUCT.name },
] as const;
