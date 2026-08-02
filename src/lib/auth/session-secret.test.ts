import { afterEach, describe, expect, it, vi } from "vitest";

// session.ts pulls in next/headers, which needs a request scope. The secret
// validation is pure, so stub the cookie store and test the check directly —
// this is the failure that bricks auth for a whole deployment.
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));

const { sessionSecretIssue } = await import("./session");

const REAL = process.env.SESSION_SECRET;
afterEach(() => {
  if (REAL === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = REAL;
});

describe("sessionSecretIssue", () => {
  it("rejects a missing secret", () => {
    delete process.env.SESSION_SECRET;
    expect(sessionSecretIssue()).toMatch(/not set/i);
  });

  it("rejects the .env.example placeholder", () => {
    // It is 36 valid ASCII characters, so a length check alone lets it through
    // — and it is published in the repo, which makes every session forgeable.
    process.env.SESSION_SECRET = "change-me-to-a-random-32-char-string";
    expect(sessionSecretIssue()).toMatch(/placeholder/i);
  });

  it("rejects a short secret", () => {
    process.env.SESSION_SECRET = "short";
    expect(sessionSecretIssue()).toMatch(/at least 32/i);
  });

  it("rejects a secret one character under the minimum", () => {
    process.env.SESSION_SECRET = "a".repeat(31);
    expect(sessionSecretIssue()).toMatch(/at least 32/i);
  });

  it("accepts a real 32-character secret", () => {
    process.env.SESSION_SECRET = "a".repeat(32);
    expect(sessionSecretIssue()).toBeNull();
  });

  it("accepts a long non-ASCII secret", () => {
    // The old padEnd/slice key derivation counted UTF-16 code units while
    // TextEncoder emits UTF-8, so anything non-ASCII produced >32 bytes and
    // importKey threw on every single request. SHA-256 makes length irrelevant.
    process.env.SESSION_SECRET = `${"🎵".repeat(20)}-secret-material-here`;
    expect(sessionSecretIssue()).toBeNull();
  });
});
