import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  /** Human-readable last-updated date, e.g. "August 2, 2026". */
  updated: string;
  /** Optional lead paragraph rendered above the sections. */
  intro?: ReactNode;
  children: ReactNode;
};

/**
 * Shared shell for /terms and /privacy.
 *
 * Legal copy is long-form prose, so the styling here is deliberately plain:
 * one column, generous line-height, links in crimson. The document should be
 * easy to read and easy to print, not art-directed.
 */
export function LegalPage({ title, updated, intro, children }: LegalPageProps) {
  return (
    <article className="bg-white">
      <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]">
        <div className="container-page py-16 md:py-20">
          <p className="type-mono-label mb-3 text-[color:var(--color-crimson)]">
            Legal
          </p>
          <h1
            className="font-heading text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", lineHeight: 1.1 }}
          >
            {title}
          </h1>
          <p className="mt-4 text-sm text-[color:var(--color-gray-mid)]">
            Last updated {updated}
          </p>
        </div>
      </header>

      <div className="container-page py-14 md:py-20">
        <div className="max-w-2xl">
          {intro && (
            <div className="mb-12 text-[16.5px] leading-[1.75] text-[color:var(--color-gray-dark)]">
              {intro}
            </div>
          )}
          <div className="space-y-11">{children}</div>
        </div>
      </div>
    </article>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

/**
 * One numbered clause. Paragraphs, lists, and links inside are styled here so
 * the page bodies stay pure content — no utility classes in the legal copy.
 */
export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section
      className="
        text-[15.5px] leading-[1.75] text-[color:var(--color-gray-dark)]
        [&_p]:mt-3
        [&_p:first-of-type]:mt-0
        [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5
        [&_a]:font-medium [&_a]:text-[color:var(--color-crimson)] [&_a]:underline
        [&_a]:underline-offset-2 [&_a:hover]:opacity-80
        [&_strong]:font-semibold [&_strong]:text-[color:var(--color-black)]
      "
    >
      <h2 className="font-heading mb-2 text-[19px] text-[color:var(--color-black)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
