"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

function msgText(m: UIMessage): string {
  if (!m.parts?.length) return "";
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

const DEFAULT_GREETING =
  "What are we working on? I can draft an EPK, plan a release, research venues, prep a split sheet, or walk you through your business formation. Everything I produce lands in your approval queue first.";

const DEFAULT_SUGGESTIONS = [
  "Draft my artist bio in three lengths",
  "Plan a 42-day release for my next single",
  "Find venues near me that book my genre",
  "What do I need to register with a PRO?",
];

/**
 * Signed-in agent chat — talks to the full Hermes runtime at /api/agent/chat.
 *
 * The centers (Brand, Booking) reuse this with their own greeting and starter
 * prompts so every chat surface in the dashboard hits the real agent.
 */
export function DashboardAgentChat({
  greeting = DEFAULT_GREETING,
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "Tell your agent what to work on…",
}: {
  greeting?: string;
  suggestions?: readonly string[];
  placeholder?: string;
} = {}) {
  const [input, setInput] = useState("");
  const [failed, setFailed] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agent/chat" }),
    [],
  );
  const { messages, sendMessage, status, error } = useChat({ transport });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, busy]);

  useEffect(() => {
    if (!error) {
      setFailed(null);
      return;
    }
    const msg = error.message?.toLowerCase() ?? "";
    setFailed(
      msg.includes("503") || msg.includes("not configured")
        ? "The agent runtime isn't configured on this deployment yet."
        : "Something went wrong reaching your agent. Try again.",
    );
  }, [error]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    await sendMessage({ text: trimmed });
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-3.5">
          {empty && (
            <>
              <div className="max-w-[85%] self-start rounded-[10px_10px_10px_2px] bg-gray-50 px-4 py-3 text-[13.5px] leading-relaxed text-gray-900">
                {greeting}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-[12.5px] text-gray-600 transition-colors hover:border-crimson hover:text-crimson"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] whitespace-pre-wrap px-4 py-3 text-[13.5px] leading-relaxed ${
                m.role === "user"
                  ? "self-end rounded-[10px_10px_2px_10px] bg-crimson text-white"
                  : "self-start rounded-[10px_10px_10px_2px] bg-gray-50 text-gray-900"
              }`}
            >
              {msgText(m)}
            </div>
          ))}

          {busy && (
            <div className="self-start px-1 font-mono text-[11px] text-gray-400">
              Working…
            </div>
          )}
          {failed && (
            <div className="self-start rounded-lg bg-red-50 px-3.5 py-2.5 text-[12.5px] text-crimson">
              {failed}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2 focus-within:border-crimson">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send(input);
            }}
            disabled={busy}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
            className="shrink-0 rounded-md bg-crimson px-4 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:bg-crimson-dark disabled:opacity-40"
          >
            Send
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl px-1 text-[11px] text-gray-400">
          Drafts land in your approval queue — nothing sends without your review.
        </p>
      </div>
    </div>
  );
}
