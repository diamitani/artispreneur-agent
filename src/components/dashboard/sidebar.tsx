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
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: ROUTES.dashboard, icon: Home },
  { label: "Projects", href: ROUTES.projects, icon: FolderKanban },
  { label: "Outputs", href: ROUTES.outputs, icon: FileOutput },
  { label: "Knowledge", href: ROUTES.knowledge, icon: BookOpen },
  { label: "Skills", href: ROUTES.skills, icon: Sparkles },
  { label: "Chat", href: ROUTES.chat, icon: MessageSquare },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
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
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.href ||
              (item.href !== ROUTES.dashboard && currentPath.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-crimson/10 text-gold border-l-2 border-crimson"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-crimson text-xs font-bold text-white">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">Artist</p>
              <p className="truncate text-xs text-gray-400">Workspace Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
