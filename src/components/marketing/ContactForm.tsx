"use client";

import { useState } from "react";

const TOPICS = [
  { value: "enterprise", label: "Label / agency (Unlimited plan)" },
  { value: "general", label: "General question" },
  { value: "support", label: "Help with my account" },
  { value: "partnership", label: "Partnership" },
  { value: "press", label: "Press" },
] as const;

const FIELD =
  "mt-1.5 w-full rounded-lg border border-[color:var(--color-border-dark)] bg-white px-3.5 py-2.5 text-[14.5px] text-[color:var(--color-black)] outline-none transition-colors placeholder:text-[color:var(--color-gray-mid)] focus:border-[color:var(--color-crimson)]";

const LABEL = "block text-[13px] font-semibold text-[color:var(--color-black)]";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          organization: String(form.get("organization") ?? ""),
          topic: String(form.get("topic") ?? "general"),
          message: String(form.get("message") ?? ""),
          website: String(form.get("website") ?? ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "We couldn't send that. Try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-xl border border-[color:var(--color-border-dark)] bg-[color:var(--color-bg-surface)] p-8"
      >
        <p className="font-heading text-[22px] text-[color:var(--color-black)]">
          Message received.
        </p>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[color:var(--color-gray-dark)]">
          We read every one and reply within two business days — usually sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={LABEL}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            className={FIELD}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={LABEL}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={FIELD}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-org" className={LABEL}>
          Artist, label, or agency{" "}
          <span className="font-normal text-[color:var(--color-gray-mid)]">
            (optional)
          </span>
        </label>
        <input
          id="contact-org"
          name="organization"
          maxLength={160}
          className={FIELD}
          placeholder="Who you're writing on behalf of"
        />
      </div>

      <div>
        <label htmlFor="contact-topic" className={LABEL}>
          What&apos;s this about?
        </label>
        <select id="contact-topic" name="topic" defaultValue="enterprise" className={FIELD}>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          className={`${FIELD} resize-y`}
          placeholder="Tell us about your roster, your catalogue, and what you're trying to get off your plate."
        />
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="text-[13px] text-[color:var(--color-crimson)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn--primary btn--md"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
