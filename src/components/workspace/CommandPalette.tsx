"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { AGENTS } from "@/lib/agents";
import type { ViewId } from "@/lib/workspace-data";
import { cn } from "@/lib/utils";
import { useWorkspace } from "./WorkspaceProvider";

type Command = {
  id: string;
  label: string;
  hint: string;
  group: string;
  run: () => void;
};

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    setView,
    setAgentId,
    setChatOpen,
    sendMessage,
  } = useWorkspace();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const views: { id: ViewId; label: string }[] = [
      { id: "briefing", label: "Command Center" },
      { id: "team", label: "Agent Team" },
      { id: "catalog", label: "Catalog & Rights" },
      { id: "releases", label: "Releases" },
      { id: "licensing", label: "Sync Licensing" },
      { id: "royalties", label: "Royalties" },
      { id: "roadmap", label: "Roadmap" },
      { id: "files", label: "Vault" },
    ];
    const viewCmds: Command[] = views.map((v) => ({
      id: `view-${v.id}`,
      label: `Go to ${v.label}`,
      hint: "Navigate",
      group: "Navigate",
      run: () => setView(v.id),
    }));
    const agentCmds: Command[] = AGENTS.map((a) => ({
      id: `agent-${a.id}`,
      label: `Talk to ${a.name}`,
      hint: a.role,
      group: "Agents",
      run: () => {
        setAgentId(a.id);
        setChatOpen(true);
      },
    }));
    const actionCmds: Command[] = [
      {
        id: "act-rights",
        label: "Run a rights check on the catalog",
        hint: "Rights Validator",
        group: "Actions",
        run: () => {
          setChatOpen(true);
          sendMessage("Run a rights check on the catalog");
        },
      },
      {
        id: "act-release",
        label: "Prepare the next release for approval",
        hint: "Release Orchestrator",
        group: "Actions",
        run: () => {
          setChatOpen(true);
          sendMessage("Prepare the next release for approval");
        },
      },
      {
        id: "act-sync",
        label: "Draft a sync quote from the latest brief",
        hint: "Sync Researcher",
        group: "Actions",
        run: () => {
          setChatOpen(true);
          sendMessage("Draft a sync quote from the latest brief");
        },
      },
    ];
    return [...actionCmds, ...viewCmds, ...agentCmds];
  }, [setView, setAgentId, setChatOpen, sendMessage]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(term) || c.hint.toLowerCase().includes(term),
    );
  }, [q, commands]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setActive(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(t);
    }
  }, [paletteOpen]);

  useEffect(() => setActive(0), [q]);

  function exec(cmd?: Command) {
    if (!cmd) return;
    cmd.run();
    setPaletteOpen(false);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      exec(filtered[active]);
    }
  }

  let lastGroup = "";

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-3 border-b border-[color:var(--line)] px-4 py-3">
              <MagnifyingGlass className="h-4 w-4 text-[color:var(--muted)]" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search commands, agents, or ask for an outcome…"
                className="flex-1 bg-transparent text-sm text-[color:var(--cream)] outline-none placeholder:text-[color:var(--muted)]"
              />
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--muted)]">
                ESC
              </kbd>
            </div>
            <div className="max-h-[52vh] overflow-y-auto py-1.5">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-[color:var(--muted)]">
                  No matches. Press Enter to ask an agent instead.
                </p>
              )}
              {filtered.map((cmd, i) => {
                const showGroup = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                return (
                  <div key={cmd.id}>
                    {showGroup && (
                      <p className="px-4 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]/70">
                        {cmd.group}
                      </p>
                    )}
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => exec(cmd)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2 text-left",
                        i === active ? "bg-[color:var(--gold)]/10" : "hover:bg-white/[0.03]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex-1 truncate text-[13px]",
                          i === active ? "text-[color:var(--cream)]" : "text-[color:var(--cream)]/85",
                        )}
                      >
                        {cmd.label}
                      </span>
                      <span className="truncate text-[11px] text-[color:var(--muted)]">{cmd.hint}</span>
                      {i === active && <ArrowRight className="h-3.5 w-3.5 text-[color:var(--gold)]" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
