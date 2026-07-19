import { NextResponse } from "next/server";
import { getSessionUser, isCognitoConfigured, isAuthDevBypass } from "@/lib/auth";
import { HIERARCHY_LABELS } from "@/lib/tenancy/hierarchy";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({
    ok: true,
    authenticated: Boolean(user),
    cognitoConfigured: isCognitoConfigured(),
    authDevBypass: isAuthDevBypass(),
    hierarchy: HIERARCHY_LABELS,
    user,
  });
}
