"use client";

import { UnifiedSidebar } from "@/components/shared/unified-sidebar";
import { BookOpen, Search, FileText, Library, GraduationCap, Globe } from "lucide-react";

const KNOWLEDGE_ITEMS = [
  {
    id: "1",
    title: "Music Publishing 101 — PRO Registration Guide",
    category: "Industry Guides",
    source: "Academy",
    lastUpdated: "2026-07-15",
    icon: GraduationCap,
  },
  {
    id: "2",
    title: "Standard Performance Contract Template Explanation",
    category: "Legal",
    source: "Knowledge Base",
    lastUpdated: "2026-06-20",
    icon: FileText,
  },
  {
    id: "3",
    title: "Sync Licensing Revenue Strategies for Indies",
    category: "Revenue",
    source: "Academy",
    lastUpdated: "2026-07-28",
    icon: GraduationCap,
  },
  {
    id: "4",
    title: "DIY Musician's Guide to Booking Your First Tour",
    category: "Booking",
    source: "Knowledge Base",
    lastUpdated: "2026-05-12",
    icon: Library,
  },
  {
    id: "5",
    title: "Understanding Split Sheets and Ownership Rights",
    category: "Publishing",
    source: "Academy",
    lastUpdated: "2026-07-01",
    icon: GraduationCap,
  },
  {
    id: "6",
    title: "Complete Guide to DSP Distribution (DistroKid, UnitedMasters, TuneCore)",
    category: "Distribution",
    source: "Knowledge Base",
    lastUpdated: "2026-06-15",
    icon: Globe,
  },
  {
    id: "7",
    title: "LLC vs C-Corp for Musicians — Tax Comparison",
    category: "Legal",
    source: "Knowledge Base",
    lastUpdated: "2026-04-20",
    icon: FileText,
  },
  {
    id: "8",
    title: "Instagram & TikTok Content Strategy for Artists",
    category: "Marketing",
    source: "Academy",
    lastUpdated: "2026-07-10",
    icon: GraduationCap,
  },
];

const CATEGORIES = ["All", "Industry Guides", "Publishing", "Legal", "Revenue", "Booking", "Distribution", "Marketing"];

export default function KnowledgePage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3">
          <div>
            <h1 className="font-display text-lg text-black">Knowledge Base</h1>
            <p className="text-xs text-gray-400">Career knowledge that trains your agents to be smarter about YOUR business</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 max-w-xl focus-within:border-crimson focus-within:bg-white transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  cat === "All"
                    ? "bg-crimson text-white"
                    : "border border-gray-200 text-gray-500 hover:border-crimson hover:text-crimson"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Knowledge grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KNOWLEDGE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 hover:border-crimson hover:shadow-md transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/5 mb-3">
                    <Icon className="h-5 w-5 text-crimson" />
                  </div>
                  <h3 className="font-display text-sm text-black mb-2 group-hover:text-crimson transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{item.lastUpdated}</span>
                  </div>
                  <p className="mt-3 text-[10px] text-gray-400">
                    Source: {item.source}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}