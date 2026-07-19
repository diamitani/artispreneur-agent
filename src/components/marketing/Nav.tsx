"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/marketing-data";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[var(--z-nav)] w-full border-b border-[color:var(--color-border)] bg-white/96 backdrop-blur-[8px]">
      <div className="container-page flex h-[var(--nav-height)] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Artispreneur Agent home">
          <Image
            src={brand.logo.primaryPng}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
          <span className="font-heading text-lg tracking-tight text-[color:var(--color-black)]">
            Artispreneur
          </span>
          <span className="badge-agent">AGENT</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[color:var(--color-gray-dark)] transition-colors hover:text-[color:var(--color-crimson)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/api/auth/login?return=/workspace"
            className="btn btn--ghost btn--sm hidden sm:inline-flex"
          >
            Sign in
          </a>
          <a
            href="/api/auth/login?signup=1&return=/onboarding"
            className="btn btn--primary btn--sm"
          >
            Get Started Free
          </a>
          <button
            type="button"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded border border-[color:var(--color-border)] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="font-mono text-lg leading-none text-[color:var(--color-black)]">
              {open ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[color:var(--color-border)] bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded px-2 py-2.5 text-sm font-medium text-[color:var(--color-gray-dark)] hover:bg-[color:var(--color-bg-surface)] hover:text-[color:var(--color-crimson)]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/api/auth/login?return=/workspace"
              className="rounded px-2 py-2.5 text-sm font-medium text-[color:var(--color-gray-dark)] sm:hidden"
            >
              Sign in
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
