function base64Url(bytes: ArrayBuffer): string {
  const str = Buffer.from(bytes).toString("base64");
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createPkce(): Promise<{ verifier: string; challenge: string }> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const verifier = base64Url(array.buffer);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return { verifier, challenge: base64Url(digest) };
}

export function randomState(): string {
  return crypto.randomUUID();
}
