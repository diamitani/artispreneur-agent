/**
 * Artispreneur Music MCP server.
 *
 * Model Context Protocol over Streamable HTTP (JSON-RPC 2.0). Exposes the
 * music-domain tools Composio does not cover — rights lookup, ISRC
 * resolution, and DSP catalogue import.
 *
 * Because it speaks MCP rather than a bespoke protocol, the same server backs
 * our own agents and any external MCP client (Claude Desktop, Bedrock
 * AgentCore Gateway, etc.).
 *
 *   POST /api/mcp/music   JSON-RPC request
 *   GET  /api/mcp/music   server metadata (discovery convenience, not MCP)
 */

import { MUSIC_TOOLS, MusicToolError, getMusicTool } from "@/lib/mcp/music/tools";

export const runtime = "nodejs";
export const maxDuration = 30;

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "artispreneur-music", version: "1.0.0" };

type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: Record<string, unknown>;
};

const ERR = {
  parse: -32700,
  invalidRequest: -32600,
  methodNotFound: -32601,
  invalidParams: -32602,
  internal: -32603,
} as const;

function result(id: JsonRpcId, value: unknown) {
  return { jsonrpc: "2.0" as const, id, result: value };
}

function failure(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0" as const, id, error: { code, message } };
}

async function handle(req: JsonRpcRequest) {
  const id = req.id ?? null;

  switch (req.method) {
    case "initialize":
      return result(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Music rights and catalogue tools. MusicBrainz lookups need no credentials; Spotify tools require the deployment to have Spotify client credentials configured.",
      });

    case "ping":
      return result(id, {});

    case "tools/list":
      return result(id, {
        tools: MUSIC_TOOLS.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });

    case "tools/call": {
      const name = String(req.params?.name ?? "");
      const tool = getMusicTool(name);
      if (!tool) {
        return failure(id, ERR.invalidParams, `Unknown tool: ${name}`);
      }

      const rawArgs = (req.params?.arguments ?? {}) as Record<string, unknown>;
      const parsed = tool.schema.safeParse(rawArgs);
      if (!parsed.success) {
        return failure(
          id,
          ERR.invalidParams,
          `Invalid arguments for ${name}: ${parsed.error.issues
            .map((i) => `${i.path.join(".") || "(root)"} ${i.message}`)
            .join("; ")}`,
        );
      }

      try {
        const output = await tool.run(parsed.data as Record<string, unknown>);
        return result(id, {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: output,
          isError: false,
        });
      } catch (e) {
        // Upstream failures are tool-level errors, not protocol errors — the
        // model should see them and can explain or retry.
        // MusicToolError carries text written for the model ("no recording
        // matched that ISRC"). Anything else is an internal fault whose message
        // can name upstream hosts and credentials, and this route is
        // unauthenticated — log it, return a generic line.
        let message: string;
        if (e instanceof MusicToolError) {
          message = e.message;
        } else {
          console.error(`[mcp/music] ${name}`, e);
          message = `Tool ${name} failed. Try again, or narrow the query.`;
        }
        return result(id, {
          content: [{ type: "text", text: message }],
          isError: true,
        });
      }
    }

    default:
      // Notifications (no id) need no response body.
      if (req.id === undefined) return null;
      return failure(id, ERR.methodNotFound, `Unsupported method: ${req.method}`);
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(failure(null, ERR.parse, "Invalid JSON"), { status: 400 });
  }

  // A client may batch requests in a single array.
  if (Array.isArray(payload)) {
    const responses = await Promise.all(
      payload.map((p) =>
        p && typeof p === "object" && typeof (p as JsonRpcRequest).method === "string"
          ? handle(p as JsonRpcRequest)
          : Promise.resolve(failure(null, ERR.invalidRequest, "Invalid request")),
      ),
    );
    const body = responses.filter(Boolean);
    return body.length ? Response.json(body) : new Response(null, { status: 202 });
  }

  const req = payload as JsonRpcRequest;
  if (!req || typeof req.method !== "string") {
    return Response.json(failure(null, ERR.invalidRequest, "Invalid request"), {
      status: 400,
    });
  }

  const response = await handle(req);
  // Notification — acknowledged with no body, per JSON-RPC.
  if (!response) return new Response(null, { status: 202 });
  return Response.json(response);
}

/** Discovery helper — handy for humans and health checks, not part of MCP. */
export async function GET() {
  return Response.json({
    ...SERVER_INFO,
    protocolVersion: PROTOCOL_VERSION,
    transport: "streamable-http",
    endpoint: "/api/mcp/music",
    tools: MUSIC_TOOLS.map((t) => ({ name: t.name, description: t.description })),
  });
}
