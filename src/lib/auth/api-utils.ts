export async function getApiUser(): Promise<{userId: string; email: string; name: string} | null> {
  if (process.env.AUTH_DEV_BYPASS === "1") {
    return { userId: "dev-user-001", email: "dev@artispreneur.com", name: "Dev User" };
  }
  // For now, return mock user — full auth integration comes later
  return { userId: "dev-user-001", email: "dev@artispreneur.com", name: "Dev User" };
}
