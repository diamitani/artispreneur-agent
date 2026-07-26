"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: ROUTES.agents, label: "Agents" },
  { href: ROUTES.pricing, label: "Pricing" },
  { href: ROUTES.about, label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="text-xl" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={ROUTES.signin}
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.signup}
            className="rounded-lg bg-crimson px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-crimson-dark"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-gray-100 bg-white transition-all md:hidden",
          open ? "max-h-80" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-4 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-100" />
          <Link href={ROUTES.signin} className="text-sm font-medium text-gray-700">
            Sign In
          </Link>
          <Link
            href={ROUTES.signup}
            className="rounded-lg bg-crimson px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </header>
  );
}
