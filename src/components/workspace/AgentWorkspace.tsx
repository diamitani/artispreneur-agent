"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

const NAV_ITEMS = [
  { id: "chat", label: "Chat", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { id: "projects", label: "Projects", icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { id: "knowledge", label: "Knowledge Base", icon: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 19.5A2.5 2.5 0 014 17V5a2.5 2.5 0 012.5-2.5H20v17H6.5z" },
  { id: "outputs", label: "Outputs", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8" },
  { id: "profile", label: "Profile", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z" },
  { id: "config", label: "Agent Configuration", icon: "M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z M12 8a4 4 0 100 8 4 4 0 000-8z" },
  { id: "integrations", label: "Integrations", icon: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" },
  { id: "account", label: "Account", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
];

type ToolStep = { id: string; label: string; status: "running" | "done" | "pending" };

function extractToolSteps(messages: UIMessage[]): ToolStep[] {
  const steps: ToolStep[] = [];
  for (const m of messages) {
    if (m.role !== "assistant") continue;
    for (const part of m.parts ?? []) {
      if (part.type.startsWith("tool-") && part.type !== "tool-invocation") {
        const p = part as unknown as { type: string; toolCallId: string; state: string };
        const toolName = part.type.replace(/^tool-/, "");
        steps.push({
          id: p.toolCallId ?? toolName,
          label: formatToolName(toolName),
          status: p.state === "output-available" || p.state === "output-denied" ? "done" : "running",
        });
      }
    }
  }
  return steps;
}

function formatToolName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function messageText(m: UIMessage): string {
  if (!m.parts?.length) return "";
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

const MOCK_PROJECTS = [
  { id: "epk", name: "EPK Draft — Summer Release", progress: 72, status: "active" as const },
  { id: "contract", name: "Producer Split Agreement", progress: 45, status: "active" as const },
  { id: "release", name: "42-Day Release Plan", progress: 15, status: "queued" as const },
];

const MOCK_APPROVALS = [
  { id: "a1", title: "EPK bio draft for review", agent: "PR & Outreach", time: "2m ago" },
  { id: "a2", title: "Gmail draft: venue inquiry", agent: "Booking Agent", time: "5m ago" },
  { id: "a3", title: "Split sheet — 3 writers", agent: "Legal Agent", time: "12m ago" },
];

export function AgentWorkspace({ artistId }: { artistId?: string }) {
  const [activeNav, setActiveNav] = useState("chat");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agent/chat",
        body: artistId ? { artistId } : {},
      }),
    [artistId],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";
  const toolSteps = extractToolSteps(messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <div className="flex h-[100dvh] bg-[color:var(--color-bg-page)] text-[color:var(--color-text-primary)]">
      {/* LEFT SIDEBAR */}
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        {/* Workspace header */}
        <div className="flex items-center gap-2.5 border-b border-[color:var(--color-border)] px-4 py-4">
          <Image src={brand.logo.primaryPng} alt="" width={28} height={28} className="h-7 w-7" />
          <div className="min-w-0">
            <p className="truncate font-heading text-[14px] text-white">Artispreneur Agent</p>
            <p className="font-mono text-[10px] text-[color:var(--color-gold)]">Workspace</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNav(item.id)}
              className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                activeNav === item.id
                  ? "bg-[color:var(--color-gold)]/10 font-semibold text-[color:var(--color-gold)]"
                  : "text-[color:var(--color-text-muted)] hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                {item.icon.split(" M").map((seg, i) => (
                  <path key={i} d={i === 0 ? seg : "M" + seg} />
                ))}
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Plan badge */}
        <div className="border-t border-[color:var(--color-border)] px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[color:var(--color-text-dim)]">Plan</span>
            <span className="rounded-full bg-[color:var(--color-gold)]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[color:var(--color-gold)]">
              Workspace
            </span>
          </div>
          <Link
            href="/api/auth/logout"
            className="mt-2 block text-[11px] text-[color:var(--color-text-dim)] hover:text-[color:var(--color-crimson)]"
          >
            Sign out
          </Link>
        </div>
      </aside>

      {/* CENTER — CHAT */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <header className="flex items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-3">
          <div>
            <h1 className="font-heading text-[16px] text-white">Hermes Agent</h1>
            <p className="font-mono text-[10px] text-[color:var(--color-text-dim)]">
              PAL/ROSTR · Bedrock DeepSeek · approval-first
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[color:var(--color-success)] animate-pulse" />
              <span className="font-mono text-[10px] text-[color:var(--color-text-dim)]">Online</span>
            </span>
          </div>
        </header>

        {/* Tool execution steps */}
        {toolSteps.length > 0 && (
          <div className="border-b border-[color:var(--color-border)] bg-[#111113] px-5 py-2.5">
            <div className="flex items-center gap-4 overflow-x-auto">
              {toolSteps.slice(-4).map((step, i) => (
                <div key={step.id} className="flex items-center gap-1.5 whitespace-nowrap">
                  {step.status === "done" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[color:var(--color-gold)] border-t-transparent" />
                  )}
                  <span className={`font-mono text-[11px] ${step.status === "done" ? "text-[color:var(--color-text-dim)]" : "text-[color:var(--color-gold)]"}`}>
                    {step.label}
                  </span>
                  {i < toolSteps.slice(-4).length - 1 && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-mid)" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-gold)]/10">
                <Image src={brand.logo.primaryPng} alt="" width={32} height={32} />
              </div>
              <p className="font-heading text-lg text-white">What should we work on?</p>
              <p className="mt-1.5 max-w-sm text-[13px] text-[color:var(--color-text-muted)]">
                Ask for an EPK draft, release plan, contract review, outreach list, or business checklist.
                Nothing sends without your approval.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["Draft my EPK bio", "Create a release plan", "Review this contract"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setInput(s); }}
                    className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-1.5 text-[12px] text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = messageText(m);
            if (!text) return null;
            return (
              <div
                key={m.id}
                className={`mb-4 max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}
              >
                <div className="mb-1 flex items-center gap-1.5">
                  {m.role === "assistant" && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-gold)]/15">
                      <Image src={brand.logo.primaryPng} alt="" width={12} height={12} />
                    </span>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-text-dim)]">
                    {m.role === "user" ? "you" : "hermes"}
                  </span>
                </div>
                <div
                  className={`rounded-xl px-4 py-3 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[color:var(--color-gold)]/10 text-white"
                      : "bg-[color:var(--color-card)] text-[color:var(--color-text-secondary)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{text}</p>
                </div>
              </div>
            );
          })}

          {busy && messages[messages.length - 1]?.role === "user" && (
            <div className="mb-4 mr-auto max-w-[85%]">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-gold)]/15">
                  <Image src={brand.logo.primaryPng} alt="" width={12} height={12} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-text-dim)]">hermes</span>
              </div>
              <div className="rounded-xl bg-[color:var(--color-card)] px-4 py-3">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--color-gold)]" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--color-gold)]" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--color-gold)]" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}

          {error && (
            <p className="mb-4 text-[13px] text-[color:var(--color-crimson)]">{error.message}</p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell your agent what to work on..."
              className="flex-1 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-2.5 text-[13px] text-white placeholder:text-[color:var(--color-text-dim)] outline-none transition-colors focus:border-[color:var(--color-gold)]"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-gold)] text-black transition-colors hover:bg-[color:var(--color-gold-light)] disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13 M22 2l-7 20-4-9-9-4z" />
              </svg>
            </button>
          </div>
        </form>
      </main>

      {/* RIGHT PANEL — Active Context */}
      <aside className="flex w-[300px] shrink-0 flex-col border-l border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        {/* Active Context header */}
        <div className="border-b border-[color:var(--color-border)] px-4 py-3.5">
          <h2 className="font-heading text-[14px] text-white">Active Context</h2>
          <p className="font-mono text-[10px] text-[color:var(--color-text-dim)]">Projects & approvals</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Projects */}
          <div className="border-b border-[color:var(--color-border)] px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-text-dim)]">
                Projects
              </span>
              <span className="rounded bg-[color:var(--color-gold)]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[color:var(--color-gold)]">
                {MOCK_PROJECTS.length}
              </span>
            </div>
            <div className="space-y-3">
              {MOCK_PROJECTS.map((p) => (
                <div key={p.id} className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-white">{p.name}</span>
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                      p.status === "active"
                        ? "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]"
                        : "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-gray-dark)]">
                      <div
                        className="h-full rounded-full bg-[color:var(--color-gold)]"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[color:var(--color-text-dim)]">{p.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval queue */}
          <div className="px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-text-dim)]">
                Needs your review
              </span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-crimson)] font-mono text-[9px] font-bold text-white">
                {MOCK_APPROVALS.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {MOCK_APPROVALS.map((a) => (
                <div key={a.id} className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3">
                  <p className="text-[12px] font-medium text-white">{a.title}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[color:var(--color-text-dim)]">
                      {a.agent} · {a.time}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="rounded px-2.5 py-1 text-[10px] font-bold text-[color:var(--color-gold)] border border-[color:var(--color-gold)]/30 hover:bg-[color:var(--color-gold)]/10 transition-colors"
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      className="rounded bg-[color:var(--color-gold)] px-2.5 py-1 text-[10px] font-bold text-black hover:bg-[color:var(--color-gold-light)] transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
