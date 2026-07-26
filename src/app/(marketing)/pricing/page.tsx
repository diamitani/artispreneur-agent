import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { ROUTES, PRICING } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Artispreneur. Start free with Academy access, upgrade to the full AI business team.",
};

const TIERS = Object.values(PRICING);

const FAQ = [
  {
    q: "Can I really use it for free?",
    a: "Yes. The Starter plan gives you access to the Academy, Tutor Agent, and one project workspace at no cost, forever. No credit card required.",
  },
  {
    q: "What happens when I hit my project limit?",
    a: "You can archive a project to free up your slot, or upgrade to Workspace for unlimited projects.",
  },
  {
    q: "Is there a contract or commitment?",
    a: "No. Workspace is billed monthly and you can cancel anytime. You keep access through the end of your billing period.",
  },
  {
    q: "What is the Agency plan for?",
    a: "The Agency & Label plan is built for managers, labels, and collectives managing multiple artists. You get shared playbooks, team roles, and a Director agent that oversees all rosters.",
  },
  {
    q: "Do agents send things without my approval?",
    a: "Never. Every outgoing action (email, pitch, post) passes through your approval queue. You review and approve before anything goes live.",
  },
];

const COMPARISON_FEATURES = [
  { feature: "Master Agent", starter: true, workspace: true, agency: true },
  { feature: "Academy & Tutor", starter: true, workspace: true, agency: true },
  { feature: "Active projects", starter: "1", workspace: "Unlimited", agency: "Unlimited" },
  { feature: "Specialist agents (8)", starter: false, workspace: true, agency: true },
  { feature: "Knowledge vault + RAG", starter: "Basic", workspace: "Full", agency: "Full" },
  { feature: "Skills marketplace", starter: false, workspace: true, agency: true },
  { feature: "Approval queue & audit log", starter: false, workspace: true, agency: true },
  { feature: "Composio integrations", starter: false, workspace: true, agency: true },
  { feature: "API access", starter: false, workspace: true, agency: true },
  { feature: "Multi-artist workspaces", starter: false, workspace: false, agency: true },
  { feature: "Director Agent", starter: false, workspace: false, agency: true },
  { feature: "Team roles & permissions", starter: false, workspace: false, agency: true },
  { feature: "SSO & audit export", starter: false, workspace: false, agency: true },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-gray-700">{value}</span>;
  }
  return value ? (
    <CheckCircle2 size={18} className="text-crimson" />
  ) : (
    <span className="text-gray-300">&mdash;</span>
  );
}

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Start free, upgrade when your business demands it. Every plan
              includes the approval-first workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-xl border bg-white p-8 ${
                  tier.featured
                    ? "border-crimson shadow-lg ring-1 ring-crimson/20"
                    : "border-gray-200"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-crimson px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h2 className="font-[var(--font-display)] text-2xl font-bold">
                  {tier.name}
                </h2>
                <div className="mt-4 flex items-baseline gap-1">
                  {tier.price !== null ? (
                    <>
                      <span className="text-5xl font-bold">${tier.price}</span>
                      <span className="text-sm text-gray-500">
                        /{tier.period}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">Custom</span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {tier.description}
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-crimson"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.featured ? ROUTES.signup : tier.price === null ? "/contact" : ROUTES.signup}
                  className={`mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
                    tier.featured
                      ? "bg-crimson text-white hover:bg-crimson-dark"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-[var(--font-display)] text-3xl font-bold">
            Compare Plans
          </h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 pr-4 text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    Starter
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-crimson">
                    Workspace
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    Agency
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-gray-100"
                  >
                    <td className="py-3 pr-4 text-sm text-gray-700">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <CellValue value={row.starter} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <CellValue value={row.workspace} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <CellValue value={row.agency} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-[var(--font-display)] text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 space-y-8">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-semibold text-gray-900">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold">
            Ready to get started?
          </h2>
          <p className="mt-4 text-gray-600">
            Sign up in under a minute. No credit card required.
          </p>
          <Link
            href={ROUTES.signup}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-crimson px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-dark"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
