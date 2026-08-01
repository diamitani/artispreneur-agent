/**
 * Composio tools for Hermes Agent — maps artist workspace actions
 * to AI SDK tool definitions that Hermes can call during chat.
 */

import { type ToolSet } from "ai";
import { z } from "zod";
import type { SpecialistId } from "@/lib/rostr/specialists";
import { executeAction, isComposioConfigured } from "./client";

export type ComposioToolContext = {
  entityId: string;
};

export function getComposioTools(ctx: ComposioToolContext): ToolSet {
  if (!isComposioConfigured()) return {};

  // Plain object literals — avoids AI SDK v7 tool() overload ambiguity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    gmail_send_draft: {
      description:
        "Draft an email in Gmail (saved as draft, NOT sent). Artist approves before sending.",
      parameters: z.object({
        to: z.string().describe("Recipient email address"),
        subject: z.string().describe("Email subject line"),
        body: z.string().describe("Email body (plain text or HTML)"),
      }),
      execute: async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
        const result = await executeAction("GMAIL_CREATE_DRAFT", ctx.entityId, {
          recipient_email: to,
          subject,
          body,
        });
        return result.success
          ? { status: "draft_created", message: `Draft saved: "${subject}" → ${to}. Artist must review and send from Gmail.` }
          : { status: "error", message: result.error || "Failed to create draft" };
      },
    },
    gmail_list_messages: {
      description: "List recent emails from the artist's Gmail inbox",
      parameters: z.object({
        query: z.string().optional().describe("Gmail search query"),
        max_results: z.number().optional().describe("Max messages (default 10)"),
      }),
      execute: async ({ query, max_results }: { query?: string; max_results?: number }) =>
        executeAction("GMAIL_LIST_MESSAGES", ctx.entityId, {
          query: query || "label:inbox",
          max_results: max_results || 10,
        }),
    },
    google_drive_list_files: {
      description: "List files in the artist's Google Drive",
      parameters: z.object({
        query: z.string().optional().describe("Drive search query"),
        folder_id: z.string().optional().describe("Folder ID to list"),
      }),
      execute: async ({ query, folder_id }: { query?: string; folder_id?: string }) =>
        executeAction("GOOGLEDRIVE_LIST_FILES", ctx.entityId, { query, folder_id }),
    },
    google_drive_create_file: {
      description: "Create a new file in Google Drive (contracts, EPKs, business docs)",
      parameters: z.object({
        name: z.string().describe("File name"),
        content: z.string().describe("File content (text/markdown)"),
        mime_type: z.string().optional().describe("MIME type (default: text/plain)"),
        folder_id: z.string().optional().describe("Target folder ID"),
      }),
      execute: async ({ name, content, mime_type, folder_id }: { name: string; content: string; mime_type?: string; folder_id?: string }) =>
        executeAction("GOOGLEDRIVE_CREATE_FILE", ctx.entityId, {
          name,
          content,
          mime_type: mime_type || "text/plain",
          folder_id,
        }),
    },
    google_sheets_read: {
      description: "Read data from a Google Sheet (royalties tracking, split sheets, budgets)",
      parameters: z.object({
        spreadsheet_id: z.string().describe("Google Sheets ID"),
        range: z.string().describe("Cell range (e.g. 'Sheet1!A1:D10')"),
      }),
      execute: async ({ spreadsheet_id, range }: { spreadsheet_id: string; range: string }) =>
        executeAction("GOOGLESHEETS_GET_SPREADSHEET_DATA", ctx.entityId, {
          spreadsheet_id,
          range,
        }),
    },
    google_sheets_write: {
      description: "Write data to a Google Sheet (update royalty tracker, add split entries)",
      parameters: z.object({
        spreadsheet_id: z.string().describe("Google Sheets ID"),
        range: z.string().describe("Cell range to write to"),
        values: z.array(z.array(z.string())).describe("2D array of values"),
      }),
      execute: async ({ spreadsheet_id, range, values }: { spreadsheet_id: string; range: string; values: string[][] }) =>
        executeAction("GOOGLESHEETS_BATCH_UPDATE", ctx.entityId, {
          spreadsheet_id,
          range,
          values,
        }),
    },
    google_calendar_create_event: {
      description: "Create a calendar event (shows, studio sessions, meetings, deadlines)",
      parameters: z.object({
        title: z.string().describe("Event title"),
        start_time: z.string().describe("ISO 8601 start time"),
        end_time: z.string().describe("ISO 8601 end time"),
        description: z.string().optional().describe("Event description"),
        location: z.string().optional().describe("Event location"),
      }),
      execute: async ({ title, start_time, end_time, description, location }: { title: string; start_time: string; end_time: string; description?: string; location?: string }) =>
        executeAction("GOOGLECALENDAR_CREATE_EVENT", ctx.entityId, {
          title,
          start_time,
          end_time,
          description,
          location,
        }),
    },
    google_calendar_list_events: {
      description: "List upcoming calendar events (shows, deadlines, studio time)",
      parameters: z.object({
        time_min: z.string().optional().describe("Start of range (ISO 8601)"),
        time_max: z.string().optional().describe("End of range (ISO 8601)"),
        max_results: z.number().optional().describe("Max events to return"),
      }),
      execute: async ({ time_min, time_max, max_results }: { time_min?: string; time_max?: string; max_results?: number }) =>
        executeAction("GOOGLECALENDAR_LIST_EVENTS", ctx.entityId, {
          time_min,
          time_max,
          max_results: max_results || 10,
        }),
    },
    slack_send_message: {
      description: "Send a message to a Slack channel (band chat, team updates)",
      parameters: z.object({
        channel: z.string().describe("Channel name or ID"),
        text: z.string().describe("Message text"),
      }),
      execute: async ({ channel, text }: { channel: string; text: string }) =>
        executeAction("SLACK_SEND_MESSAGE", ctx.entityId, { channel, text }),
    },
    notion_create_page: {
      description: "Create a Notion page (project plans, release checklists, meeting notes)",
      parameters: z.object({
        title: z.string().describe("Page title"),
        content: z.string().describe("Page content (markdown)"),
        parent_id: z.string().optional().describe("Parent page or database ID"),
      }),
      execute: async ({ title, content, parent_id }: { title: string; content: string; parent_id?: string }) =>
        executeAction("NOTION_CREATE_PAGE", ctx.entityId, { title, content, parent_id }),
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as ToolSet;
}

export type ComposioToolName = keyof ReturnType<typeof getComposioTools>;

/**
 * Composio tools scoped to one specialist.
 *
 * Keys are `SpecialistId` values from `@/lib/rostr/specialists` — an earlier
 * version keyed this map on names that no longer exist (`pr_outreach`,
 * `distribution`, `licensing`), so every lookup missed and each specialist
 * silently received the full tool set. An unknown key now yields no tools
 * rather than all of them, so a future rename fails closed.
 */
export function getToolsForSpecialist(
  specialist: SpecialistId | "master",
  ctx: ComposioToolContext,
): ToolSet {
  const all = getComposioTools(ctx);
  if (!Object.keys(all).length) return {};

  type ToolName = keyof typeof all;
  const everything = Object.keys(all) as ToolName[];

  const toolMap: Record<SpecialistId | "master", ToolName[]> = {
    // The master agent orchestrates, so it holds the full surface.
    master: everything,
    "brand-epk": ["google_drive_create_file", "google_drive_list_files", "notion_create_page"],
    publishing: [
      "google_sheets_read",
      "google_sheets_write",
      "google_drive_list_files",
      "google_drive_create_file",
    ],
    contracts: ["google_drive_create_file", "google_drive_list_files"],
    release: [
      "google_sheets_read",
      "google_sheets_write",
      "google_calendar_create_event",
      "google_drive_list_files",
    ],
    content: ["notion_create_page", "google_drive_create_file", "slack_send_message"],
    press: ["gmail_send_draft", "gmail_list_messages", "google_drive_create_file"],
    booking: [
      "gmail_send_draft",
      "gmail_list_messages",
      "google_calendar_create_event",
      "google_calendar_list_events",
    ],
    finance: ["google_sheets_read", "google_sheets_write", "google_calendar_list_events"],
  };

  const allowed = toolMap[specialist];
  if (!allowed) return {};

  const filtered: ToolSet = {};
  for (const key of allowed) {
    if (all[key]) filtered[key] = all[key];
  }
  return filtered;
}
