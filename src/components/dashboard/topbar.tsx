"use client";

import { Menu, Plus } from "lucide-react";

interface TopbarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Topbar({ title = "Dashboard", onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded p-1.5 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-1.5 rounded-md bg-crimson px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-crimson-dark transition-colors">
          <Plus className="h-3.5 w-3.5" />
          New Task
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-crimson text-xs font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
