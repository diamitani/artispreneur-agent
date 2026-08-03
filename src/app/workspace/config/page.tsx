"use client";

import { UnifiedSidebar } from "@/components/shared/unified-sidebar";
import { Settings, Wrench, FileText, Zap, Key, Globe, Shield, Save } from "lucide-react";

export default function ConfigPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3">
          <div>
            <h1 className="font-display text-lg text-black">Configuration</h1>
            <p className="text-xs text-gray-400">Agent settings, integrations, and soul.md</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-crimson px-4 py-2 text-sm font-bold text-white hover:bg-crimson-dark transition-colors">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Soul.md */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-crimson" />
                <h2 className="font-display text-base text-black">Soul.md</h2>
                <span className="rounded bg-crimson/10 px-2 py-0.5 text-[10px] font-bold text-crimson">Core</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                This is your agent's core personality, behavior boundaries, and operating principles. Editing soul.md changes how your agent thinks and acts.
              </p>
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-black font-mono focus:outline-none focus:border-crimson min-h-[200px]"
                defaultValue={`# Artist Soul — John Zenith

## Role
Independent music artist and entrepreneur

## Career Stage
Active — 2 EPs released, building toward debut album

## Goals
- Complete debut album (10 tracks) by Q4 2026
- Book 15-city tour for album release
- Register publishing and collect all royalties
- Build professional brand and press presence

## Strengths
Production skills, live performance, growing social following (15K)

## Limitations
No business formation yet, no PRO registration, no booking agent

## Boundaries
Agent drafts — artist approves. No outgoing comms without review.`}
              />
            </div>

            {/* Active Tools */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-4 w-4 text-crimson" />
                <h2 className="font-display text-base text-black">Active Tools & Permissions</h2>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Gmail", description: "Send and read emails on your behalf", enabled: true, icon: Globe },
                  { name: "Google Calendar", description: "Schedule and manage events", enabled: true, icon: Globe },
                  { name: "Google Drive", description: "Import/export files from your drive", enabled: false, icon: Globe },
                  { name: "Spotify API", description: "Pull discography and streaming data", enabled: false, icon: Globe },
                  { name: "HubSpot", description: "CRM for contacts and outreach tracking", enabled: true, icon: Globe },
                  { name: "DocuSign", description: "Send contracts for e-signature", enabled: false, icon: Shield },
                ].map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50">
                        <tool.icon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{tool.name}</p>
                        <p className="text-xs text-gray-400">{tool.description}</p>
                      </div>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        tool.enabled ? "bg-crimson" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          tool.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* API Keys */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-4 w-4 text-crimson" />
                <h2 className="font-display text-base text-black">API Keys</h2>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Use your Agent Platform API keys to connect external services or build your own integrations.
              </p>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2 font-mono text-sm text-gray-600">
                  <span>apa_live_</span>
                  <span className="text-gray-300">••••••••••••••••••••••••••••••</span>
                </div>
                <button className="rounded px-3 py-1 text-xs font-medium text-crimson hover:bg-crimson/5">
                  Reveal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}