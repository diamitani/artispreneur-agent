"use client";

import { UnifiedSidebar } from "@/components/shared/unified-sidebar";
import { FileText, Plus, Download, ExternalLink, Search, Sparkles } from "lucide-react";
import Link from "next/link";

const TEMPLATES = [
  { id: "performance", name: "Performance Agreement", category: "Live", description: "Standard performance contract for live shows and events" },
  { id: "sync", name: "Sync Licensing Agreement", category: "Licensing", description: "License your music for TV, film, ads, and games" },
  { id: "collaboration", name: "Collaboration Agreement", category: "Publishing", description: "Define splits and rights between co-writers" },
  { id: "management", name: "Management Agreement", category: "Business", description: "Formalize the artist-manager relationship" },
  { id: "producer", name: "Producer Agreement", category: "Production", description: "Define producer fees, points, and rights" },
  { id: "split-sheet", name: "Split Sheet", category: "Publishing", description: "Document ownership percentages for each track" },
  { id: "nda", name: "Non-Disclosure Agreement", category: "Business", description: "Protect your unreleased music and business plans" },
  { id: "merch", name: "Merchandise Agreement", category: "Business", description: "Partner with merch companies for tour and online sales" },
];

const RECENT_CONTRACTS = [
  { id: "1", name: "Performance Agreement — The Blue Note", status: "Draft", date: "2026-08-02" },
  { id: "2", name: "Split Sheet — Collab w/ Maya Chen", status: "Generated", date: "2026-07-28" },
  { id: "3", name: "NDA — Studio Session", status: "Signed", date: "2026-07-20" },
];

const CATEGORIES = ["All", "Live", "Licensing", "Publishing", "Business", "Production"];

export default function ContractsPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3">
          <div>
            <h1 className="font-display text-lg text-black">Contracts</h1>
            <p className="text-xs text-gray-400">Generate contracts from 21+ templates. AI-assisted. Plain-language breakdown included.</p>
          </div>
          <Link
            href="/contracts/generate"
            className="flex items-center gap-2 rounded-lg bg-crimson px-4 py-2 text-sm font-bold text-white hover:bg-crimson-dark transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Generate New Contract
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 max-w-xl focus-within:border-crimson focus-within:bg-white transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
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

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Template grid */}
            <div className="lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {TEMPLATES.map((tmpl) => (
                  <Link
                    key={tmpl.id}
                    href={`/contracts/generate?template=${tmpl.id}`}
                    className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-crimson hover:shadow-md transition-all"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/5 mb-3">
                      <FileText className="h-5 w-5 text-crimson" />
                    </div>
                    <span className="mb-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 uppercase">
                      {tmpl.category}
                    </span>
                    <h3 className="font-display text-sm text-black mb-1 group-hover:text-crimson transition-colors">{tmpl.name}</h3>
                    <p className="text-[11px] text-gray-400">{tmpl.description}</p>
                  </Link>
                ))}
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white p-5 hover:border-crimson transition-colors cursor-pointer">
                  <div className="text-center">
                    <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-gray-50 mb-2">
                      <Plus className="h-5 w-5 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">Custom Contract</p>
                    <p className="text-[10px] text-gray-300">Describe what you need</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent contracts sidebar */}
            <div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-display text-sm text-black mb-4">Recent Contracts</h3>
                <div className="space-y-3">
                  {RECENT_CONTRACTS.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg border border-gray-50 p-3 hover:bg-gray-50/50 cursor-pointer">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-50">
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-black truncate">{c.name}</p>
                        <p className="text-[10px] text-gray-400">{c.date}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        c.status === "Signed" ? "bg-green-50 text-green-600" :
                        c.status === "Generated" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] font-medium text-gray-500 hover:bg-gray-50 text-center">
                  View All Contracts
                </button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-xl bg-black p-8 text-center">
            <h3 className="font-display text-xl text-white mb-2">
              Let your agent handle the legal paperwork.
            </h3>
            <p className="text-white/50 text-sm mb-5 max-w-md mx-auto">
              Ask your agent: "Generate a performance contract for my show at The Blue Note on September 15th." It drafts — you review and sign.
            </p>
            <Link
              href="/workspace/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-black hover:bg-gold-light transition-colors"
            >
              Ask Your Agent
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}