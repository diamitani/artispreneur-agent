import Link from "next/link";
import { ArtispreneurMark } from "@/components/brand/ArtispreneurMark";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-charcoal)] text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <ArtispreneurMark size={44} variant="reversed" />
            <div>
              <p className="font-heading text-xl text-[color:var(--color-gold)]">ARTISPRENEUR</p>
              <p className="text-xs text-white/55">{brand.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            {brand.product} — your AI business team for contracts, EPK, directory outreach, Academy,
            and catalog ops. Approval-first. Built on ROSTR.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-gold)]">
            Product
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <a href="#how" className="hover:text-white">
                How it works
              </a>
            </li>
            <li>
              <a href="#team" className="hover:text-white">
                Agents
              </a>
            </li>
            <li>
              <a href="#products" className="hover:text-white">
                Toolkit
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-gold)]">
            Start
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/onboarding" className="hover:text-white">
                PAL onboarding
              </Link>
            </li>
            <li>
              <Link href="/workspace" className="hover:text-white">
                Mission Control
              </Link>
            </li>
            <li>
              <a href={`mailto:${brand.email.hello}`} className="hover:text-white">
                {brand.email.hello}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/45">
          <p>© {new Date().getFullYear()} Artispreneur. All rights reserved.</p>
          <p className="font-heading text-[color:var(--color-gold)]/80">{brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
