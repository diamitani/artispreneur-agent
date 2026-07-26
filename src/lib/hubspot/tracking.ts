/**
 * HubSpot tracking for Skills Marketplace.
 * Uses CRM API when HUBSPOT_ACCESS_TOKEN is set; always logs events locally.
 */

import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/contacts/models/Filter";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

export type HubSpotSkillEvent = {
  event:
    | "skill_viewed"
    | "skill_checkout_started"
    | "skill_purchased"
    | "skill_added_free"
    | "skill_installed";
  email?: string;
  userId?: string;
  skillId: string;
  skillSlug: string;
  skillName: string;
  priceCents: number;
  source?: string;
  stripeSessionId?: string;
  metadata?: Record<string, string>;
};

function hubspot(): Client | null {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return null;
  return new Client({ accessToken: token });
}

async function logLocal(event: HubSpotSkillEvent) {
  const dir = path.join(process.cwd(), ".data", "hubspot-events");
  await mkdir(dir, { recursive: true });
  await appendFile(
    path.join(dir, "skills.jsonl"),
    `${JSON.stringify({ ...event, at: new Date().toISOString() })}\n`,
    "utf8",
  );
}

/** Upsert contact + create engagement note / custom event trail */
export async function trackSkillEvent(event: HubSpotSkillEvent) {
  await logLocal(event).catch(() => undefined);

  const client = hubspot();
  if (!client || !event.email) {
    return { ok: true, hubspot: false as const, logged: true };
  }

  try {
    // Upsert contact by email
    // Standard HubSpot properties only (custom props optional via portal setup)
    const props: Record<string, string> = {
      email: event.email,
    };

    let contactId: string | undefined;
    try {
      const search = await client.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: FilterOperatorEnum.Eq,
                value: event.email,
              },
            ],
          },
        ],
        properties: ["email"],
        limit: 1,
      });
      contactId = search.results?.[0]?.id;
    } catch {
      /* fall through */
    }

    if (!contactId) {
      const created = await client.crm.contacts.basicApi.create({
        properties: {
          email: event.email,
          firstname: event.skillName.slice(0, 40) || "Artispreneur",
          lastname: "Artist",
          ...props,
        },
        associations: [],
      });
      contactId = created.id;
    }

    // Update contact with marketplace trail in standard fields (best-effort)
    if (contactId) {
      await client.crm.contacts.basicApi
        .update(contactId, {
          properties: {
            message: [
              `Skills: ${event.event}`,
              `${event.skillName} (${event.skillSlug})`,
              `$${(event.priceCents / 100).toFixed(2)}`,
              event.stripeSessionId ? `Stripe ${event.stripeSessionId}` : "",
            ]
              .filter(Boolean)
              .join(" · ")
              .slice(0, 65535),
          },
        })
        .catch(() => undefined);
    }

    return { ok: true, hubspot: true as const, contactId, logged: true };
  } catch (err) {
    console.error("[hubspot] trackSkillEvent failed", err);
    return {
      ok: true,
      hubspot: false as const,
      logged: true,
      error: err instanceof Error ? err.message : "hubspot_error",
    };
  }
}

export function isHubSpotConfigured() {
  return Boolean(process.env.HUBSPOT_ACCESS_TOKEN);
}
