"use client";

import { MagnifyingGlass, ListBullets, ChatCircleDots, Sidebar } from "@phosphor-icons/react";
import Image from "next/image";
import { getAgent } from "@/lib/agents";
import { TENANT } from "@/lib/workspace-data";
import { useWorkspace } from "./WorkspaceProvider";
import { StatusPulse } from "./StatusPulse";

const titles: Record<string, { eyebrow: string; title: string }> = {
  briefing: { eyebrow: "Command center", title: "Daily briefing" },
  team: { eyebrow: "ROSTR agents", title: "Your agent team" },
  catalog: { eyebrow: "Rights ledger", title: "Catalog & rights" },
  releases: { eyebrow: "Distribution", title: "Releases" },
  licensing: { eyebrow: "Sync CRM", title: "Licensing pipeline" },
  royalties: { eyebrow: "Finance", title: "Royalty ledger" },
  roadmap: { eyebrow: "NPAO", title: "Roadmap" },
  files: { eyebrow: "Knowledge vault", title: "Files" },
  canvas: { eyebrow: "Work surface", title: "Artifact canvas" },
};

export function CommandBar() {
  const { view, agentId, sidebarOpen, setSidebarOpen, chatOpen, setChatOpen, setPaletteOpen } =
    useWorkspace();
  const agent = getAgent(agentId);
  const meta = (titles[view] ?? titles.briefing)!;

  return (
    <header className="z-20 flex h-14 flex-shrink-0 items-center justify-between gap-4 border-b border-[color:var(--line)] bg-[color:var(--ink)] px-4">
      <div className="flex min-w-0 items-center gap-3">
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-[color:var(--muted)] hover:bg-white/[0.04] hover:text-[color:var(--cream)]"
            aria-label="Open sessions"
          >
            <Sidebar className="h-4 w-4" />
          </button>
        )}
        <Image src="/artispreneur-mark.svg" alt="Artispreneur" width={30} height={30} className="rounded-md" priority />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-[family-name:var(--font-outfit)] text-sm font-semibold tracking-tight text-[color:var(--cream)]">
              Artispreneur
            </p>
            <span className="hidden rounded border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--gold)] sm:inline">
              Agent OS · v2
            </span>
          </div>
          <p className="truncate text-[11px] text-[color:var(--muted)]">
            <span className="text-[color:var(--gold)]/90">{meta.eyebrow}</span>
            <span className="mx-1.5 text-white/20">/</span>
            {meta.title}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="hidden max-w-md flex-1 items-center gap-2 rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 text-left text-xs text-[color:var(--muted)] transition-colors hover:border-[color:var(--gold)]/25 md:flex"
      >
        <MagnifyingGlass className="h-3.5 w-3.5" />
        <span className="flex-1">Ask anything or jump to a workspace…</span>
        <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
      </button>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-2.5 py-1.5 sm:flex">
          <StatusPulse status={agent.status} />
          <span className="text-xs text-[color:var(--cream)]/85">{agent.name}</span>
        </div>
        {!chatOpen && (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="rounded-md p-1.5 text-[color:var(--muted)] hover:bg-white/[0.04]"
            aria-label="Open agent dock"
          >
            <ChatCircleDots className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="rounded-md p-1.5 text-[color:var(--muted)] hover:bg-white/[0.04] md:hidden"
          aria-label="Command palette"
        >
          <ListBullets className="h-4 w-4" />
        </button>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--red)] text-[11px] font-bold text-white"
          title={`${TENANT.artist} · ${TENANT.role}`}
        >
          {TENANT.initials}
        </div>
      </div>
    </header>
  );
}
