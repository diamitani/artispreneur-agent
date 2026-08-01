import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

/**
 * Split layout for every auth screen: the form on the left, brand proof on
 * the right. Replaces the Cognito Hosted UI, which cannot be styled past a
 * logo swap.
 */
export function AuthShell({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1fr_1.05fr]">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-[400px]">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src={brand.logo.primaryPng}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="font-heading text-[16px] text-[color:var(--color-black)]">
              Artispreneur
            </span>
          </Link>

          <p className="type-mono-label mt-12 text-[color:var(--color-crimson)]">
            {eyebrow}
          </p>
          <h1
            className="font-heading mt-3 text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(1.7rem, 4vw, 2.15rem)", lineHeight: 1.14 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--color-gray-mid)]">
              {subtitle}
            </p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Brand side */}
      <aside className="relative hidden overflow-hidden bg-[#0b0b0b] lg:block">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[460px] rounded-full bg-[rgba(204,0,0,0.24)] blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-[10%] h-[380px] w-[380px] rounded-full bg-[rgba(254,208,1,0.10)] blur-[120px]"
        />

        <div className="relative flex h-full flex-col justify-center px-14 xl:px-20">
          <p className="type-mono-label text-[color:var(--color-gold)]">
            Art means business
          </p>
          <p
            className="font-heading mt-5 max-w-md text-white"
            style={{ fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)", lineHeight: 1.16 }}
          >
            Your record label, run by agents.
          </p>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/55">
            Formation and PROs, EPKs and press, booking and releases. The agents
            draft the work. You approve what ships.
          </p>

          <ul className="mt-10 space-y-3.5">
            {[
              "A real workspace deployed on signup",
              "Seven agents, one conversation",
              "Nothing sends without your approval",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[14px] text-white/70">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

/** Shared field styling so every auth input matches. */
export const fieldClass =
  "w-full rounded-lg border border-[color:var(--color-border-dark)] bg-white px-3.5 py-2.5 text-[14.5px] text-[color:var(--color-black)] outline-none transition-colors placeholder:text-[color:var(--color-gray-subtle)] focus:border-[color:var(--color-crimson)] focus:ring-2 focus:ring-[color:var(--color-crimson)]/15 disabled:opacity-60";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[color:var(--color-black)]">
          {label}
        </span>
        {hint}
      </span>
      {children}
    </label>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-red-700"
    >
      {children}
    </p>
  );
}
