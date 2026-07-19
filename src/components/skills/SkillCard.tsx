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
      className="group flex flex-col overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-white transition-[box-shadow,border-color] duration-200 hover:border-[color:var(--color-crimson)] hover:shadow-[var(--shadow-lg)]"
    >
      {/* Digital product cover */}
      <div className="relative aspect-[16/10] bg-[color:var(--color-bg-dark)] px-5 py-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[rgba(204,0,0,0.2)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-4 h-20 w-20 rounded-full bg-[rgba(254,208,1,0.12)]"
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
            <p className="font-heading text-xl text-white">{skill.name}</p>
            <p className="mt-1 font-mono text-[10px] text-white/40">
              v{skill.version} · {skill.format} · {skill.fileSize}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-relaxed text-[color:var(--color-gray-mid)]">{skill.tagline}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-heading text-2xl text-[color:var(--color-black)]">
              {free ? "Free" : formatPrice(skill.priceCents)}
            </p>
            <p className="text-[11px] text-[color:var(--color-gray-subtle)]">Digital download</p>
          </div>
          <span className="btn btn--primary btn--sm pointer-events-none group-hover:bg-[color:var(--color-crimson-dark)]">
            {free ? "Get free" : "Buy"}
          </span>
        </div>
      </div>
    </Link>
  );
}
