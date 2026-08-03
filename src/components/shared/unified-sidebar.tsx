"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  FolderKanban,
  FileOutput,
  BookOpen,
  Settings,
  Sparkles,
  GraduationCap,
  Building2,
  FileText,
  LayoutTemplate,
  Disc3,
  User,
  CreditCard,
  LogOut,
  Menu,
  X,
  Rss,
} from "lucide-react";
import { brand } from "@/lib/brand";

interface NavSection {
  label: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { id: "chat", label: "Chat", icon: MessageSquare, href: "/workspace/chat" },
      { id: "projects", label: "Projects", icon: FolderKanban, href: "/workspace/projects" },
      { id: "outputs", label: "Outputs", icon: FileOutput, href: "/workspace/outputs" },
      { id: "knowledge", label: "Knowledge", icon: BookOpen, href: "/workspace/knowledge" },
      { id: "config", label: "Configuration", icon: Settings, href: "/workspace/config" },
    ],
  },
  {
    label: "Discover",
    items: [
      { id: "skills", label: "Skills Marketplace", icon: Sparkles, href: "/skills", badge: "New" },
      { id: "academy", label: "Academy", icon: GraduationCap, href: "/academy" },
      { id: "directory", label: "Directory", icon: Building2, href: "/directory" },
      { id: "blog", label: "Media & Blog", icon: Rss, href: "/media/blog" },
    ],
  },
  {
    label: "Tools",
    items: [
      { id: "contracts", label: "Contracts", icon: FileText, href: "/contracts" },
      { id: "epk", label: "EPK Builder", icon: LayoutTemplate, href: "/epk" },
      { id: "catalog", label: "Catalog", icon: Disc3, href: "/catalog" },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", icon: User, href: "/profile" },
      { id: "settings", label: "Settings & Billing", icon: CreditCard, href: "/settings" },
      { id: "logout", label: "Sign Out", icon: LogOut, href: "/api/auth/logout" },
    ],
  },
];

export function UnifiedSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/workspace/chat") return pathname === "/workspace" || pathname === "/workspace/chat" || pathname.startsWith("/workspace/chat");
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-800 bg-charcoal text-gray-300 lg:hidden"
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col bg-black border-r border-white/[0.06]
          transition-transform duration-200 lg:static lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-4">
          <Image
            src={brand.logo.primaryPng}
            alt="Artispreneur"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="font-display text-[15px] text-white">Artispreneur</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/20">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors
                      ${active
                        ? "bg-crimson/20 text-white border-l-[3px] border-crimson pl-[9px]"
                        : "text-white/45 hover:bg-white/[0.04] hover:text-white/75"
                      }
                    `}
                  >
                    <Icon className="h-[15px] w-[15px] shrink-0" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold text-black">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom status */}
        <div className="border-t border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </div>
            <span className="text-[11px] text-white/30 font-medium">Hermes Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}

