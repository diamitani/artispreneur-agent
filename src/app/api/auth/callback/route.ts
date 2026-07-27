import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/auth/cognito";
import { createSession } from "@/lib/auth/session";
import { ddb, tableName } from "@/lib/db/client";
import { userPk } from "@/lib/db/schema";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

/**
 * GET /api/auth/callback
 *
 * Cognito redirects here after the user authenticates.
 * Exchanges the authorization code for tokens, creates a session,
 * and provisions the user in DynamoDB if new.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // returnTo URL
  const error = searchParams.get("error");

  // Handle Cognito error response
  if (error) {
    const description = searchParams.get("error_description") ?? "Authentication failed";
    console.error("[auth/callback] Cognito error:", error, description);
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(description)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/signin?error=missing_code", request.url));
  }

  // Read the PKCE code_verifier from cookie
  const codeVerifier = request.cookies.get("aa_pkce_verifier")?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL("/signin?error=missing_verifier", request.url)
    );
  }

  try {
    // Exchange authorization code for tokens
    const tokens = await exchangeCode(code, codeVerifier);

    // Create the encrypted session cookie
    const session = await createSession(tokens);

    // Check if user exists in DynamoDB, create if new
    let isNewUser = false;
    try {
      const table = tableName();
      const existing = await ddb().send(
        new GetCommand({
          TableName: table,
          Key: {
            pk: userPk(session.userId),
            sk: "PROFILE",
          },
        })
      );

      if (!existing.Item) {
        isNewUser = true;
        const now = new Date().toISOString();
        await ddb().send(
          new PutCommand({
            TableName: table,
            Item: {
              pk: userPk(session.userId),
              sk: "PROFILE",
              gsi1pk: `EMAIL#${session.email}`,
              gsi1sk: "PROFILE",
              id: session.userId,
              email: session.email,
              name: session.name,
              plan: "starter",
              onboardingCompleted: false,
              createdAt: now,
              updatedAt: now,
            },
            ConditionExpression: "attribute_not_exists(pk)",
          })
        );
      }
    } catch (dbError) {
      // If DynamoDB is not configured (e.g., in dev), log and continue
      console.warn("[auth/callback] DynamoDB operation skipped:", dbError);
    }

    // Determine redirect destination
    let redirectTo = state ?? "/dashboard";
    if (isNewUser && !state) {
      redirectTo = "/onboarding";
    }

    // Build response with redirect
    const response = NextResponse.redirect(new URL(redirectTo, request.url));

    // Clear the PKCE verifier cookie
    response.cookies.set("aa_pkce_verifier", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error("[auth/callback] Token exchange failed:", err);
    return NextResponse.redirect(
      new URL("/signin?error=token_exchange_failed", request.url)
    );
  }
}
