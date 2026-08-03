"use client";

import { UnifiedSidebar } from "@/components/shared/unified-sidebar";
import { FileOutput, Download, ExternalLink, FileText, Image, Film } from "lucide-react";

const OUTPUTS = [
  {
    id: "1",
    title: "Artist Business Plan",
    type: "Document",
    agent: "Day-to-Day Manager",
    date: "2026-08-02",
    size: "1.2 MB",
    icon: FileText,
  },
  {
    id: "2",
    title: "EIN Application Summary",
    type: "Document",
    agent: "Legal Manager",
    date: "2026-08-01",
    size: "340 KB",
    icon: FileText,
  },
  {
    id: "3",
    title: "Performance Contract — The Blue Note",
    type: "Contract",
    agent: "Contracts Agent",
    date: "2026-07-31",
    size: "680 KB",
    icon: FileText,
  },
  {
    id: "4",
    title: "Social Media Strategy — August",
    type: "Strategy",
    agent: "PR Manager",
    date: "2026-07-30",
    size: "2.4 MB",
    icon: Image,
  },
  {
    id: "5",
    title: "EPK — Artist One-Pager",
    type: "EPK",
    agent: "Brand Manager",
    date: "2026-07-29",
    size: "4.1 MB",
    icon: Film,
  },
  {
    id: "6",
    title: "Sync Licensing Pitch Package",
    type: "Strategy",
    agent: "PR Manager",
    date: "2026-07-28",
    size: "1.8 MB",
    icon: FileText,
  },
  {
    id: "7",
    title: "Tour Budget Template",
    type: "Document",
    agent: "Finance Manager",
    date: "2026-07-27",
    size: "420 KB",
    icon: FileText,
  },
  {
    id: "8",
    title: "Split Sheet — 4 Collaborations",
    type: "Document",
    agent: "Publishing Manager",
    date: "2026-07-26",
    size: "520 KB",
    icon: FileText,
  },
];

const TYPE_COLORS: Record<string, string> = {
  Document: "bg-blue-50 text-blue-600",
  Contract: "bg-crimson/10 text-crimson",
  Strategy: "bg-amber-50 text-amber-600",
  EPK: "bg-purple-50 text-purple-600",
};

export default function OutputsPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3">
          <div>
            <h1 className="font-display text-lg text-black">Outputs</h1>
            <p className="text-xs text-gray-400">All deliverables produced by your agents</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
              All Types
            </button>
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
              Recent
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">Output</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400 hidden sm:table-cell">Type</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400 hidden md:table-cell">Agent</th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400 hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {OUTPUTS.map((output) => {
                  const Icon = output.icon;
                  const typeColor = TYPE_COLORS[output.type] || "bg-gray-50 text-gray-600";
                  return (
                    <tr key={output.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-50">
                            <Icon className="h-4 w-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">{output.title}</p>
                            <p className="text-[11px] text-gray-400">{output.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${typeColor}`}>
                          {output.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">{output.agent}</td>
                      <td className="px-5 py-3 text-sm text-gray-400 hidden lg:table-cell">{output.date}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="rounded p-1.5 text-gray-400 hover:text-black hover:bg-gray-100">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="rounded p-1.5 text-gray-400 hover:text-black hover:bg-gray-100">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}