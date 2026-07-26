"use client";

import {
  Broadcast,
  Gauge,
  MusicNotesSimple,
  RocketLaunch,
  Scales,
  Coins,
  MapTrifold,
  FolderSimple,
  type Icon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { ViewId } from "@/lib/workspace-data";
import { cn } from "@/lib/utils";
import { useWorkspace } from "./WorkspaceProvider";

const NAV: { id: ViewId; label: string; icon: Icon }[] = [
  { id: "briefing", label: "Command Center", icon: Gauge },
  { id: "team", label: "Agent Team", icon: Broadcast },
  { id: "catalog", label: "Catalog & Rights", icon: MusicNotesSimple },
  { id: "releases", label: "Releases", icon: RocketLaunch },
  { id: "licensing", label: "Sync Licensing", icon: Scales },
  { id: "royalties", label: "Royalties", icon: Coins },
  { id: "roadmap", label: "Roadmap", icon: MapTrifold },
  { id: "files", label: "Vault", icon: FolderSimple },
];

export function ActivityRail() {
  const { view, setView } = useWorkspace();

  return (
    <nav className="z-10 flex w-[68px] flex-shrink-0 flex-col items-center gap-1 border-r border-[color:var(--line)] bg-[color:var(--ink)] py-3">
      {NAV.map((item) => {
        const active = view === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className="group relative flex w-full flex-col items-center gap-1 py-2.5"
            title={item.label}
          >
            {active && (
              <motion.span
                layoutId="rail-active"
                className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-[color:var(--gold)]"
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            )}
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                active
                  ? "bg-[color:var(--gold)]/12 text-[color:var(--gold)]"
                  : "text-[color:var(--muted)] group-hover:bg-white/[0.04] group-hover:text-[color:var(--cream)]",
              )}
            >
              <Icon weight={active ? "fill" : "regular"} className="h-[18px] w-[18px]" />
            </span>
            <span
              className={cn(
                "text-[8.5px] font-medium leading-tight tracking-wide",
                active ? "text-[color:var(--cream)]" : "text-[color:var(--muted)]",
              )}
            >
              {item.label.split(" ")[0]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
