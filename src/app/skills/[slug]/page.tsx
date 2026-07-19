import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { CheckoutButton } from "@/components/skills/CheckoutButton";
import { SkillViewTracker } from "@/components/skills/SkillViewTracker";
import {
  formatPrice,
  getSkillBySlug,
  isSkillFree,
  SKILLS_CATALOG,
} from "@/lib/skills/catalog";
import { SkillCard } from "@/components/skills/SkillCard";

export function generateStaticParams() {
  return SKILLS_CATALOG.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return { title: "Skill not found" };
  return {
    title: `${skill.name} — Skills Marketplace`,
    description: skill.tagline,
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const free = isSkillFree(skill);
  const related = SKILLS_CATALOG.filter(
    (s) => s.category === skill.category && s.id !== skill.id,
  ).slice(0, 3);

  return (
    <>
      <Nav />
      <SkillViewTracker slug={skill.slug} />
      <main>
        <section className="border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]">
          <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
            <div>
              <p className="text-sm text-[color:var(--color-gray-mid)]">
                <Link href="/skills" className="hover:text-[color:var(--color-crimson)]">
                  Skills
                </Link>
                <span className="mx-2">/</span>
                <span>{skill.name}</span>
              </p>
              <p className="type-overline mt-6 mb-3">{skill.category}</p>
              <h1
                className="font-heading text-[color:var(--color-black)]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
              >
                {skill.name}
              </h1>
              <p className="mt-3 text-lg text-[color:var(--color-gray-dark)]">{skill.tagline}</p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
                {skill.description}
              </p>

              <ul className="mt-8 space-y-2.5">
                {skill.includes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-[color:var(--color-gray-dark)]"
                  >
                    <span className="font-bold text-[color:var(--color-crimson)]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase card — ecommerce digital download */}
            <aside className="h-fit rounded-[10px] border border-[color:var(--color-border)] bg-white p-7 shadow-[var(--shadow-md)]">
              <div className="rounded-[8px] bg-[color:var(--color-bg-dark)] px-5 py-6 text-white">
                <p className="font-mono text-[10px] tracking-wider text-[color:var(--color-gold)]">
                  DIGITAL DOWNLOAD
                </p>
                <p className="font-heading mt-2 text-2xl">{skill.name}</p>
                <p className="mt-1 font-mono text-[11px] text-white/40">
                  v{skill.version} · {skill.fileSize} · {skill.format}
                </p>
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <div>
                  <p className="font-heading text-4xl text-[color:var(--color-black)]">
                    {free ? "Free" : formatPrice(skill.priceCents)}
                  </p>
                  <p className="text-[12px] text-[color:var(--color-gray-mid)]">
                    {free ? "Launch pricing — no card required" : "One-time purchase · Stripe"}
                  </p>
                </div>
                {skill.badge && (
                  <span className="rounded bg-[color:var(--color-crimson)] px-2 py-1 text-[10px] font-bold uppercase text-white">
                    {skill.badge}
                  </span>
                )}
              </div>

              <div className="mt-6">
                <CheckoutButton slug={skill.slug} free={free} className="btn btn--primary btn--lg btn--block" />
              </div>

              <dl className="mt-6 space-y-2 border-t border-[color:var(--color-border)] pt-5 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-gray-mid)]">Works with</dt>
                  <dd className="font-semibold text-[color:var(--color-black)]">{skill.agent}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-gray-mid)]">Delivery</dt>
                  <dd className="font-semibold text-[color:var(--color-black)]">Instant install</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--color-gray-mid)]">License</dt>
                  <dd className="font-semibold text-[color:var(--color-black)]">Per workspace</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {related.length > 0 && (
          <section className="section bg-white">
            <div className="container-page">
              <h2 className="font-heading mb-8 text-2xl">Related skills</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((s) => (
                  <SkillCard key={s.id} skill={s} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
