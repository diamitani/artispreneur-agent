"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

function msgText(m: UIMessage): string {
  if (!m.parts?.length) return "";
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

const GREETING =
  "👋 Hey — I'm your Artispreneur Agent.\n\nI help independent artists and label rosters run the business side:\n• PRO registration (BMI / ASCAP / SESAC)\n• Distribution & royalty tracking\n• LLC / EIN setup\n• Contract drafts & split sheets\n• Label roster management\n\nWhat do you want to work on?";

/** Demo mode — statically served responses when Bedrock is unavailable */
const DEMO_RESPONSES: Record<string, string> = {
  pro: "For PRO registration I'll:\n\n1. Identify the right society for your genre\n2. Register you as writer + publisher\n3. Register every song with metadata & splits\n4. Track quarterly royalty statements\n\nWant me to start the checklist?",
  distribut:
    "Distribution comparison:\n\n• UnitedMasters — 100% royalties, marketing tools\n• DistroKid — unlimited uploads, fast delivery\n• TuneCore — publishing admin included\n• CD Baby — one-time fee, wide sync licensing\n\nWhat's your next release?",
  llc: "LLC setup — I'll walk you through:\n\n1. Name availability check\n2. State filing + Articles of Organization\n3. Operating Agreement draft\n4. EIN application with the IRS\n\nWhich state are you in?",
  roster:
    "For roster management I can:\n\n• Maintain individual artist profiles & soul.md\n• Coordinate agent tasks across artists\n• Generate shared split sheets & deal memos\n• Track approvals across the full roster\n\nHow many artists are on the roster?",
  label:
    "Label operations mode — I'll help you:\n\n• Run agent tasks across multiple artist workspaces\n• Draft deal memos, contracts, and schedules\n• Track releases, royalties, and payouts\n• Manage the approval queue across your team\n\nReady to set up your roster?",
  contract:
    "Contract drafts ready on request:\n\n• Split sheet (collab sessions)\n• Booking agreement\n• Producer agreement\n• Management agreement\n\nWhich contract do you need?",
  default:
    "I can help with:\n\n🎵 PRO registration (BMI/ASCAP/SESAC)\n📀 Distribution strategy\n🎬 Sync licensing\n⚖️ LLC & contract setup\n💰 Royalty tracking\n🏢 Label / roster management\n\nWhat do you want to tackle first?",
};

function staticReply(text: string): string {
  const low = text.toLowerCase();
  for (const [key, val] of Object.entries(DEMO_RESPONSES)) {
    if (key !== "default" && low.includes(key)) return val;
  }
  return DEMO_RESPONSES.default;
}

type Mode = "live-demo" | "live-auth";

export function HeroChat() {
  const [input, setInput] = useState("");
  const [mode] = useState<Mode>("live-demo");
  const [rateLimited, setRateLimited] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Live-demo transport → /api/agent/demo (no auth, rate-limited Bedrock)
  const demoTransport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agent/demo" }),
    [],
  );

  // Signed-in transport → /api/agent/chat (full Hermes + PAL + Skills)
  const authTransport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agent/chat" }),
    [],
  );

  const transport = mode === "live-auth" ? authTransport : demoTransport;

  const { messages, sendMessage, status, error, setMessages } = useChat({ transport });

  const busy = status === "submitted" || status === "streaming";

  // Seed greeting on first render
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          parts: [{ type: "text", text: GREETING }],
        } as UIMessage,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, busy]);

  // Detect 429 from demo endpoint
  useEffect(() => {
    if (error?.message?.includes("429") || error?.message?.toLowerCase().includes("rate limit")) {
      setRateLimited(true);
    }
  }, [error]);

  async function handleSend() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");

    if (rateLimited) {
      // Fall back to static responses when rate-limited
      const fakeUserMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        parts: [{ type: "text", text }],
      } as UIMessage;
      const fakeAgentMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: staticReply(text) }],
      } as UIMessage;
      setMessages((prev) => [...prev, fakeUserMsg, fakeAgentMsg]);
      return;
    }

    await sendMessage({ text });
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSend();
  }

  const userCount = messages.filter((m) => m.role === "user").length;
  const showCta = userCount >= 2;

  return (
    <div className="flex h-[520px] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white shadow-[0_24px_72px_rgba(0,0,0,0.13)]">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-crimson)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-gold)]" />
        <span className="h-2.5 w-2.5 rounded-full border border-[color:var(--color-border)]" />
        <span className="ml-1 font-heading text-[13px] text-[color:var(--color-black)]">
          Artispreneur Agent
        </span>
        <span className="ml-auto rounded-full bg-[color:var(--color-crimson)]/10 px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-[color:var(--color-crimson)]">
          {mode === "live-auth" ? "Your Workspace" : "Live · Bedrock"}
        </span>
      </div>

      {/* Messages */}
      <div ref={bodyRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => {
          const text = msgText(m);
          const isLastAgent = m.role === "assistant" && i === messages.length - 1;
          return (
            <div
              key={m.id}
              className={`max-w-[88%] rounded-[10px_10px_10px_2px] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "self-end rounded-[10px_10px_2px_10px] bg-[color:var(--color-crimson)] text-white"
                  : "self-start bg-[color:var(--color-bg-surface)] text-[color:var(--color-black)]"
              }`}
            >
              {text}
              {isLastAgent && showCta && mode === "live-demo" && (
                <span>
                  {" "}
                  <a
                    href="/api/auth/login?signup=1&return=/onboarding"
                    className="font-semibold text-[color:var(--color-crimson)] underline underline-offset-2"
                  >
                    Start your real workspace →
                  </a>
                </span>
              )}
            </div>
          );
        })}
        {busy && (
          <div className="self-start px-1 font-mono text-[11px] text-[color:var(--color-gray-mid)]">
            Agent is thinking…
          </div>
        )}
        {error && !rateLimited && (
          <div className="self-start rounded px-3 py-2 text-[12px] text-[color:var(--color-crimson)] bg-red-50">
            {error.message}
          </div>
        )}
        {rateLimited && (
          <div className="self-start rounded-lg bg-[color:var(--color-gold)]/10 px-3.5 py-2.5 text-[12px] text-[color:var(--color-black)]">
            Demo limit reached.{" "}
            <a
              href="/api/auth/login?signup=1&return=/onboarding"
              className="font-semibold text-[color:var(--color-crimson)]"
            >
              Sign up free for unlimited access →
            </a>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)] px-3 py-3">
        <div className="flex gap-2 rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 focus-within:border-[color:var(--color-crimson)]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={
              mode === "live-auth"
                ? "Tell your agent what to work on…"
                : "Ask about PROs, contracts, label roster…"
            }
            disabled={busy}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-[color:var(--color-black)] outline-none placeholder:text-[color:var(--color-gray-mid)]"
          />
          <button
            onClick={handleSend}
            disabled={busy || !input.trim()}
            className="shrink-0 rounded-md bg-[color:var(--color-crimson)] px-3.5 py-1.5 text-[12px] font-bold text-white transition-opacity disabled:opacity-40 hover:bg-[color:var(--color-crimson-dark)]"
          >
            Send
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between px-1">
          <p className="font-mono text-[10px] text-[color:var(--color-gray-mid)]">
            {mode === "live-auth"
              ? "Hermes · Bedrock DeepSeek · full workspace"
              : "AWS Bedrock DeepSeek · demo mode"}
          </p>
          {mode === "live-demo" && (
            <a
              href="/api/auth/login?signup=1&return=/onboarding"
              className="font-mono text-[10px] font-semibold text-[color:var(--color-crimson)] hover:underline"
            >
              Sign up for full workspace →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
