"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp, CircleNotch, SidebarSimple, Sparkle, ShieldCheck } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { getAgent } from "@/lib/agents";
import { cn } from "@/lib/utils";
import { useWorkspace } from "./WorkspaceProvider";
import { StatusPulse } from "./StatusPulse";
import { MagneticButton } from "./MagneticButton";

export function AgentDock() {
  const { chatOpen, setChatOpen, messages, sendMessage, agentId, thinking } = useWorkspace();
  const [draft, setDraft] = useState("");
  const agent = getAgent(agentId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
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
      className="fixed inset-x-0 bottom-0 top-14 z-30 flex w-full flex-col border-t border-[color:var(--line)] bg-[color:var(--surface)] md:relative md:inset-auto md:top-auto md:h-full md:w-[380px] md:flex-shrink-0 md:border-l md:border-t-0"
    >
      <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <StatusPulse status={agent.status} />
          <div>
            <p className="text-sm font-medium text-[color:var(--cream)]">{agent.name}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted)]">
              {agent.role}
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

      {agent.approvalGate && (
        <div className="flex items-center gap-2 border-b border-[color:var(--line)] bg-[color:var(--gold)]/[0.06] px-4 py-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--gold)]" />
          <p className="text-[11px] text-[color:var(--cream)]/80">
            Approval gate: <span className="text-[color:var(--gold)]">{agent.approvalGate}</span>
          </p>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              className="flex flex-col gap-1"
            >
              {msg.role === "tool" ? (
                <div className="rounded-md border border-[color:var(--line)] bg-[color:var(--ink)] px-3 py-2 font-mono text-[11px] text-[color:var(--muted)]">
                  <span className="text-[color:var(--gold)]">{msg.toolName}</span>
                  <span className="mx-2 text-white/20">·</span>
                  {msg.content}
                </div>
              ) : msg.role === "system" ? (
                <p className="text-center text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  {msg.content}
                </p>
              ) : (
                <>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                    {msg.role === "user" ? "You" : getAgent((msg.agentId as never) ?? agentId).name}
                  </span>
                  <div
                    className={cn(
                      "rounded-md px-3 py-2.5 text-[13px] leading-relaxed text-[color:var(--cream)]/90",
                      msg.role === "agent"
                        ? "border-l-2 border-[color:var(--gold)] bg-[color:var(--ink)]"
                        : "bg-white/[0.05]",
                    )}
                  >
                    {msg.content}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {thinking && (
          <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
            <CircleNotch className="h-3.5 w-3.5 animate-spin text-[color:var(--gold)]" />
            Compiling intent and checking the rights gate…
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-[color:var(--line)] p-3">
        <p className="mb-2 px-1 text-[10px] text-[color:var(--muted)]">
          Plain language. Ask for the outcome — no prompt engineering required.
        </p>
        <div className="flex items-end gap-2 rounded-md border border-[color:var(--line)] bg-[color:var(--ink)] p-2 focus-within:border-[color:var(--gold)]/40">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) onSubmit(e);
            }}
            rows={2}
            placeholder="e.g. Clear the rights blockers and prep Midnight Circuit for delivery"
            className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-1 py-1 text-sm text-[color:var(--cream)] outline-none placeholder:text-[color:var(--muted)]"
          />
          <MagneticButton
            type="submit"
            className="h-9 w-9 rounded-md bg-[color:var(--gold)] p-0 text-[color:var(--ink)] hover:bg-[#ffd84d]"
            ariaLabel="Send"
          >
            <ArrowUp weight="bold" className="h-4 w-4" />
          </MagneticButton>
        </div>
      </form>
    </motion.aside>
  );
}
