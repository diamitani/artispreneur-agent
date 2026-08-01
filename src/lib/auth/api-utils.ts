import { getSessionUser } from "@/lib/auth";

export type ApiUser = { userId: string; email: string; name: string };

/**
 * Identify the caller of a project/task API route.
 *
 * This previously returned a hardcoded `dev-user-001` unconditionally — the
 * `AUTH_DEV_BYPASS` check only guarded the first return, so the fallback ran in
 * production too. Every request resolved to the same identity, which left
 * /api/projects and /api/tasks effectively unauthenticated and pooled all
 * users' data under one owner.
 *
 * It now delegates to `getSessionUser()`, which owns the session decrypt and
 * the dev-bypass rules, and returns null when there is no valid session. All
 * call sites already answer null with a 401.
 */
export async function getApiUser(): Promise<ApiUser | null> {
  const session = await getSessionUser();
  if (!session) return null;

  return {
    userId: session.sub,
    email: session.email,
    name: session.name ?? session.email,
  };
}
