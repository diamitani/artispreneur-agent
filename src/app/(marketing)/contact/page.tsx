import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/ContactForm";
import { BRAND, ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Artispreneur about the Unlimited plan for labels and agencies, or get help with your account.",
};

const DIRECT = [
  {
    title: "Labels and agencies",
    body: "Multiple artists under one roof, shared knowledge, per-roster agents. Tell us the size of the roster and we'll show you what it looks like.",
  },
  {
    title: "Already using Artispreneur?",
    body: "Account, billing, and workspace questions go to the same inbox and get answered first.",
  },
];

/**
 * The enterprise CTA on /pricing points here, and it 404'd until now — the
 * highest-intent path on the site dead-ended.
 */
export default function ContactPage() {
  return (
    <div className="bg-white">
      <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-surface)]">
        <div className="container-page py-16 md:py-20">
          <p className="type-mono-label mb-3 text-[color:var(--color-crimson)]">
            Contact
          </p>
          <h1
            className="font-heading max-w-2xl text-[color:var(--color-black)]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", lineHeight: 1.1 }}
          >
            Tell us what you&apos;re trying to run.
          </h1>
          <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-[color:var(--color-gray-mid)]">
            A person reads this inbox. If you&apos;re a label or agency sizing up
            the Unlimited plan, say so and we&apos;ll walk you through it
            properly.
          </p>
        </div>
      </header>

      <div className="container-page py-14 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-xl">
            <ContactForm />
          </div>

          <aside className="space-y-8">
            {DIRECT.map((item) => (
              <div key={item.title}>
                <h2 className="font-heading text-[17px] text-[color:var(--color-black)]">
                  {item.title}
                </h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[color:var(--color-gray-dark)]">
                  {item.body}
                </p>
              </div>
            ))}

            <div className="rounded-xl border border-[color:var(--color-border-dark)] p-5">
              <h2 className="font-heading text-[17px] text-[color:var(--color-black)]">
                Prefer email?
              </h2>
              <a
                href={`mailto:${BRAND.email.hello}`}
                className="mt-2 block text-[14.5px] font-medium text-[color:var(--color-crimson)] underline underline-offset-2"
              >
                {BRAND.email.hello}
              </a>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[color:var(--color-gray-mid)]">
                Not ready to talk? The Free plan deploys a workspace in a couple
                of minutes, no card needed.
              </p>
              <Link href={ROUTES.signup} className="btn btn--outline btn--sm mt-4">
                Start free
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
