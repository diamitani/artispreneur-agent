import { beforeEach, describe, expect, it, vi } from "vitest";

// No DynamoDB in tests — exercise the in-memory branch, which is also what a
// deployment without the instance table actually runs.
vi.mock("@/lib/aws/config", () => ({
  getAwsRegion: () => "us-east-1",
  getInstanceTable: () => "",
  isInstanceTableConfigured: () => false,
}));

const { consumeRateLimit } = await import("./rate-limit");

let n = 0;
function subject() {
  return `subject-${n++}`;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("consumeRateLimit", () => {
  it("allows up to the limit and then blocks", async () => {
    const s = subject();
    const call = () =>
      consumeRateLimit({ namespace: "t", subject: s, limit: 3, windowSeconds: 60 });

    expect((await call()).ok).toBe(true);
    expect((await call()).ok).toBe(true);
    const third = await call();
    expect(third.ok).toBe(true);
    expect(third.remaining).toBe(0);
    expect((await call()).ok).toBe(false);
  });

  it("counts down remaining", async () => {
    const s = subject();
    const first = await consumeRateLimit({
      namespace: "t",
      subject: s,
      limit: 5,
      windowSeconds: 60,
    });
    expect(first.remaining).toBe(4);
    expect(first.limit).toBe(5);
  });

  it("keeps subjects independent", async () => {
    const a = subject();
    const b = subject();
    for (let i = 0; i < 3; i++) {
      await consumeRateLimit({ namespace: "t", subject: a, limit: 3, windowSeconds: 60 });
    }
    expect(
      (await consumeRateLimit({ namespace: "t", subject: a, limit: 3, windowSeconds: 60 }))
        .ok,
    ).toBe(false);
    expect(
      (await consumeRateLimit({ namespace: "t", subject: b, limit: 3, windowSeconds: 60 }))
        .ok,
    ).toBe(true);
  });

  it("keeps namespaces independent", async () => {
    const s = subject();
    await consumeRateLimit({ namespace: "one", subject: s, limit: 1, windowSeconds: 60 });
    expect(
      (await consumeRateLimit({ namespace: "one", subject: s, limit: 1, windowSeconds: 60 }))
        .ok,
    ).toBe(false);
    expect(
      (await consumeRateLimit({ namespace: "two", subject: s, limit: 1, windowSeconds: 60 }))
        .ok,
    ).toBe(true);
  });

  it("resets in the next window", async () => {
    const s = subject();
    const t0 = new Date("2026-08-02T10:00:00.000Z");
    const t1 = new Date("2026-08-02T11:00:01.000Z");
    const opts = { namespace: "t", subject: s, limit: 1, windowSeconds: 3600 };

    expect((await consumeRateLimit({ ...opts, now: t0 })).ok).toBe(true);
    expect((await consumeRateLimit({ ...opts, now: t0 })).ok).toBe(false);
    expect((await consumeRateLimit({ ...opts, now: t1 })).ok).toBe(true);
  });

  it("reports a reset within the window length", async () => {
    const v = await consumeRateLimit({
      namespace: "t",
      subject: subject(),
      limit: 10,
      windowSeconds: 3600,
      now: new Date("2026-08-02T10:30:00.000Z"),
    });
    expect(v.resetsInSeconds).toBeGreaterThan(0);
    expect(v.resetsInSeconds).toBeLessThanOrEqual(3600);
  });
});
