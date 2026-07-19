"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

function messageText(m: UIMessage): string {
  if (!m.parts?.length) return "";
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function MasterAgentChat({ artistId }: { artistId?: string }) {
  const [input, setInput] = useState("");
  const [keyInfo, setKeyInfo] = useState<{
    prefix?: string;
    reveal?: string;
    usage?: { total_tokens?: number; calls?: number; estimated_cost_usd?: number };
  }>({});

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agent/chat",
        body: artistId ? { artistId } : {},
      }),
    [artistId],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  useEffect(() => {
    fetch("/api/agent/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ensure: true }),
    })
      .then(() => fetch("/api/agent/keys"))
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) return;
        setKeyInfo({
          prefix: d.keys?.[0]?.key_prefix,
          reveal: d.reveal_once?.api_key,
          usage: d.usage,
        });
      })
      .catch(() => undefined);
  }, []);

  const busy = status === "submitted" || status === "streaming";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <div className="flex h-full min-h-[360px] flex-col rounded-[8px] bg-white shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
        <div>
          <p className="font-heading text-[15px] text-[color:var(--color-black)]">
            Master Agent
          </p>
          <p className="font-mono text-[10px] text-[color:var(--color-gray-mid)]">
            Bedrock · DeepSeek · approval-first
          </p>
        </div>
        <div className="text-right font-mono text-[10px] text-[color:var(--color-gray-mid)]">
          {keyInfo.prefix && <div>key {keyInfo.prefix}</div>}
          {keyInfo.usage && (
            <div>
              {keyInfo.usage.calls ?? 0} calls · {keyInfo.usage.total_tokens ?? 0} tok
            </div>
          )}
        </div>
      </div>

      {keyInfo.reveal && (
        <div className="border-b border-[color:var(--color-gold)] bg-[color:var(--color-gold-light)] px-4 py-2 text-[12px]">
          <p className="font-semibold text-[color:var(--color-black)]">
            Copy your workspace Agent API key now (shown once)
          </p>
          <code className="mt-1 block break-all font-mono text-[11px] text-[color:var(--color-black)]">
            {keyInfo.reveal}
          </code>
          <p className="mt-1 text-[11px] text-[color:var(--color-gray-dark)]">
            Header: <span className="font-mono">X-Artispreneur-Agent-Key</span> — tracks this
            workspace’s Bedrock usage separately from platform AWS credentials.
          </p>
          <button
            type="button"
            className="mt-2 text-[11px] font-semibold text-[color:var(--color-crimson)]"
            onClick={() => setKeyInfo((k) => ({ ...k, reveal: undefined }))}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-[color:var(--color-gray-mid)]">
            Ask for an EPK draft, release plan, outreach list, or business checklist. Nothing
            sends without your approval.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[90%] rounded-[6px] px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-[color:var(--color-bg-dark)] text-white"
                : "bg-[color:var(--color-bg-surface)] text-[color:var(--color-black)]"
            }`}
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider opacity-60">
              {m.role === "user" ? "you" : "master"}
            </p>
            <p className="whitespace-pre-wrap">{messageText(m)}</p>
          </div>
        ))}
        {error && (
          <p className="text-sm text-[color:var(--color-crimson)]">{error.message}</p>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-[color:var(--color-border)] p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell your agent what to work on…"
            className="flex-1 rounded-[6px] border border-[color:var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[color:var(--color-crimson)]"
            disabled={busy}
          />
          <button type="submit" className="btn btn--primary btn--sm" disabled={busy || !input.trim()}>
            {busy ? "…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
