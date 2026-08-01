"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { NAV_LINKS } from "./landing-data";

const SIGNUP_HREF = "/api/auth/login?signup=1&return=/onboarding";
const SIGNIN_HREF = "/api/auth/login?return=/dashboard";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[var(--z-nav)] transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#0b0b0b]/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src={brand.logo.primaryPng}
            alt=""
            width={30}
            height={30}
            className="h-[30px] w-[30px] object-contain"
          />
          <span className="font-heading text-[15px] tracking-tight text-white">
            Artispreneur
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={SIGNIN_HREF}
            className="text-[13.5px] font-medium text-white/70 transition-colors hover:text-white"
          >
            Sign in
          </a>
          <a href={SIGNUP_HREF} className="btn btn--primary btn--sm">
            Start free
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white md:hidden"
        >
          <span className="text-lg leading-none">{open ? "×" : "☰"}</span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#0b0b0b] px-6 pb-6 pt-2 md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/[0.06] py-3.5 text-[15px] font-medium text-white/75"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-5 flex flex-col gap-2.5">
            <a href={SIGNUP_HREF} className="btn btn--primary btn--md btn--block">
              Start free
            </a>
            <a href={SIGNIN_HREF} className="btn btn--outline-on-dark btn--md btn--block">
              Sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
