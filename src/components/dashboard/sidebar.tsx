"use client";

import Link from "next/link";
import {
  Home,
  FolderKanban,
  FileOutput,
  BookOpen,
  Sparkles,
  MessageSquare,
  Settings,
  Briefcase,
  Palette,
  CalendarDays,
  GraduationCap,
  Zap,
  Plug,
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Grouped nav. Every href here resolves to a real page — when adding an
 * entry, add the route first.
 */
const navGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Home", href: ROUTES.dashboard, icon: Home },
      { label: "Chat", href: ROUTES.chat, icon: MessageSquare },
      { label: "Projects", href: ROUTES.projects, icon: FolderKanban },
      { label: "Outputs", href: ROUTES.outputs, icon: FileOutput },
      { label: "Knowledge", href: ROUTES.knowledge, icon: BookOpen },
    ],
  },
  {
    label: "Centers",
    items: [
      { label: "Business", href: ROUTES.business, icon: Briefcase },
      { label: "Brand", href: ROUTES.brand, icon: Palette },
      { label: "Booking", href: ROUTES.booking, icon: CalendarDays },
      { label: "Academy", href: ROUTES.academy, icon: GraduationCap },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Skills", href: ROUTES.skills, icon: Sparkles },
      { label: "Integrations", href: ROUTES.integrations, icon: Plug },
      { label: "Settings", href: ROUTES.settings, icon: Settings },
    ],
  },
];

interface SidebarProps {
  currentPath: string;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentPath, open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-charcoal text-white transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-800 px-5">
          <Logo className="text-xl text-white" />
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4 last:mb-0">
              <p className="px-3 pb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-gray-500">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    currentPath === item.href ||
                    (item.href !== ROUTES.dashboard &&
                      currentPath.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "border-l-2 border-crimson bg-crimson/10 text-gold"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-3">
          <Link
            href={ROUTES.workspace}
            className="mb-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <Zap className="h-3.5 w-3.5 shrink-0" />
            Hermes Mission Control
          </Link>
          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-crimson text-xs font-bold text-white">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">Artist</p>
              <p className="truncate text-xs text-gray-400">Free plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
