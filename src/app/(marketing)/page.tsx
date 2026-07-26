import Link from "next/link";
import {
  Sparkles,
  Users,
  ShieldCheck,
  Music,
  Mic2,
  Radio,
  CalendarCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ROUTES, PRICING, SPECIALISTS } from "@/lib/constants";

const MVP_AGENTS = SPECIALISTS.filter((s) => s.mvp);

const STEPS = [
  {
    icon: Sparkles,
    title: "Onboard",
    description:
      "Tell us about your music, goals, and brand. We build your knowledge vault in minutes.",
  },
  {
    icon: Users,
    title: "Agents Work",
    description:
      "Your AI team drafts EPKs, pitches, release plans, and more — all grounded in your context.",
  },
  {
    icon: ShieldCheck,
    title: "You Approve",
    description:
      "Nothing ships without you. Review, edit, approve. You stay in control of every output.",
  },
];

const AGENT_ICONS: Record<string, typeof Music> = {
  master: Sparkles,
  "epk-brand": Mic2,
  press: Radio,
  release: CalendarCheck,
};

const TIERS = Object.values(PRICING);

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your AI Music{" "}
              <span className="text-crimson">Business Team</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Agents that draft EPKs, pitches, release plans, and more — you
              review and approve. The business side of music, handled.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={ROUTES.signup}
                className="inline-flex items-center gap-2 rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-dark"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link
                href={ROUTES.agents}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                See the Agents
              </Link>
            </div>
          </div>
        </div>
        {/* Subtle gradient accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-50/60 to-transparent" />
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[var(--font-display)] text-3xl font-bold sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-gray-600">
              Three steps from sign-up to your first polished output.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
                  <step.icon size={24} />
                </div>
                <span className="mt-4 block text-sm font-semibold text-crimson">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 font-[var(--font-display)] text-xl font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Preview */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[var(--font-display)] text-3xl font-bold sm:text-4xl">
              Meet Your Agents
            </h2>
            <p className="mt-4 text-gray-600">
              A specialized team that covers every facet of your music business.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MVP_AGENTS.map((agent) => {
              const Icon = AGENT_ICONS[agent.id] || Music;
              return (
                <div
                  key={agent.id}
                  className="rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold">{agent.name}</h3>
                  <p className="mt-1 text-xs font-medium text-crimson">
                    {agent.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {agent.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              href={ROUTES.agents}
              className="inline-flex items-center gap-2 text-sm font-semibold text-crimson hover:text-crimson-dark"
            >
              View all 8 agents
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[var(--font-display)] text-3xl font-bold sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-gray-600">
              Start free, upgrade when you are ready. No hidden fees.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border bg-white p-8 ${
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
                <h3 className="font-[var(--font-display)] text-xl font-bold">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  {tier.price !== null ? (
                    <>
                      <span className="text-4xl font-bold">${tier.price}</span>
                      <span className="text-sm text-gray-500">
                        /{tier.period}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">Custom</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-600">{tier.description}</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.slice(0, 4).map((f) => (
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
                  href={tier.featured ? ROUTES.signup : ROUTES.pricing}
                  className={`mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
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
          <div className="mt-12 text-center">
            <Link
              href={ROUTES.pricing}
              className="inline-flex items-center gap-2 text-sm font-semibold text-crimson hover:text-crimson-dark"
            >
              Compare all features
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[var(--font-display)] text-3xl font-bold sm:text-4xl">
              Start Free Today
            </h2>
            <p className="mt-4 text-gray-600">
              No credit card needed. Set up your workspace in 2 minutes and let
              your AI team start working.
            </p>
            <Link
              href={ROUTES.signup}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-crimson px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-dark"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
