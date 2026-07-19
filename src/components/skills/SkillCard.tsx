import Link from "next/link";
import type { SkillProduct } from "@/lib/skills/catalog";
import { formatPrice, isSkillFree } from "@/lib/skills/catalog";

const CATEGORY_LABEL: Record<string, string> = {
  epk: "EPK",
  legal: "Legal",
  release: "Release",
  outreach: "Outreach",
  finance: "Finance",
  brand: "Brand",
  academy: "Academy",
};

export function SkillCard({ skill }: { skill: SkillProduct }) {
  const free = isSkillFree(skill);

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group flex flex-col overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[color:var(--color-crimson)]/40 hover:shadow-[var(--shadow-lg)]"
    >
      <div className="skill-cover relative aspect-[16/10] overflow-hidden bg-[color:var(--color-bg-dark)] px-5 py-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 80% 0%, rgba(204,0,0,0.45), transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(254,208,1,0.18), transparent 45%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[color:var(--color-gold)]">
              {CATEGORY_LABEL[skill.category] || skill.category}
            </span>
            {skill.badge && (
              <span className="rounded bg-[color:var(--color-crimson)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {skill.badge}
              </span>
            )}
          </div>
          <div>
            <p className="font-heading text-xl leading-tight text-white">{skill.name}</p>
            <p className="mt-1.5 font-mono text-[10px] text-white/40">
              v{skill.version} · {skill.fileSize}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-relaxed text-[color:var(--color-gray-mid)]">{skill.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="font-heading text-2xl text-[color:var(--color-black)]">
              {free ? "Free" : formatPrice(skill.priceCents)}
            </p>
            <p className="text-[11px] text-[color:var(--color-gray-subtle)]">Digital download</p>
          </div>
          <span className="btn btn--primary btn--sm pointer-events-none">
            {free ? "Get free" : "Buy"}
          </span>
        </div>
      </div>
    </Link>
  );
}
