/**
 * Composio tools for Hermes Agent — maps artist workspace actions
 * to AI SDK tool definitions that Hermes can call during chat.
 *
 * Each tool wraps a Composio action and requires the artist's entityId
 * (their workspace/project ID) to execute against their connected accounts.
 */

import { tool } from "ai";
import { z } from "zod";
import { executeAction, isComposioConfigured } from "./client";

export type ComposioToolContext = {
  entityId: string;
};

export function getComposioTools(ctx: ComposioToolContext) {
  if (!isComposioConfigured()) return {};

  return {
    gmail_send_draft: tool({
      description:
        "Draft an email in Gmail (saved as draft, NOT sent). The artist approves before sending.",
      parameters: z.object({
        to: z.string().describe("Recipient email address"),
        subject: z.string().describe("Email subject line"),
        body: z.string().describe("Email body (plain text or HTML)"),
      }),
      execute: async ({ to, subject, body }) => {
        const result = await executeAction("GMAIL_CREATE_DRAFT", ctx.entityId, {
          recipient_email: to,
          subject,
          body,
        });
        return result.success
          ? { status: "draft_created", message: `Draft saved: "${subject}" → ${to}. Artist must review and send from Gmail.` }
          : { status: "error", message: result.error || "Failed to create draft" };
      },
    }),

    gmail_list_messages: tool({
      description: "List recent emails from the artist's Gmail inbox",
      parameters: z.object({
        query: z.string().optional().describe("Gmail search query (e.g. 'from:distrokid' or 'label:inbox')"),
        max_results: z.number().optional().describe("Max messages to return (default 10)"),
      }),
      execute: async ({ query, max_results }) => {
        return executeAction("GMAIL_LIST_MESSAGES", ctx.entityId, {
          query: query || "label:inbox",
          max_results: max_results || 10,
        });
      },
    }),

    google_drive_list_files: tool({
      description: "List files in the artist's Google Drive",
      parameters: z.object({
        query: z.string().optional().describe("Drive search query"),
        folder_id: z.string().optional().describe("Folder ID to list"),
      }),
      execute: async ({ query, folder_id }) => {
        return executeAction("GOOGLEDRIVE_LIST_FILES", ctx.entityId, {
          query,
          folder_id,
        });
      },
    }),

    google_drive_create_file: tool({
      description: "Create a new file in Google Drive (contracts, EPKs, business docs)",
      parameters: z.object({
        name: z.string().describe("File name"),
        content: z.string().describe("File content (text/markdown)"),
        mime_type: z.string().optional().describe("MIME type (default: text/plain)"),
        folder_id: z.string().optional().describe("Target folder ID"),
      }),
      execute: async ({ name, content, mime_type, folder_id }) => {
        return executeAction("GOOGLEDRIVE_CREATE_FILE", ctx.entityId, {
          name,
          content,
          mime_type: mime_type || "text/plain",
          folder_id,
        });
      },
    }),

    google_sheets_read: tool({
      description: "Read data from a Google Sheet (royalties tracking, split sheets, budgets)",
      parameters: z.object({
        spreadsheet_id: z.string().describe("Google Sheets ID"),
        range: z.string().describe("Cell range (e.g. 'Sheet1!A1:D10')"),
      }),
      execute: async ({ spreadsheet_id, range }) => {
        return executeAction("GOOGLESHEETS_GET_SPREADSHEET_DATA", ctx.entityId, {
          spreadsheet_id,
          range,
        });
      },
    }),

    google_sheets_write: tool({
      description: "Write data to a Google Sheet (update royalty tracker, add split entries)",
      parameters: z.object({
        spreadsheet_id: z.string().describe("Google Sheets ID"),
        range: z.string().describe("Cell range to write to"),
        values: z.array(z.array(z.string())).describe("2D array of values"),
      }),
      execute: async ({ spreadsheet_id, range, values }) => {
        return executeAction("GOOGLESHEETS_BATCH_UPDATE", ctx.entityId, {
          spreadsheet_id,
          range,
          values,
        });
      },
    }),

    google_calendar_create_event: tool({
      description: "Create a calendar event (shows, studio sessions, meetings, deadlines)",
      parameters: z.object({
        title: z.string().describe("Event title"),
        start_time: z.string().describe("ISO 8601 start time"),
        end_time: z.string().describe("ISO 8601 end time"),
        description: z.string().optional().describe("Event description"),
        location: z.string().optional().describe("Event location"),
      }),
      execute: async ({ title, start_time, end_time, description, location }) => {
        return executeAction("GOOGLECALENDAR_CREATE_EVENT", ctx.entityId, {
          title,
          start_time,
          end_time,
          description,
          location,
        });
      },
    }),

    google_calendar_list_events: tool({
      description: "List upcoming calendar events (shows, deadlines, studio time)",
      parameters: z.object({
        time_min: z.string().optional().describe("Start of range (ISO 8601)"),
        time_max: z.string().optional().describe("End of range (ISO 8601)"),
        max_results: z.number().optional().describe("Max events to return"),
      }),
      execute: async ({ time_min, time_max, max_results }) => {
        return executeAction("GOOGLECALENDAR_LIST_EVENTS", ctx.entityId, {
          time_min,
          time_max,
          max_results: max_results || 10,
        });
      },
    }),

    slack_send_message: tool({
      description: "Send a message to a Slack channel (band chat, team updates)",
      parameters: z.object({
        channel: z.string().describe("Channel name or ID"),
        text: z.string().describe("Message text"),
      }),
      execute: async ({ channel, text }) => {
        return executeAction("SLACK_SEND_MESSAGE", ctx.entityId, {
          channel,
          text,
        });
      },
    }),

    notion_create_page: tool({
      description: "Create a Notion page (project plans, release checklists, meeting notes)",
      parameters: z.object({
        title: z.string().describe("Page title"),
        content: z.string().describe("Page content (markdown)"),
        parent_id: z.string().optional().describe("Parent page or database ID"),
      }),
      execute: async ({ title, content, parent_id }) => {
        return executeAction("NOTION_CREATE_PAGE", ctx.entityId, {
          title,
          content,
          parent_id,
        });
      },
    }),
  };
}

export type ComposioToolName = keyof ReturnType<typeof getComposioTools>;

/**
 * Get only the tools relevant to a specific specialist agent.
 */
export function getToolsForSpecialist(
  specialist: string,
  ctx: ComposioToolContext,
) {
  const all = getComposioTools(ctx);
  if (!Object.keys(all).length) return {};

  const toolMap: Record<string, (keyof typeof all)[]> = {
    pr_outreach: ["gmail_send_draft", "gmail_list_messages", "google_drive_create_file"],
    distribution: ["google_sheets_read", "google_sheets_write", "google_drive_list_files"],
    licensing: ["gmail_send_draft", "google_drive_create_file", "google_sheets_read"],
    legal: ["google_drive_create_file", "google_drive_list_files"],
    finance: ["google_sheets_read", "google_sheets_write", "google_calendar_list_events"],
    manager: Object.keys(all) as (keyof typeof all)[],
    master: Object.keys(all) as (keyof typeof all)[],
  };

  const allowed = toolMap[specialist] || Object.keys(all) as (keyof typeof all)[];
  const filtered: Record<string, (typeof all)[keyof typeof all]> = {};
  for (const key of allowed) {
    if (all[key]) filtered[key] = all[key];
  }
  return filtered;
}
