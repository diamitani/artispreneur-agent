import Link from "next/link";
import {
  Sparkles,
  Mic2,
  Radio,
  CalendarCheck,
  Video,
  MapPin,
  DollarSign,
  FileText,
  ArrowRight,
} from "lucide-react";
import { ROUTES, SPECIALISTS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents",
  description:
    "Meet your AI business team: 8 specialist agents covering strategy, branding, PR, releases, content, booking, finance, and contracts.",
};

const AGENT_ICONS: Record<string, typeof Sparkles> = {
  master: Sparkles,
  "brand-epk": Mic2,
  press: Radio,
  release: CalendarCheck,
  content: Video,
  booking: MapPin,
  finance: DollarSign,
  contracts: FileText,
};

export default function AgentsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
              Meet Your Business Team
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Eight specialist agents, one command center. Each agent is trained
              on music industry workflows and grounded in your personal knowledge
              vault.
            </p>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SPECIALISTS.map((agent) => {
              const Icon = AGENT_ICONS[agent.id] || Sparkles;
              return (
                <div
                  key={agent.id}
                  className="relative flex flex-col rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  {agent.mvp && (
                    <span className="absolute right-4 top-4 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold-dark">
                      MVP
                    </span>
                  )}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 font-[var(--font-display)] text-lg font-bold">
                    {agent.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-crimson">
                    {agent.role}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {agent.description}
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-gray-100 pt-4">
                    {agent.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-center gap-2 text-xs text-gray-500"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-crimson" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How they work together */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[var(--font-display)] text-3xl font-bold">
              How They Work Together
            </h2>
            <p className="mt-4 text-gray-600">
              You talk to one agent — the Artispreneur Master. It understands
              your goal, loads your context from the knowledge vault, and routes
              tasks to the right specialist. You review everything in your
              approval queue before anything ships.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-gray-200 bg-gray-50 p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-crimson/10 p-3 text-crimson">
                <Sparkles size={28} />
              </div>
              <p className="text-sm font-semibold">Artispreneur Master Agent</p>
              <div className="h-8 w-px bg-gray-300" />
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
                {SPECIALISTS.filter((s) => s.id !== "master").map((s) => {
                  const SIcon = AGENT_ICONS[s.id] || Sparkles;
                  return (
                    <div
                      key={s.id}
                      className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <SIcon size={16} className="text-crimson" />
                      <span className="text-xs font-medium text-gray-700">
                        {s.name}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="rounded-lg border border-crimson/30 bg-crimson/5 px-4 py-2">
                <p className="text-xs font-semibold text-crimson">
                  Your Approval Queue
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold">
            Put Your Team to Work
          </h2>
          <p className="mt-4 text-gray-600">
            Sign up free and start working with your AI business team today.
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
