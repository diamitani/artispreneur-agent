import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#agents", label: "Agents" },
  { href: "/skills", label: "Skills" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
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

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[color:var(--color-gray-dark)] transition-colors hover:text-[color:var(--color-crimson)]"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[color:var(--color-gray-dark)] transition-colors hover:text-[color:var(--color-crimson)]"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a href="/api/auth/login?return=/workspace" className="btn btn--ghost btn--sm hidden sm:inline-flex">
            Sign in
          </a>
          <a
            href="/api/auth/login?signup=1&return=/onboarding"
            className="btn btn--primary btn--sm"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </header>
  );
}
