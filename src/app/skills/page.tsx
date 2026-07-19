import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { SkillCard } from "@/components/skills/SkillCard";
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
    <>
      <Nav />
      <main>
        {/* Marketplace hero */}
        <section className="border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-dark)] text-white">
          <div className="container-page py-16 md:py-20">
            <p className="type-mono-label mb-4 text-[color:var(--color-gold)]">
              Skills Marketplace
            </p>
            <h1
              className="font-heading max-w-2xl text-white"
              style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
            >
              Digital skills for your Agent workspace.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55">
              Install playbooks, prompt packs, and workflows as digital downloads. Free during
              launch — Stripe checkout ready when you go paid.
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
        </section>

        <section className="section bg-[color:var(--color-bg-surface)]">
          <div className="container-page">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl text-[color:var(--color-black)]">
                  Browse skills
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-gray-mid)]">
                  {skills.length} digital products · Instant install to your workspace
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

        <section className="border-t border-[color:var(--color-border)] bg-white py-12">
          <div className="container-page grid gap-8 md:grid-cols-3">
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
                <h3 className="font-heading text-[17px] text-[color:var(--color-black)]">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
