"use client";

import { CaretLeft, Plus } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { getAgent } from "@/lib/agents";
import { SESSIONS, TENANT } from "@/lib/workspace-data";
import { cn } from "@/lib/utils";
import { useWorkspace } from "./WorkspaceProvider";
import { StatusPulse } from "./StatusPulse";
import { NpaoTag } from "./ui";

export function SessionSidebar() {
  const { sidebarOpen, setSidebarOpen, sessionId, setSessionId, setAgentId, agentId } =
    useWorkspace();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 264, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="z-10 flex flex-shrink-0 flex-col overflow-hidden border-r border-[color:var(--line)] bg-[color:var(--ink)]"
        >
          <div className="flex w-[264px] flex-1 flex-col">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Workspace
                </p>
                <p className="text-sm font-semibold text-[color:var(--cream)]">{TENANT.brand}</p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-1.5 text-[color:var(--muted)] hover:bg-white/[0.04] hover:text-[color:var(--cream)]"
                aria-label="Collapse sidebar"
              >
                <CaretLeft className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-md border border-dashed border-[color:var(--line-strong)] px-3 py-2 text-xs font-medium text-[color:var(--muted)] transition-colors hover:border-[color:var(--gold)]/40 hover:text-[color:var(--gold)]"
            >
              <Plus className="h-3.5 w-3.5" />
              New session
            </button>

            <p className="px-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Recent sessions
            </p>
            <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
              {SESSIONS.map((s) => {
                const agent = getAgent(s.agentId);
                const active = s.id === sessionId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSessionId(s.id);
                      setAgentId(s.agentId);
                    }}
                    className={cn(
                      "group w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                      active ? "bg-white/[0.05]" : "hover:bg-white/[0.03]",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: agent.accent }} />
                      <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-[color:var(--cream)]/90">
                        {s.title}
                      </p>
                      <NpaoTag npao={s.npao} />
                    </div>
                    <p className="mt-1 truncate pl-3.5 text-[11px] leading-snug text-[color:var(--muted)]">
                      {s.preview}
                    </p>
                    <p className="mt-1 pl-3.5 text-[10px] uppercase tracking-wide text-[color:var(--muted)]/70">
                      {agent.name} · {s.updatedAt}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-[color:var(--line)] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <StatusPulse status={getAgent(agentId).status} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[color:var(--cream)]">
                    {getAgent(agentId).name}
                  </p>
                  <p className="truncate text-[10px] text-[color:var(--muted)]">
                    Active agent · {getAgent(agentId).division}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
