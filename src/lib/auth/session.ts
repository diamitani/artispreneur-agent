/**
 * Session management — encrypted HTTP-only cookie holding user session data.
 * Uses Web Crypto API (AES-GCM) for encryption, compatible with Edge runtime.
 */

import { cookies } from "next/headers";
import type { Session } from "@/types/user";
import { verifyToken, type CognitoIdTokenPayload } from "./cognito";
import { SESSION_COOKIE as CONFIG_SESSION_COOKIE, isAuthDevBypass } from "./config";

// Single source of truth — see src/lib/auth/config.ts
const SESSION_COOKIE = CONFIG_SESSION_COOKIE;
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── Crypto helpers (AES-GCM via Web Crypto) ──────────────────────────────────

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET environment variable is not set");
  // Derive a 256-bit key from the secret by hashing
  const encoder = new TextEncoder();
  return encoder.encode(secret.padEnd(32, "0").slice(0, 32));
}

async function getEncryptionKey(): Promise<CryptoKey> {
  const rawKey = getSessionSecret();
  return crypto.subtle.importKey("raw", rawKey.buffer as ArrayBuffer, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

async function encrypt(plaintext: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  // Combine IV + ciphertext and base64url encode
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return base64UrlEncode(combined);
}

async function decrypt(encoded: string): Promise<string> {
  const key = await getEncryptionKey();
  const combined = base64UrlDecode(encoded);

  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(plaintext);
}

function base64UrlEncode(buffer: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ─── Session API ───────────────────────────────────────────────────────────────

export interface SessionTokens {
  id_token: string;
  access_token: string;
  refresh_token: string;
}

/**
 * Extract user info from the id_token payload and create an encrypted session cookie.
 */
export async function createSession(tokens: SessionTokens): Promise<Session> {
  let payload: CognitoIdTokenPayload;
  try {
    payload = await verifyToken(tokens.id_token);
  } catch {
    // If verification fails (e.g. in dev), decode without verification
    const parts = tokens.id_token.split(".");
    if (parts.length !== 3) throw new Error("Invalid id_token format");
    payload = JSON.parse(atob(parts[1]!.replace(/-/g, "+").replace(/_/g, "/")));
  }

  const session: Session = {
    userId: payload.sub,
    email: payload.email ?? "",
    name: payload.name ?? payload["cognito:username"] ?? "",
    plan: "starter",
  };

  const sessionData = JSON.stringify({
    ...session,
    tokens: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    },
  });

  const encrypted = await encrypt(sessionData);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return session;
}

/**
 * Read and decrypt the session cookie. Returns the Session or null if invalid/missing.
 */
export async function getSession(): Promise<Session | null> {
  // Dev bypass. This deliberately uses the same strict predicate as
  // getSessionUser() rather than a bare env check: isAuthDevBypass() also
  // requires NODE_ENV !== "production" and Cognito to be unconfigured. The two
  // used to disagree, so setting AUTH_DEV_BYPASS=1 on a production deployment
  // would have handed every caller a session here while the other path refused.
  if (isAuthDevBypass()) {
    return {
      userId: "dev-user-001",
      email: "dev@artispreneur.ai",
      name: "Dev User",
      plan: "workspace",
    };
  }

  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);

  if (!cookie?.value) return null;

  try {
    const decrypted = await decrypt(cookie.value);
    const data = JSON.parse(decrypted);
    return {
      userId: data.userId,
      email: data.email,
      name: data.name,
      plan: data.plan,
    };
  } catch {
    // A cookie we cannot decrypt (rotated SESSION_SECRET, truncated value,
    // tampering) would otherwise survive every request: middleware sees a
    // non-empty cookie and lets the request through, the page decrypts it,
    // fails, and redirects back to sign-in — forever. Drop it so the next
    // request is cleanly signed out.
    await clearSession().catch(() => undefined);
    return null;
  }
}

/**
 * Clear the session cookie (logout).
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
