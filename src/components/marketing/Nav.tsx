"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/marketing-data";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-[var(--z-nav)] px-4 pointer-events-none">
      {/* Floating pill container — academy style */}
      <div className="pointer-events-auto mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-full border border-[#2a2a2a] bg-[#111111]/95 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[12px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Artispreneur Agent home">
          <Image
            src={brand.logo.primaryPng}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span className="font-heading text-[15px] tracking-tight text-white">
            Artispreneur
          </span>
          <span className="rounded bg-[color:var(--color-gold)]/20 px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-widest text-[color:var(--color-gold)]">
            AGENT
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <a
            href="/api/auth/login?return=/dashboard"
            className="hidden text-[13px] font-medium text-white/60 transition-colors hover:text-white sm:block"
          >
            Sign In
          </a>
          <a
            href="/api/auth/login?signup=1&return=/onboarding"
            className="rounded-full bg-[color:var(--color-crimson)] px-4 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-[color:var(--color-crimson-dark)]"
          >
            Get Started
          </a>
          <button
            type="button"
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="font-mono text-base leading-none">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="pointer-events-auto mx-auto mt-2 max-w-4xl overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111111]/98 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/api/auth/login?return=/dashboard"
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 sm:hidden"
            >
              Sign In
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
