import Image from "next/image";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="bg-[color:var(--color-bg-dark)] text-white">
      <div className="container-page py-12">
        <div className="flex flex-wrap justify-between gap-10">
          <div>
            <div className="flex items-center gap-2">
              <Image src={brand.logo.primaryPng} alt="" width={28} height={28} className="h-7 w-7" />
              <span className="font-heading text-[15px] text-white">Artispreneur</span>
              <span className="badge-agent">AGENT</span>
            </div>
            <p className="mt-3 max-w-[240px] font-heading text-sm italic text-white/40">
              {brand.tagline}
            </p>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white/30">
              Product
            </p>
            <ul className="space-y-2 text-[13px] text-white/50">
              <li>
                <a href="#how" className="hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#agents" className="hover:text-white">
                  Agents
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#academy" className="hover:text-white">
                  Academy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white/30">
              Get started
            </p>
            <ul className="space-y-2 text-[13px] text-white/50">
              <li>
                <a href="/api/auth/login?signup=1&return=/onboarding" className="hover:text-white">
                  Sign up
                </a>
              </li>
              <li>
                <a href="/api/auth/login?return=/workspace" className="hover:text-white">
                  Sign in
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.email.hello}`} className="hover:text-white">
                  {brand.email.hello}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-xs text-white/25">
          <p>
            © {new Date().getFullYear()} Artispreneur. {brand.tagline}
          </p>
          <p>{brand.email.hello}</p>
        </div>
      </div>
    </footer>
  );
}
