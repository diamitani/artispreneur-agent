import { NextResponse } from "next/server";
import { z } from "zod";
import { hubWriteGlobalJson } from "@/lib/hub/store";

export const runtime = "nodejs";

/**
 * Public contact form intake.
 *
 * `/contact` is the enterprise CTA on the pricing page — the highest-intent
 * path on the marketing site — and until now it 404'd. This is deliberately
 * the smallest thing that actually delivers a message: validate, cap the size,
 * and persist to hub storage (S3 in production) so nothing is lost if email
 * delivery is not configured yet.
 *
 * Unauthenticated by design. It therefore never echoes an internal error, and
 * every field is length-capped so a submission cannot be used to write an
 * unbounded object.
 */
const Body = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().max(160).optional().default(""),
  topic: z.enum(["general", "enterprise", "support", "press", "partnership"]),
  message: z.string().trim().min(10).max(4000),
  // Honeypot: a real person never sees this field, so anything in it is a bot.
  website: z.string().max(200).optional().default(""),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the form and try again.", code: "invalid_input" },
      { status: 400 },
    );
  }

  const { website, ...submission } = parsed.data;

  // Silently accept and drop honeypot hits — telling a bot it was caught only
  // teaches whoever wrote it to leave the field blank next time.
  if (website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const receivedAt = new Date().toISOString();
  const id = crypto.randomUUID();

  try {
    await hubWriteGlobalJson(`contact/inbound/${receivedAt}-${id}.json`, {
      id,
      received_at: receivedAt,
      ...submission,
    });
  } catch (err) {
    // Log server-side, stay generic to the caller.
    console.error("[contact] failed to persist submission", err);
    return NextResponse.json(
      { error: "We couldn't send that. Please email us directly.", code: "write_failed" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, id });
}
