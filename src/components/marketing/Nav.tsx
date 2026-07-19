import Link from "next/link";
import { ArtispreneurMark } from "@/components/brand/ArtispreneurMark";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#team", label: "Agents" },
  { href: "#products", label: "Products" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--color-border)] bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-[var(--nav-height)] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Artispreneur home">
          <ArtispreneurMark size={40} />
          <div className="leading-tight">
            <span className="font-heading text-lg tracking-tight text-[color:var(--color-red)]">
              ARTISPRENEUR
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-warm-gray)] sm:block">
              Agent
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[color:var(--color-charcoal)] transition-colors hover:text-[color:var(--color-red)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/workspace" className="btn btn--ghost btn--sm hidden sm:inline-flex">
            Sign in
          </Link>
          <Link href="/onboarding" className="btn btn--primary btn--sm">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
