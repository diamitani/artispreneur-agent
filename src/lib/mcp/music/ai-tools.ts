/**
 * The music MCP tools, bound as AI SDK tools for our own agent runtime.
 *
 * Our agents call the implementations in-process rather than looping back
 * through /api/mcp/music over HTTP — same code, one less network hop. The MCP
 * route exists so *external* clients get the identical tool surface.
 */

import type { ToolSet } from "ai";
import { MUSIC_TOOLS, MusicToolError, isSpotifyConfigured } from "./tools";

/** Tools whose backing service needs credentials this deployment may not have. */
function isAvailable(name: string) {
  if (name.startsWith("music_spotify_")) return isSpotifyConfigured();
  return true;
}

export function getMusicTools(): ToolSet {
  const tools: Record<string, unknown> = {};

  for (const t of MUSIC_TOOLS) {
    if (!isAvailable(t.name)) continue;
    tools[t.name] = {
      description: t.description,
      parameters: t.schema,
      execute: async (args: Record<string, unknown>) => {
        try {
          return await t.run(args);
        } catch (e) {
          // Return the failure as data so the agent can explain it to the
          // artist instead of the turn dying.
          return {
            error: e instanceof MusicToolError ? e.message : String(e),
            tool: t.name,
          };
        }
      },
    };
  }

  return tools as unknown as ToolSet;
}

export const MUSIC_TOOL_NAMES = MUSIC_TOOLS.map((t) => t.name);
