import { DashboardShell } from "@/components/dashboard/DashboardShell";
import Link from "next/link";

const tasks = [
  { id: 1, label: "Complete Artist Onboarding", status: "in-progress" as const, priority: "high" as const },
  { id: 2, label: "Register EIN", status: "pending" as const, priority: "high" as const },
  { id: 3, label: "Set up Business Bank Account", status: "pending" as const, priority: "medium" as const },
  { id: 4, label: "Register with a P.R.O.", status: "pending" as const, priority: "medium" as const },
  { id: 5, label: "Upload music catalogue", status: "complete" as const, priority: "low" as const },
];

const quickLinks = [
  { label: "Business Center", icon: "briefcase", href: "/dashboard/business", desc: "Legal, finance & publishing" },
  { label: "Brand Center", icon: "palette", href: "/dashboard/brand", desc: "Social, press kits & design" },
  { label: "Booking Center", icon: "calendar", href: "/dashboard/booking", desc: "CRM, outreach & directory" },
  { label: "Academy", icon: "graduation-cap", href: "/dashboard/academy", desc: "Courses & resources" },
];

const outputs = [
  { label: "Artist Business Plan Draft", date: "Apr 18, 2026", type: "Document" },
  { label: "EIN Application Summary", date: "Apr 17, 2026", type: "Document" },
  { label: "Social Media Strategy", date: "Apr 15, 2026", type: "Strategy" },
];

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  "in-progress": { bg: "#EFF6FF", text: "#1D4ED8", label: "In Progress" },
  pending: { bg: "#F5F5F5", text: "#444", label: "Pending" },
  complete: { bg: "#D1FAE5", text: "#065F46", label: "Complete" },
};

const priorityColor: Record<string, string> = {
  high: "#CC0000",
  medium: "#D97706",
  low: "#ccc",
};

export default function DashboardHomePage() {
  const actionCount = tasks.filter((t) => t.status === "in-progress" || t.status === "pending").length;

  return (
    <DashboardShell title="Home" subtitle="Your music business command center">
      <div className="p-5 md:p-7">
        {/* Welcome banner */}
        <div className="relative mb-6 overflow-hidden rounded-[10px] bg-[color:var(--color-bg-dark)] px-6 py-5 text-white md:px-7 md:py-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-5 -top-5 h-44 w-44 rounded-full bg-[rgba(204,0,0,0.15)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 right-14 h-28 w-28 rounded-full bg-[rgba(254,208,1,0.08)]"
          />
          <div className="relative">
            <p className="type-mono-label mb-1.5 text-[color:var(--color-gold)]">Welcome back</p>
            <h2 className="font-heading text-xl text-white md:text-2xl">Your Dashboard</h2>
            <p className="mt-1.5 text-[13px] text-white/55">
              Art Means Business. You have {actionCount} tasks awaiting action.
            </p>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-3">
            <Link href="/onboarding" className="btn btn--gold btn--sm">
              Continue Onboarding
            </Link>
            <Link href="/workspace" className="btn btn--outline-on-dark btn--sm">
              Open Hermes
            </Link>
          </div>
        </div>

        {/* Quick Links + Recent Outputs */}
        <div className="mb-5 grid gap-5 lg:grid-cols-2">
          {/* Quick Links */}
          <div className="rounded-[8px] bg-white p-5 shadow-[var(--shadow-sm)]">
            <h3 className="font-heading mb-3.5 text-[15px] text-[color:var(--color-black)]">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {quickLinks.map((ql) => (
                <Link
                  key={ql.href}
                  href={ql.href}
                  className="group block rounded-[8px] border border-[color:var(--color-border)] p-3 transition-all hover:border-[color:var(--color-crimson)] hover:shadow-[0_2px_8px_rgba(204,0,0,0.08)]"
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--color-gold-light)]">
                    <QuickIcon name={ql.icon} />
                  </div>
                  <p className="text-xs font-bold text-[color:var(--color-black)]">{ql.label}</p>
                  <p className="mt-0.5 text-[11px] text-[color:var(--color-gray-mid)]">{ql.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Outputs */}
          <div className="rounded-[8px] bg-white p-5 shadow-[var(--shadow-sm)]">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="font-heading text-[15px] text-[color:var(--color-black)]">Recent Outputs</h3>
              <Link href="/workspace" className="text-[11px] font-semibold text-[color:var(--color-crimson)]">
                View all
              </Link>
            </div>
            <div className="space-y-0">
              {outputs.map((o, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 py-2 ${
                    i < outputs.length - 1 ? "border-b border-[color:var(--color-border)]" : ""
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--color-bg-surface)]">
                    <QuickIcon name="file-text" color="#777" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-[color:var(--color-black)]">{o.label}</p>
                    <p className="text-[10px] text-[color:var(--color-gray-subtle)]">{o.date}</p>
                  </div>
                  <span className="shrink-0 rounded bg-[color:var(--color-bg-surface)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-gray-mid)]">
                    {o.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks / Roadmap */}
        <div className="rounded-[8px] bg-white p-5 shadow-[var(--shadow-sm)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-[15px] text-[color:var(--color-black)]">Your Roadmap</h3>
            <span className="rounded bg-[color:var(--color-gold-light)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-black)]">
              {actionCount} Action Required
            </span>
          </div>
          <div>
            {tasks.map((t, i) => {
              const st = statusStyle[t.status];
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 py-2.5 ${
                    i < tasks.length - 1 ? "border-b border-[color:var(--color-border)]" : ""
                  }`}
                >
                  <div
                    className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: t.status === "complete" ? "#1A7F4B" : "#DDD",
                      background: t.status === "complete" ? "#1A7F4B" : "transparent",
                    }}
                  >
                    {t.status === "complete" && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`flex-1 text-[13px] font-medium ${
                      t.status === "complete" ? "text-[color:var(--color-gray-subtle)] line-through" : "text-[color:var(--color-black)]"
                    }`}
                  >
                    {t.label}
                  </span>
                  <div
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: priorityColor[t.priority] }}
                  />
                  <span
                    className="shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: st.bg, color: st.text }}
                  >
                    {st.label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function QuickIcon({ name, color = "#7A5C00" }: { name: string; color?: string }) {
  const paths: Record<string, string> = {
    briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
    palette: "M12 2a10 10 0 100 20c1.1 0 2-.9 2-2v-.5c0-.3.2-.5.5-.5H17a3 3 0 000-6h-1.4A10 10 0 0012 2z",
    calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
    "graduation-cap": "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
    "file-text": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  };
  const d = paths[name] || paths["file-text"];
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}
