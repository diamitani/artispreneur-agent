"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { ArrowUp, CircleNotch, SidebarSimple, Sparkle, Stop } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { type UIMessage } from "ai";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useWorkspace } from "./WorkspaceProvider";

function messageText(m: UIMessage): string {
  if (!m.parts?.length) return "";
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function messageToolCalls(m: UIMessage): { name: string; state: string }[] {
  if (!m.parts?.length) return [];
  return m.parts
    .filter((p) => p.type === "tool-invocation")
    .map((p) => {
      const t = p as unknown as { toolName: string; state: string };
      return { name: t.toolName ?? "tool", state: t.state ?? "running" };
    });
}

export function AgentDock() {
  const { chatOpen, setChatOpen, messages, sendMessage, status, error, input, setInput, stop } =
    useWorkspace();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!busy && chatOpen) inputRef.current?.focus();
  }, [busy, chatOpen]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    sendMessage(input);
    setInput("");
  }

  if (!chatOpen) {
    return (
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-md border border-[color:var(--gold)]/30 bg-[color:var(--surface)] px-4 py-2.5 text-xs font-semibold text-[color:var(--gold)] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]"
      >
        <Sparkle weight="fill" className="h-3.5 w-3.5" />
        Open agent
      </button>
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="flex h-full w-full flex-col border-l border-[color:var(--line)] bg-[color:var(--ink)] md:w-[420px] md:flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--gold)]/15">
            <Image src={brand.logo.primaryPng} alt="" width={16} height={16} />
          </span>
          <div>
            <p className="text-sm font-medium text-[color:var(--cream)]">Hermes</p>
            <p className="text-[10px] text-[color:var(--muted)]">
              Your AI coworker · Bedrock
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setChatOpen(false)}
          className="rounded-md p-1.5 text-[color:var(--muted)] hover:bg-white/[0.04]"
          aria-label="Collapse agent chat"
        >
          <SidebarSimple className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !busy && (
          <div className="flex h-full flex-col items-center justify-center text-center px-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--gold)]/10">
              <Image src={brand.logo.primaryPng} alt="" width={24} height={24} />
            </div>
            <p className="text-[15px] font-semibold text-[color:var(--cream)]">
              What should we work on?
            </p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-[color:var(--muted)]">
              I can draft your EPK, plan a release, review contracts, write outreach, build your
              business — anything. Just tell me the outcome you want.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {[
                "Draft my EPK bio",
                "Plan my next release",
                "Write a sync pitch",
                "Set up my LLC",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setInput(s);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-[11px] text-[color:var(--muted)] transition-colors hover:border-[color:var(--gold)]/40 hover:text-[color:var(--gold)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const text = messageText(m);
            const tools = messageToolCalls(m);
            if (!text && tools.length === 0) return null;

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                className={cn("mb-4", m.role === "user" ? "ml-8" : "mr-4")}
              >
                {/* Role label */}
                <div className="mb-1 flex items-center gap-1.5">
                  {m.role === "assistant" && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--gold)]/15">
                      <Image src={brand.logo.primaryPng} alt="" width={10} height={10} />
                    </span>
                  )}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                    {m.role === "user" ? "You" : "Hermes"}
                  </span>
                </div>

                {/* Tool calls */}
                {tools.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {tools.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 font-mono text-[11px] text-[color:var(--muted)]"
                      >
                        {t.state === "result" ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[color:var(--gold)] border-t-transparent" />
                        )}
                        <span className="text-[color:var(--gold)]">
                          {t.name.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message bubble */}
                {text && (
                  <div
                    className={cn(
                      "rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed",
                      m.role === "user"
                        ? "bg-[color:var(--gold)]/10 text-[color:var(--cream)]"
                        : "bg-[color:var(--surface)] text-[color:var(--cream)]/90",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{text}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Thinking indicator */}
        {busy && (messages.length === 0 || messages[messages.length - 1]?.role === "user") && (
          <div className="mb-4 mr-4">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--gold)]/15">
                <Image src={brand.logo.primaryPng} alt="" width={10} height={10} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                Hermes
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[color:var(--surface)] px-3.5 py-3">
              <CircleNotch className="h-3.5 w-3.5 animate-spin text-[color:var(--gold)]" />
              <span className="text-[12px] text-[color:var(--muted)]">Working on it…</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-[color:var(--red)]/30 bg-[color:var(--red)]/10 px-3.5 py-2.5 text-[12px] text-[color:var(--red)]">
            {error.message}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-[color:var(--line)] px-3 py-3">
        <div className="flex items-end gap-2 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-2 focus-within:border-[color:var(--gold)]/40">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            rows={1}
            placeholder="Tell me what you need…"
            className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent px-1 py-1.5 text-[13px] text-[color:var(--cream)] outline-none placeholder:text-[color:var(--muted)]"
            disabled={false}
          />
          {busy ? (
            <button
              type="button"
              onClick={stop}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--red)]/80 text-white hover:bg-[color:var(--red)]"
              aria-label="Stop"
            >
              <Stop weight="bold" className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--gold)] text-[color:var(--ink)] transition-colors hover:bg-[#ffd84d] disabled:opacity-30"
              aria-label="Send"
            >
              <ArrowUp weight="bold" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mt-1.5 px-1 text-[10px] text-[color:var(--muted)]">
          ⏎ to send · Shift+⏎ for newline · Nothing sends without your approval
        </p>
      </form>
    </motion.aside>
  );
}
