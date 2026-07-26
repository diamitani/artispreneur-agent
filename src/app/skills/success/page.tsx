import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { getSkillBySlug } from "@/lib/skills/catalog";
import { fulfillStripeSession } from "@/lib/skills/fulfill";

export default async function SkillSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; slug?: string; free?: string }>;
}) {
  const sp = await searchParams;
  let slug = sp.slug;
  let fulfilled = Boolean(sp.free);

  if (sp.session_id) {
    const result = await fulfillStripeSession(sp.session_id);
    if (result.slug) slug = result.slug;
    fulfilled = result.ok;
  }

  const skill = slug ? getSkillBySlug(slug) : null;

  return (
    <>
      <Nav />
      <main className="section bg-[color:var(--color-bg-surface)]">
        <div className="container-page mx-auto max-w-lg text-center">
          <p className="type-overline mb-3">Order complete</p>
          <h1 className="font-heading text-3xl text-[color:var(--color-black)]">
            {skill ? skill.name : "Skill"} is in your library
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-gray-mid)]">
            {fulfilled
              ? "Pack written to your vault and activated in Hermes. Open your library or start chatting in Mission Control."
              : "If the skill does not appear yet, refresh your library in a moment."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/skills/library" className="btn btn--primary btn--md">
              Open library
            </Link>
            <Link href="/workspace" className="btn btn--outline btn--md">
              Go to workspace
            </Link>
            <Link href="/skills" className="btn btn--ghost btn--md">
              Browse more
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
