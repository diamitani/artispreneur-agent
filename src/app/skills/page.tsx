import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { SkillCard } from "@/components/skills/SkillCard";
import { brand } from "@/lib/brand";
import { SKILLS_CATALOG, SKILL_CATEGORIES } from "@/lib/skills/catalog";

export const metadata = {
  title: "Skills Marketplace — Artispreneur Agent",
  description:
    "Browse and add digital skill packs for your Artispreneur Agent workspace. Free during launch.",
};

export default async function SkillsMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category || "all";
  const skills =
    category === "all"
      ? SKILLS_CATALOG
      : SKILLS_CATALOG.filter((s) => s.category === category);

  return (
    <div className="grain">
      <Nav />
      <main>
        <section className="relative overflow-hidden border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-dark)] text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-[rgba(204,0,0,0.18)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 left-1/4 h-[280px] w-[280px] rounded-full bg-[rgba(254,208,1,0.08)]"
          />
          <div className="container-page relative grid items-end gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Image src={brand.logo.primaryPng} alt="" width={40} height={40} className="h-10 w-10" />
                <div>
                  <p className="font-heading text-xl text-white">Artispreneur</p>
                  <p className="type-mono-label text-[color:var(--color-gold)]">Skills Marketplace</p>
                </div>
              </div>
              <h1
                className="font-heading max-w-xl text-white"
                style={{ fontSize: "clamp(2.1rem, 5vw, 3.25rem)", lineHeight: 1.08 }}
              >
                Digital skills for your Agent workspace.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
                Playbooks for EPKs, deals, releases, and outreach — free during launch. Add them
                to your workspace and put them to work the same day.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/skills/library" className="btn btn--gold btn--md">
                  My library
                </Link>
                <Link href="/workspace" className="btn btn--outline-on-dark btn--md">
                  Open workspace
                </Link>
              </div>
            </div>
            <div className="hidden rounded-[12px] border border-white/10 bg-white/[0.04] p-6 md:block">
              <p className="font-mono text-[10px] tracking-wider text-[color:var(--color-gold)]">
                SHELF · {SKILLS_CATALOG.length} PACKS
              </p>
              <p className="font-heading mt-3 text-2xl text-white">Ready to work</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Each pack lands in your workspace so your Agent can use it when you ask.
              </p>
            </div>
          </div>
        </section>

        <section className="section bg-[color:var(--color-bg-surface)]">
          <div className="container-page">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl text-[color:var(--color-black)] md:text-3xl">
                  Browse the shelf
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-gray-mid)]">
                  {skills.length} digital products · Instant workspace install
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILL_CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    href={c.id === "all" ? "/skills" : `/skills?category=${c.id}`}
                    className={`rounded-[6px] px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                      category === c.id
                        ? "bg-[color:var(--color-crimson)] text-white"
                        : "bg-white text-[color:var(--color-gray-dark)] hover:text-[color:var(--color-crimson)]"
                    }`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--color-border)] bg-white py-14">
          <div className="container-page grid gap-10 md:grid-cols-3">
            {[
              {
                t: "Digital download",
                d: "Each skill installs as a SKILL.md pack under your Agent workspace vault.",
              },
              {
                t: "Stripe ready",
                d: "Free now. Flip prices on and Checkout handles paid unlocks automatically.",
              },
              {
                t: "HubSpot tracked",
                d: "Views, adds, and purchases sync to HubSpot for CRM follow-up.",
              },
            ].map((x) => (
              <div key={x.t}>
                <h3 className="font-heading text-lg text-[color:var(--color-black)]">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
