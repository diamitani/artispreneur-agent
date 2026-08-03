"use client";

import { UnifiedSidebar } from "@/components/shared/unified-sidebar";
import { FolderKanban, Plus, MoreHorizontal, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const PROJECTS = [
  {
    id: "1",
    name: "EIN & LLC Registration",
    description: "Register EIN with IRS and form LLC in Illinois",
    status: "in-progress",
    lastActive: "2 hours ago",
    agentCount: 2,
  },
  {
    id: "2",
    name: "Debut EP Release Campaign",
    description: "5-track EP — distribution, PR outreach, playlist pitching",
    status: "planning",
    lastActive: "1 day ago",
    agentCount: 3,
  },
  {
    id: "3",
    name: "Summer Tour Booking",
    description: "Austin, Nashville, Chicago — venue research and outreach",
    status: "in-progress",
    lastActive: "3 hours ago",
    agentCount: 1,
  },
  {
    id: "4",
    name: "Music Catalog Migration",
    description: "Import 24 tracks from Google Drive, extract metadata, generate split sheets",
    status: "planning",
    lastActive: "3 days ago",
    agentCount: 2,
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  "in-progress": { bg: "bg-blue-50", text: "text-blue-700", label: "In Progress" },
  planning: { bg: "bg-gray-100", text: "text-gray-600", label: "Planning" },
  complete: { bg: "bg-green-50", text: "text-green-700", label: "Complete" },
};

export default function ProjectsPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3">
          <div>
            <h1 className="font-display text-lg text-black">Projects</h1>
            <p className="text-xs text-gray-400">Organize your agent work into project containers</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-crimson px-4 py-2 text-sm font-bold text-white hover:bg-crimson-dark transition-colors">
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project) => {
              const status = STATUS_STYLES[project.status];
              return (
                <Link
                  key={project.id}
                  href={`/workspace/chat?project=${project.id}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-crimson hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/10">
                      <FolderKanban className="h-5 w-5 text-crimson" />
                    </div>
                    <button className="rounded p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-50">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="font-display text-base text-black mb-1 group-hover:text-crimson transition-colors">{project.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="h-3 w-3" />
                      {project.lastActive}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-400">
                    <span>{project.agentCount} agents active</span>
                    <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-crimson" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}