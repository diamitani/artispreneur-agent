import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  dark?: boolean;
  children?: React.ReactNode;
};

/** Interior page hero — brand-first, one job, TasteSkill restraint */
export function PageHero({ eyebrow, title, body, dark, children }: Props) {
  return (
    <section
      className={`relative overflow-hidden ${
        dark
          ? "bg-[color:var(--color-bg-dark)] text-white"
          : "bg-[color:var(--color-bg-surface)] text-[color:var(--color-black)]"
      }`}
    >
      {dark && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[rgba(204,0,0,0.18)] blur-3xl"
        />
      )}
      <div className="container-page relative py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <p
            className={`type-mono-label mb-3 ${
              dark ? "text-[color:var(--color-gold)]" : "text-[color:var(--color-crimson)]"
            }`}
          >
            {eyebrow}
          </p>
          <h1
            className="font-heading"
            style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.08 }}
          >
            {title}
          </h1>
          <p
            className={`mt-4 max-w-xl text-base leading-relaxed md:text-lg ${
              dark ? "text-white/60" : "text-[color:var(--color-gray-mid)]"
            }`}
          >
            {body}
          </p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
