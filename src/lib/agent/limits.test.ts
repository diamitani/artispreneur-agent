import { afterEach, describe, expect, it, vi } from "vitest";

const getInstanceUsageDay = vi.fn();
vi.mock("@/lib/aws/instance-registry", () => ({
  getInstanceUsageDay: (...args: unknown[]) => getInstanceUsageDay(...args),
}));

const {
  MAX_MESSAGE_CHARS,
  checkDailyTokenBudget,
  dailyTokenBudget,
  messagesTooLarge,
  utcDay,
} = await import("./limits");

afterEach(() => {
  vi.clearAllMocks();
  delete process.env.AGENT_DAILY_TOKEN_BUDGET_STARTER;
});

describe("dailyTokenBudget", () => {
  it("gives paid plans more than free", () => {
    expect(dailyTokenBudget("workspace")).toBeGreaterThan(dailyTokenBudget("starter"));
    expect(dailyTokenBudget("agency")).toBeGreaterThan(dailyTokenBudget("workspace"));
  });

  it("treats a missing or unknown plan as the free tier", () => {
    // A workspace record predating billing has no plan field. Defaulting to the
    // most generous tier would be the expensive mistake.
    expect(dailyTokenBudget(null)).toBe(dailyTokenBudget("starter"));
    expect(dailyTokenBudget(undefined)).toBe(dailyTokenBudget("starter"));
    expect(dailyTokenBudget("enterprise-unlimited")).toBe(dailyTokenBudget("starter"));
  });

  it("honours an env override", () => {
    process.env.AGENT_DAILY_TOKEN_BUDGET_STARTER = "1234";
    expect(dailyTokenBudget("starter")).toBe(1234);
  });

  it("ignores a nonsense env override rather than disabling the cap", () => {
    process.env.AGENT_DAILY_TOKEN_BUDGET_STARTER = "not-a-number";
    expect(dailyTokenBudget("starter")).toBeGreaterThan(0);
    process.env.AGENT_DAILY_TOKEN_BUDGET_STARTER = "0";
    expect(dailyTokenBudget("starter")).toBeGreaterThan(0);
    process.env.AGENT_DAILY_TOKEN_BUDGET_STARTER = "-500";
    expect(dailyTokenBudget("starter")).toBeGreaterThan(0);
  });
});

describe("checkDailyTokenBudget", () => {
  it("allows a user under budget", async () => {
    getInstanceUsageDay.mockResolvedValue({ input_tokens: 10, output_tokens: 20 });
    const v = await checkDailyTokenBudget({ userId: "u1", plan: "starter" });
    expect(v.allowed).toBe(true);
    expect(v.used).toBe(30);
    expect(v.remaining).toBe(v.budget - 30);
  });

  it("blocks a user at or over budget", async () => {
    const budget = dailyTokenBudget("starter");
    getInstanceUsageDay.mockResolvedValue({ input_tokens: budget, output_tokens: 0 });
    const v = await checkDailyTokenBudget({ userId: "u1", plan: "starter" });
    expect(v.allowed).toBe(false);
    expect(v.remaining).toBe(0);
  });

  it("counts input and output together", async () => {
    const budget = dailyTokenBudget("starter");
    getInstanceUsageDay.mockResolvedValue({
      input_tokens: Math.ceil(budget / 2),
      output_tokens: Math.ceil(budget / 2),
    });
    expect((await checkDailyTokenBudget({ userId: "u1", plan: "starter" })).allowed).toBe(
      false,
    );
  });

  it("fails open when the usage store errors", async () => {
    // A DynamoDB blip must not take chat down for everyone.
    getInstanceUsageDay.mockRejectedValue(new Error("throttled"));
    expect((await checkDailyTokenBudget({ userId: "u1", plan: "starter" })).allowed).toBe(
      true,
    );
  });

  it("treats no usage row as zero used", async () => {
    getInstanceUsageDay.mockResolvedValue(null);
    const v = await checkDailyTokenBudget({ userId: "new-user", plan: "workspace" });
    expect(v.allowed).toBe(true);
    expect(v.used).toBe(0);
  });

  it("reports a reset time inside the next 24 hours", async () => {
    getInstanceUsageDay.mockResolvedValue(null);
    const v = await checkDailyTokenBudget({
      userId: "u1",
      plan: "starter",
      now: new Date("2026-08-02T23:59:00.000Z"),
    });
    expect(v.resetsInSeconds).toBeGreaterThan(0);
    expect(v.resetsInSeconds).toBeLessThanOrEqual(86_400);
  });
});

describe("utcDay", () => {
  it("uses UTC, not local time", () => {
    expect(utcDay(new Date("2026-08-02T23:30:00.000Z"))).toBe("2026-08-02");
    expect(utcDay(new Date("2026-08-03T00:30:00.000Z"))).toBe("2026-08-03");
  });
});

describe("messagesTooLarge", () => {
  const text = (n: number) => ({ parts: [{ type: "text", text: "x".repeat(n) }] });

  it("passes an ordinary conversation", () => {
    expect(messagesTooLarge([text(500), text(2000)])).toBe(false);
  });

  it("rejects an oversized conversation", () => {
    expect(messagesTooLarge([text(MAX_MESSAGE_CHARS * 5)])).toBe(true);
  });

  it("sums across messages rather than checking each in isolation", () => {
    const many = Array.from({ length: 60 }, () => text(MAX_MESSAGE_CHARS / 2));
    expect(messagesTooLarge(many)).toBe(true);
  });

  it("tolerates messages with no parts", () => {
    expect(messagesTooLarge([{}, { parts: [] }])).toBe(false);
  });

  it("ignores non-text parts", () => {
    expect(messagesTooLarge([{ parts: [{ type: "step-start" }] }])).toBe(false);
  });
});
