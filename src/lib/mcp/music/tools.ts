/**
 * Music-domain tools — the capabilities Composio does not cover.
 *
 * Backed by two sources:
 *   MusicBrainz  open rights database, no credentials, rate-limited to ~1 rps
 *   Spotify      Web API via client credentials (app-level, not per-artist)
 *
 * These are defined once here and surfaced two ways: as MCP tools over
 * /api/mcp/music, and as AI SDK tools bound directly into the agent runtime.
 * One definition, so the two can never disagree.
 */

import { z } from "zod";

const MB_BASE = "https://musicbrainz.org/ws/2";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_BASE = "https://api.spotify.com/v1";

/** MusicBrainz requires a descriptive UA with contact info. */
const USER_AGENT =
  process.env.MUSICBRAINZ_USER_AGENT ??
  "ArtispreneurAgent/1.0 ( https://artispreneur.com )";

const NETWORK_TIMEOUT_MS = 15_000;

export class MusicToolError extends Error {
  constructor(
    message: string,
    readonly source: string,
  ) {
    super(message);
    this.name = "MusicToolError";
  }
}

async function fetchJson(url: string, init: RequestInit, source: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      throw new MusicToolError(`${source} returned ${res.status}`, source);
    }
    return await res.json();
  } catch (e) {
    if (e instanceof MusicToolError) throw e;
    const reason = e instanceof Error ? e.message : String(e);
    throw new MusicToolError(`${source} unreachable: ${reason}`, source);
  } finally {
    clearTimeout(timer);
  }
}

function mb(path: string) {
  return fetchJson(
    `${MB_BASE}${path}`,
    { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } },
    "MusicBrainz",
  );
}

// ── Spotify client-credentials token (cached until expiry) ──────────────

let spotifyToken: { value: string; expiresAt: number } | null = null;

export function isSpotifyConfigured() {
  return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}

async function spotifyAccessToken(): Promise<string> {
  if (!isSpotifyConfigured()) {
    throw new MusicToolError(
      "Spotify is not configured on this deployment (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET).",
      "Spotify",
    );
  }
  if (spotifyToken && spotifyToken.expiresAt > Date.now() + 30_000) {
    return spotifyToken.value;
  }

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const data = (await fetchJson(
    SPOTIFY_TOKEN_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    },
    "Spotify",
  )) as { access_token: string; expires_in: number };

  spotifyToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return spotifyToken.value;
}

async function spotify(path: string) {
  const token = await spotifyAccessToken();
  return fetchJson(
    `${SPOTIFY_BASE}${path}`,
    { headers: { Authorization: `Bearer ${token}` } },
    "Spotify",
  );
}

// ── Tool definitions ────────────────────────────────────────────────────

export type MusicTool = {
  name: string;
  description: string;
  schema: z.ZodTypeAny;
  /** JSON Schema mirror, for the MCP tools/list response. */
  inputSchema: Record<string, unknown>;
  run: (args: Record<string, unknown>) => Promise<unknown>;
};

export const MUSIC_TOOLS: MusicTool[] = [
  {
    name: "music_search_artist",
    description:
      "Find an artist in the MusicBrainz rights database and return candidate matches with their MBID. Use the MBID with music_list_recordings.",
    schema: z.object({ name: z.string().min(1) }),
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Artist name to search" } },
      required: ["name"],
    },
    run: async (args) => {
      const name = String(args.name ?? "");
      const data = (await mb(
        `/artist?query=${encodeURIComponent(name)}&fmt=json&limit=8`,
      )) as {
        artists?: {
          id: string;
          name: string;
          disambiguation?: string;
          country?: string;
          score?: number;
        }[];
      };
      return {
        matches: (data.artists ?? []).map((a) => ({
          mbid: a.id,
          name: a.name,
          country: a.country ?? null,
          note: a.disambiguation ?? null,
          confidence: a.score ?? null,
        })),
      };
    },
  },
  {
    name: "music_list_recordings",
    description:
      "List an artist's recordings from MusicBrainz including ISRCs. This is how the Publishing Manager finds works that exist publicly but were never registered with a PRO.",
    schema: z.object({
      mbid: z.string().min(1),
      limit: z.number().int().min(1).max(100).optional(),
    }),
    inputSchema: {
      type: "object",
      properties: {
        mbid: { type: "string", description: "MusicBrainz artist ID" },
        limit: { type: "number", description: "Max recordings (default 50, max 100)" },
      },
      required: ["mbid"],
    },
    run: async (args) => {
      const mbid = String(args.mbid ?? "");
      const limit = Math.min(Number(args.limit ?? 50) || 50, 100);
      const data = (await mb(
        `/recording?artist=${encodeURIComponent(mbid)}&fmt=json&limit=${limit}&inc=isrcs`,
      )) as {
        recordings?: {
          id: string;
          title: string;
          length?: number;
          isrcs?: string[];
          "first-release-date"?: string;
        }[];
        "recording-count"?: number;
      };

      const recordings = (data.recordings ?? []).map((r) => ({
        mbid: r.id,
        title: r.title,
        duration_ms: r.length ?? null,
        isrcs: r.isrcs ?? [],
        first_released: r["first-release-date"] ?? null,
      }));

      return {
        total: data["recording-count"] ?? recordings.length,
        returned: recordings.length,
        // The actionable signal: public recordings carrying no ISRC are the
        // ones most likely to be unregistered and unpaid.
        missing_isrc: recordings.filter((r) => r.isrcs.length === 0).length,
        recordings,
      };
    },
  },
  {
    name: "music_lookup_isrc",
    description:
      "Resolve an ISRC to its recordings. Use to verify a track is registered correctly and to confirm metadata before filing with a PRO.",
    schema: z.object({ isrc: z.string().min(5) }),
    inputSchema: {
      type: "object",
      properties: { isrc: { type: "string", description: "ISRC, e.g. GBAYE0601498" } },
      required: ["isrc"],
    },
    run: async (args) => {
      const isrc = String(args.isrc ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      const data = (await mb(`/isrc/${encodeURIComponent(isrc)}?fmt=json&inc=artists`)) as {
        recordings?: {
          id: string;
          title: string;
          length?: number;
          "artist-credit"?: { name: string }[];
        }[];
      };
      return {
        isrc,
        recordings: (data.recordings ?? []).map((r) => ({
          mbid: r.id,
          title: r.title,
          duration_ms: r.length ?? null,
          artists: (r["artist-credit"] ?? []).map((a) => a.name),
        })),
      };
    },
  },
  {
    name: "music_spotify_discography",
    description:
      "Pull an artist's Spotify discography with album, release date, and track metadata. Used to seed the workspace catalogue from a Spotify link.",
    schema: z.object({
      artist: z.string().min(1).describe("Artist name or Spotify artist ID"),
      limit: z.number().int().min(1).max(50).optional(),
    }),
    inputSchema: {
      type: "object",
      properties: {
        artist: { type: "string", description: "Artist name or Spotify artist ID" },
        limit: { type: "number", description: "Max albums (default 20, max 50)" },
      },
      required: ["artist"],
    },
    run: async (args) => {
      const query = String(args.artist ?? "");
      const limit = Math.min(Number(args.limit ?? 20) || 20, 50);

      // Accept a raw Spotify ID, otherwise resolve by search.
      let artistId = /^[A-Za-z0-9]{22}$/.test(query) ? query : null;
      let artistName = query;

      if (!artistId) {
        const search = (await spotify(
          `/search?q=${encodeURIComponent(query)}&type=artist&limit=1`,
        )) as { artists?: { items?: { id: string; name: string }[] } };
        const hit = search.artists?.items?.[0];
        if (!hit) return { artist: null, albums: [], note: "No Spotify artist matched." };
        artistId = hit.id;
        artistName = hit.name;
      }

      const albums = (await spotify(
        `/artists/${artistId}/albums?include_groups=album,single&limit=${limit}`,
      )) as {
        items?: {
          id: string;
          name: string;
          release_date: string;
          album_type: string;
          total_tracks: number;
        }[];
      };

      return {
        artist: { id: artistId, name: artistName },
        albums: (albums.items ?? []).map((a) => ({
          id: a.id,
          title: a.name,
          type: a.album_type,
          released: a.release_date,
          tracks: a.total_tracks,
        })),
      };
    },
  },
  {
    name: "music_spotify_track_metadata",
    description:
      "Get full metadata for a Spotify album's tracks, including ISRC, duration, and explicit flag — the fields a PRO registration form asks for.",
    schema: z.object({ albumId: z.string().min(1) }),
    inputSchema: {
      type: "object",
      properties: { albumId: { type: "string", description: "Spotify album ID" } },
      required: ["albumId"],
    },
    run: async (args) => {
      const albumId = String(args.albumId ?? "");
      const album = (await spotify(`/albums/${encodeURIComponent(albumId)}`)) as {
        name: string;
        release_date: string;
        label?: string;
        upc?: string;
        external_ids?: { upc?: string };
        tracks?: {
          items?: { id: string; name: string; duration_ms: number; track_number: number; explicit: boolean }[];
        };
      };

      // The album payload omits per-track ISRCs; the tracks endpoint carries them.
      const ids = (album.tracks?.items ?? []).map((t) => t.id).slice(0, 50);
      const full = ids.length
        ? ((await spotify(`/tracks?ids=${ids.join(",")}`)) as {
            tracks?: { id: string; external_ids?: { isrc?: string } }[];
          })
        : { tracks: [] };
      const isrcById = new Map(
        (full.tracks ?? []).map((t) => [t.id, t.external_ids?.isrc ?? null]),
      );

      return {
        album: {
          title: album.name,
          released: album.release_date,
          label: album.label ?? null,
          upc: album.external_ids?.upc ?? album.upc ?? null,
        },
        tracks: (album.tracks?.items ?? []).map((t) => ({
          id: t.id,
          number: t.track_number,
          title: t.name,
          duration_ms: t.duration_ms,
          explicit: t.explicit,
          isrc: isrcById.get(t.id) ?? null,
        })),
      };
    },
  },
];

export function getMusicTool(name: string) {
  return MUSIC_TOOLS.find((t) => t.name === name) ?? null;
}
