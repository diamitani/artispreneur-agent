/**
 * Composio SDK client — tool execution layer for Artispreneur agents.
 * Enables Gmail, Google Drive, Sheets, Calendar, Slack, and 200+ integrations
 * through a single API surface. Each artist workspace has its own connected accounts.
 */

const COMPOSIO_BASE = "https://backend.composio.dev/api/v2";

function getApiKey(): string {
  const key = process.env.COMPOSIO_API_KEY;
  if (!key) throw new Error("COMPOSIO_API_KEY not set");
  return key;
}

async function composioFetch(
  path: string,
  opts: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${COMPOSIO_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": getApiKey(),
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Composio ${res.status}: ${body}`);
  }
  return res;
}

export function isComposioConfigured(): boolean {
  return Boolean(process.env.COMPOSIO_API_KEY);
}

// --- Entity (per-artist workspace) ---

export async function getOrCreateEntity(entityId: string) {
  const res = await composioFetch(`/connectedAccounts?user_uuid=${entityId}`);
  return res.json();
}

export async function getConnectedAccounts(entityId: string) {
  const res = await composioFetch(
    `/connectedAccounts?user_uuid=${entityId}&showActiveOnly=true`,
  );
  const data = await res.json();
  return data.items ?? [];
}

export async function initiateConnection(
  entityId: string,
  integrationId: string,
  redirectUrl?: string,
) {
  const res = await composioFetch("/connectedAccounts", {
    method: "POST",
    body: JSON.stringify({
      integrationId,
      userUuid: entityId,
      redirectUrl: redirectUrl || `${process.env.APP_URL || "http://localhost:3000"}/workspace?connected=1`,
    }),
  });
  return res.json();
}

// --- Actions (tool execution) ---

export type ComposioAction = {
  name: string;
  display_name: string;
  description: string;
  parameters: Record<string, unknown>;
  app_name: string;
};

export async function getActions(
  appName: string,
  opts?: { useCase?: string; limit?: number },
): Promise<ComposioAction[]> {
  const params = new URLSearchParams({ apps: appName });
  if (opts?.useCase) params.set("useCase", opts.useCase);
  if (opts?.limit) params.set("limit", String(opts.limit));
  const res = await composioFetch(`/actions?${params}`);
  const data = await res.json();
  return data.items ?? [];
}

export async function executeAction(
  actionName: string,
  entityId: string,
  params: Record<string, unknown>,
): Promise<{ success: boolean; data: unknown; error?: string }> {
  const res = await composioFetch(`/actions/${actionName}/execute`, {
    method: "POST",
    body: JSON.stringify({
      connectedAccountId: entityId,
      input: params,
      entityId,
    }),
  });
  const data = await res.json();
  return {
    success: data.successfull ?? data.success ?? false,
    data: data.data ?? data.response_data ?? data,
    error: data.error,
  };
}

// --- Integrations listing ---

export async function listIntegrations() {
  const res = await composioFetch("/integrations");
  return res.json();
}

export async function getIntegrationsByApp(appName: string) {
  const res = await composioFetch(`/integrations?appName=${appName}`);
  const data = await res.json();
  return data.items ?? [];
}
