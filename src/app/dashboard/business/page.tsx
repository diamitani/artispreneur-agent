"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const services = [
  { id: "ein", icon: "file-text", title: "EIN Registration", desc: "Get your Employer Identification Number", status: "action" as const },
  { id: "llc", icon: "briefcase", title: "Form an LLC", desc: "Create your own record label entity", status: "pending" as const },
  { id: "ccorp", icon: "briefcase", title: "Form a C-Corp", desc: "Incorporate for investor-ready structure", status: "pending" as const },
  { id: "bank", icon: "dollar-sign", title: "Business Bank Account", desc: "Get paid professionally via Mercury", status: "pending" as const },
  { id: "pro", icon: "music", title: "P.R.O. Registration", desc: "Register with ASCAP, BMI or SoundExchange", status: "pending" as const },
  { id: "dsp", icon: "trending-up", title: "DSP Distribution", desc: "Distribute to Spotify, Apple Music & more", status: "pending" as const },
  { id: "copyright", icon: "check-circle", title: "Copyright Registration", desc: "Protect your original works", status: "pending" as const },
  { id: "catalogue", icon: "book-open", title: "Music Catalogue", desc: "Master your track registry & royalties", status: "pending" as const },
];

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  action: { bg: "#FEE3E3", color: "#CC0000", label: "Start Now" },
  pending: { bg: "#F5F5F5", color: "#444", label: "Not Started" },
  complete: { bg: "#D1FAE5", color: "#065F46", label: "Complete" },
};

const iconPaths: Record<string, string> = {
  "file-text": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
  "dollar-sign": "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  music: "M9 18V5l12-2v13 M6 21a3 3 0 100-6 3 3 0 000 6z M18 19a3 3 0 100-6 3 3 0 000 6z",
  "trending-up": "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  "check-circle": "M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3",
  "book-open": "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
};

function Icon({ name, size = 18, color = "#777" }: { name: string; size?: number; color?: string }) {
  const d = iconPaths[name] ?? iconPaths["file-text"] ?? "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg: string, i: number) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}

export default function BusinessCenterPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = ["overview", "documents", "tasks"];

  return (
    <DashboardShell title="Business Center" subtitle="Legal, finance & publishing">
      <div className="p-5 md:p-7">
        <div className="mb-5">
          <p className="type-mono-label mb-1 text-[color:var(--color-crimson)]">Workspace</p>
          <h2 className="font-heading text-xl text-[color:var(--color-black)] md:text-[22px]">Business Center</h2>
          <p className="mt-1 text-[13px] text-[color:var(--color-gray-mid)]">
            Legal formation, financial operations, and publishing administration.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex border-b-2 border-[color:var(--color-border)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-[13px] font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "mb-[-2px] border-b-2 border-[color:var(--color-crimson)] text-[color:var(--color-crimson)]"
                  : "text-[color:var(--color-gray-mid)] hover:text-[color:var(--color-black)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Services grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((svc) => {
            const st = statusStyle[svc.status]!;
            return (
              <div
                key={svc.id}
                className={`group cursor-pointer rounded-[8px] bg-white p-4 shadow-[var(--shadow-sm)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${
                  svc.status === "action" ? "border-[1.5px] border-[color:var(--color-crimson)]" : "border-[1.5px] border-transparent"
                }`}
              >
                <div className="mb-2.5 flex items-start justify-between">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: svc.status === "action" ? "#FEE3E3" : "var(--color-bg-surface)" }}
                  >
                    <Icon name={svc.icon} size={18} color={svc.status === "action" ? "#CC0000" : "#777"} />
                  </div>
                  <span
                    className="rounded px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {st.label}
                  </span>
                </div>
                <h4 className="text-[13px] font-bold text-[color:var(--color-black)]">{svc.title}</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[color:var(--color-gray-mid)]">{svc.desc}</p>
                <div
                  className={`mt-3 flex items-center gap-1 text-[11px] font-semibold ${
                    svc.status === "action" ? "text-[color:var(--color-crimson)]" : "text-[color:var(--color-gray-subtle)]"
                  }`}
                >
                  {svc.status === "action" ? "Get Started" : "View Details"}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
