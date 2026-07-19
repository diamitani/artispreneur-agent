import { PRICE_BOTTOM, PRICE_TOP } from "@/lib/marketing-data";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

export function PricingGrid({ showAddons = true }: { showAddons?: boolean }) {
  return (
    <div>
      <RevealStagger className="mx-auto grid max-w-[960px] gap-4 md:grid-cols-3">
        {PRICE_TOP.map((plan) => (
          <RevealItem key={plan.name}>
            <article
              className={`relative flex h-full flex-col rounded-[12px] p-7 ${
                plan.featured
                  ? "border-[1.5px] border-[color:var(--color-crimson)] bg-[color:var(--color-bg-dark)] text-white md:-translate-y-2"
                  : "border-[1.5px] border-[color:var(--color-border)] bg-white"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[color:var(--color-crimson)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-white">
                  Most popular
                </span>
              )}
              <p
                className={`text-[13px] font-bold uppercase tracking-[0.06em] ${
                  plan.featured ? "text-white/50" : "text-[color:var(--color-gray-mid)]"
                }`}
              >
                {plan.name}
              </p>
              <p className="mt-2">
                <span
                  className={`font-heading text-4xl ${
                    plan.featured ? "text-white" : "text-[color:var(--color-black)]"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`ml-1 text-[13px] ${
                    plan.featured ? "text-white/40" : "text-[color:var(--color-gray-subtle)]"
                  }`}
                >
                  {plan.per}
                </span>
              </p>
              <p
                className={`mt-3 text-sm ${
                  plan.featured ? "text-white/70" : "text-[color:var(--color-gray-mid)]"
                }`}
              >
                {plan.sub}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.feats.map((f) => (
                  <li
                    key={f}
                    className={`flex gap-2 text-[13px] ${
                      plan.featured ? "text-white/70" : "text-[color:var(--color-gray-dark)]"
                    }`}
                  >
                    <span className="font-bold text-[color:var(--color-crimson)]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={
                  plan.name.includes("Agency")
                    ? `mailto:hello@artispreneur.com?subject=Agency%20plan`
                    : "/api/auth/login?signup=1&return=/onboarding"
                }
                className={`btn btn--md btn--block mt-6 ${
                  plan.featured ? "btn--primary" : "btn--outline"
                }`}
              >
                {plan.cta}
              </a>
            </article>
          </RevealItem>
        ))}
      </RevealStagger>

      {showAddons && (
        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-[900px] type-overline text-[color:var(--color-gray-mid)]">
            Add-on packs
          </p>
          <div className="mx-auto mt-3 grid max-w-[900px] gap-3 sm:grid-cols-3">
            {PRICE_BOTTOM.map((p) => (
              <div
                key={p.name}
                className="rounded-[10px] border border-[color:var(--color-border)] bg-white px-5 py-4"
              >
                <p className="text-sm font-semibold text-[color:var(--color-black)]">{p.name}</p>
                <p className="mt-1 text-xs text-[color:var(--color-gray-mid)]">{p.sub}</p>
                <p className="mt-3 font-heading text-[19px] text-[color:var(--color-crimson)]">
                  {p.price}
                  <span className="ml-1 font-sans text-[11px] font-normal text-[color:var(--color-gray-mid)]">
                    {p.per}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
