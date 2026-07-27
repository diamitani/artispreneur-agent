"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";

const NAV_ITEMS = [
  { id: "dashboard", label: "Home", icon: "home", href: "/dashboard" },
  { id: "business", label: "Business Center", icon: "briefcase", href: "/dashboard/business" },
  { id: "brand", label: "Brand Center", icon: "palette", href: "/dashboard/brand" },
  { id: "booking", label: "Booking Center", icon: "calendar", href: "/dashboard/booking" },
  { id: "academy", label: "Academy", icon: "graduation-cap", href: "/dashboard/academy" },
  { id: "profile", label: "Profile", icon: "user", href: "/dashboard/profile" },
];

function Icon({ name, size = 16, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const paths: Record<string, string> = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
    palette: "M12 2a10 10 0 100 20c1.1 0 2-.9 2-2v-.5c0-.3.2-.5.5-.5H17a3 3 0 000-6h-1.4A10 10 0 0012 2z",
    calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
    "graduation-cap": "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    "chevron-right": "M9 18l6-6-6-6",
    check: "M20 6L9 17l-5-5",
    "file-text": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    music: "M9 18V5l12-2v13 M6 21a3 3 0 100-6 3 3 0 000 6z M18 19a3 3 0 100-6 3 3 0 000 6z",
    "trending-up": "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
    "dollar-sign": "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    "book-open": "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  };
  const d = paths[name] || paths.zap;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {(d ?? "").split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}

export function DashboardShell({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeId = NAV_ITEMS.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.id || "dashboard";

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[color:var(--color-bg-surface)]">
      {/* Sidebar */}
      <aside className="hidden h-full w-[220px] shrink-0 flex-col bg-[color:var(--color-bg-dark)] text-white md:flex">
        <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-5 py-5">
          <Image src={brand.logo.primaryPng} alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-heading text-[15px] text-white">Artispreneur</span>
        </div>
        <nav className="flex-1 px-2.5 py-3">
          <p className="px-3 pb-1 pt-2.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white/25">Workspace</p>
          {NAV_ITEMS.map((item) => {
            const active = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-[rgba(204,0,0,0.25)] text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <Icon name={item.icon} size={16} color={active ? "#fff" : "rgba(255,255,255,0.45)"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/[0.08] px-2.5 py-3">
          <Link
            href="/workspace"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium text-white/40 hover:bg-white/5 hover:text-white/70"
          >
            <Icon name="zap" size={14} color="rgba(255,255,255,0.4)" />
            Hermes Mission Control
          </Link>
          <Link
            href="/skills/library"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium text-white/40 hover:bg-white/5 hover:text-white/70"
          >
            <Icon name="book-open" size={14} color="rgba(255,255,255,0.4)" />
            Skills Library
          </Link>
          <a
            href="/api/auth/logout"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium text-white/40 hover:bg-white/5 hover:text-white/70"
          >
            Sign out
          </a>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-[var(--z-nav)] flex h-14 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Image src={brand.logo.primaryPng} alt="" width={28} height={28} className="h-7 w-7" />
          <span className="font-heading text-sm">Artispreneur</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded border border-[color:var(--color-border)]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span className="font-mono text-lg leading-none">{mobileOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[var(--z-overlay)] bg-black/50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-[260px] bg-[color:var(--color-bg-dark)] text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <span className="font-heading text-sm">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white">
                ×
              </button>
            </div>
            <nav className="px-2.5 py-3">
              {NAV_ITEMS.map((item) => {
                const active = activeId === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-medium ${
                      active ? "bg-[rgba(204,0,0,0.25)] text-white" : "text-white/50"
                    }`}
                  >
                    <Icon name={item.icon} size={16} color={active ? "#fff" : "rgba(255,255,255,0.45)"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col pt-14 md:pt-0">
        {/* Top bar */}
        <header className="hidden h-[60px] shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-white px-7 md:flex">
          <div>
            <h1 className="font-heading text-lg text-[color:var(--color-black)]">{title || "Dashboard"}</h1>
            {subtitle && <p className="text-xs text-[color:var(--color-gray-mid)]">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="flex items-center gap-2 rounded-md bg-[color:var(--color-bg-surface)] px-3 py-2 text-[13px] text-[color:var(--color-gray-mid)]"
            >
              <Icon name="zap" size={14} color="#777" />
              <span className="hidden sm:inline">Open Hermes</span>
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-crimson)]">
              <span className="text-[11px] font-bold text-white">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
