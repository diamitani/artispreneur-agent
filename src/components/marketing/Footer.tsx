import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

const PRODUCT = [
  { href: "/features", label: "Features" },
  { href: "/skills", label: "Skills Marketplace" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "https://academy.artispreneur.com", label: "Academy", external: true },
  { href: `mailto:${brand.email.hello}`, label: "Contact" },
];

const ACCOUNT = [
  { href: "/api/auth/login?signup=1&return=/onboarding", label: "Sign up" },
  { href: "/api/auth/login?return=/workspace", label: "Sign in" },
  { href: "/skills/library", label: "Skills Library" },
];

export function Footer() {
  return (
    <footer className="bg-[color:var(--color-bg-dark)] text-white">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src={brand.logo.primaryPng} alt="" width={28} height={28} className="h-7 w-7" />
              <span className="font-heading text-[15px] text-white">Artispreneur</span>
              <span className="badge-agent">AGENT</span>
            </div>
            <p className="mt-3 max-w-[260px] font-heading text-sm italic text-white/40">
              {brand.tagline}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/30">
              For artists, managers, agencies &amp; labels.
            </p>
          </div>

          <FooterCol title="Product" links={PRODUCT} />
          <FooterCol title="Company" links={COMPANY} />
          <FooterCol title="Account" links={ACCOUNT} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-xs text-white/25">
          <p>
            © {new Date().getFullYear()} Artispreneur · Diamitani Industries. {brand.tagline}
          </p>
          <p>{brand.email.hello}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white/30">
        {title}
      </p>
      <ul className="space-y-2 text-[13px] text-white/50">
        {links.map((l) => (
          <li key={l.href}>
            {l.external || l.href.startsWith("mailto:") || l.href.startsWith("/api/") ? (
              <a href={l.href} className="hover:text-white" {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
