"use client";

import { UnifiedSidebar } from "@/components/shared/unified-sidebar";
import Link from "next/link";
import { ArrowRight, Zap, FileText, CircleDot, CheckCircle2, Clock, Sparkles, GraduationCap, Building2 } from "lucide-react";

const TASKS = [
  { id: "1", label: "Complete Artist Onboarding", status: "in-progress", priority: "high", agent: "Day-to-Day Manager" },
  { id: "2", label: "Register EIN with IRS", status: "pending", priority: "high", agent: "Legal Manager" },
  { id: "3", label: "Set up Business Bank Account", status: "pending", priority: "medium", agent: "Finance Manager" },
  { id: "4", label: "Register with a P.R.O.", status: "pending", priority: "medium", agent: "Publishing Manager" },
  { id: "5", label: "Upload music catalogue", status: "pending", priority: "low", agent: "Publishing Manager" },
];

const QUICK_LINKS = [
  { label: "Agent Chat", icon: Zap, href: "/workspace/chat", desc: "Talk to your AI agent" },
  { label: "Skills Marketplace", icon: Sparkles, href: "/skills", desc: "Install new capabilities" },
  { label: "Academy", icon: GraduationCap, href: "/academy", desc: "Courses & AI tutor" },
  { label: "Directory", icon: Building2, href: "/directory", desc: "78K+ industry contacts" },
];

const OUTPUTS = [
  { label: "Artist Business Plan Draft", date: "Aug 2, 2026", type: "Document" },
  { label: "EIN Application Summary", date: "Aug 1, 2026", type: "Document" },
  { label: "Social Media Strategy", date: "Jul 30, 2026", type: "Strategy" },
];

export default function DashboardPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3">
          <div>
            <h1 className="font-display text-lg text-black">Dashboard</h1>
            <p className="text-xs text-gray-400">Welcome back — you have 2 tasks awaiting action</p>
          </div>
          <Link
            href="/workspace/chat"
            className="flex items-center gap-2 rounded-lg bg-crimson px-4 py-2 text-sm font-bold text-white hover:bg-crimson-dark transition-colors"
          >
            <Zap className="h-4 w-4" />
            Open Agent
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Welcome banner */}
          <div className="relative mb-6 overflow-hidden rounded-xl bg-black p-6">
            <div className="absolute right-0 top-0 h-full w-[200px] bg-gradient-to-l from-crimson/10 to-transparent" />
            <div className="relative">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gold">Welcome back</p>
              <h2 className="font-display text-2xl text-white mb-1">Your Dashboard</h2>
              <p className="text-sm text-white/45 max-w-md">Your career dashboard. Every metric, every opportunity, every agent action — right here.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            {/* Quick Links */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-display text-base text-black mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group rounded-lg border border-gray-100 p-3 hover:border-crimson transition-colors"
                    >
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-gold/20">
                        <Icon className="h-4 w-4 text-black" />
                      </div>
                      <p className="text-[12px] font-bold text-black mb-0.5">{link.label}</p>
                      <p className="text-[10px] text-gray-400">{link.desc}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Outputs */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base text-black">Recent Outputs</h3>
                <Link href="/workspace/outputs" className="text-[11px] font-bold text-crimson hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {OUTPUTS.map((o, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-50 p-3 hover:bg-gray-50/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{o.label}</p>
                      <p className="text-[11px] text-gray-400">{o.date}</p>
                    </div>
                    <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">{o.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmap / Tasks */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base text-black">Your Roadmap</h3>
              <span className="rounded-full bg-crimson/10 px-2.5 py-0.5 text-[10px] font-bold text-crimson">2 Action Required</span>
            </div>
            <div className="space-y-1">
              {TASKS.map((task) => {
                const isComplete = task.status === "complete";
                const isInProgress = task.status === "in-progress";
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50/50 cursor-pointer"
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      isComplete ? "border-green-500 bg-green-500" : isInProgress ? "border-crimson" : "border-gray-200"
                    }`}>
                      {isComplete && <CheckCircle2 className="h-3 w-3 text-white" />}
                      {isInProgress && <CircleDot className="h-3 w-3 text-crimson" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${isComplete ? "text-gray-400 line-through" : "text-black font-medium"}`}>
                        {task.label}
                      </p>
                      <p className="text-[11px] text-gray-400">{task.agent}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isComplete ? "bg-green-50 text-green-600" :
                      isInProgress ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {isComplete ? "Complete" : isInProgress ? "In Progress" : "Pending"}
                    </span>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      task.priority === "high" ? "bg-crimson" : task.priority === "medium" ? "bg-amber-500" : "bg-gray-300"
                    }`} />
                    <ArrowRight className="h-3.5 w-3.5 text-gray-300" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}