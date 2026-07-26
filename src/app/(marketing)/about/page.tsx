import { Shield, Fingerprint, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Artispreneur exists because the business side of music should not require a business degree. Art Means Business.",
};

const VALUES = [
  {
    icon: Shield,
    title: "Approval-First",
    description:
      "Nothing leaves your workspace without your say-so. Every email, pitch, and post passes through your approval queue. AI drafts; you decide.",
  },
  {
    icon: Fingerprint,
    title: "Artist Sovereignty",
    description:
      "Your data, your brand, your relationships. We never train on your content, we never contact your network, and you can export everything anytime.",
  },
  {
    icon: Target,
    title: "Concrete Over Vague",
    description:
      "No generic advice. Every output is a real deliverable grounded in your context: actual emails, actual timelines, actual budgets.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero / Mission */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
              Art Means Business
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-gray-600">
              Independent artists are the most creative people on the planet.
              They should not have to become full-time administrators to sustain
              a career. Artispreneur exists to close that gap — giving every
              artist a tireless AI business team that handles the work they never
              signed up for.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-[var(--font-display)] text-3xl font-bold">
              The Problem We Solve
            </h2>
            <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
              <p>
                The music industry was built for labels, publishers, and managers
                who run teams of dozens. Independent artists get access to the
                same distribution channels but none of the infrastructure: no PR
                department, no legal team, no marketing ops.
              </p>
              <p>
                The result? Artists spend more time on admin than on art. They
                miss sync opportunities because they never pitched. They leave
                money on the table because royalty statements go unread. They
                burn out trying to be creative director, accountant, and publicist
                all at once.
              </p>
              <p>
                Artispreneur replaces that invisible workforce with AI agents
                that draft real deliverables — press kits, release plans, pitch
                emails, budgets — and put you in the approval seat. You stay in
                control. The work gets done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Story */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-[var(--font-display)] text-3xl font-bold">
              Our Story
            </h2>
            <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
              <p>
                Artispreneur started as a question: what if the AI that writes
                code could also write press kits? What if the agent that manages
                DevOps pipelines could manage a 42-day release calendar?
              </p>
              <p>
                We are a team of musicians, engineers, and operators who spent
                years on both sides of the industry. We saw firsthand how much
                potential goes unrealized simply because artists lack the time
                and resources for business operations.
              </p>
              <p>
                Today, we are building the platform we wished we had: an AI
                business team that understands your context, respects your
                autonomy, and produces work you are proud to send.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[var(--font-display)] text-3xl font-bold">
              Our Values
            </h2>
            <p className="mt-4 text-gray-600">
              These principles guide every product decision we make.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10 text-crimson">
                  <value.icon size={24} />
                </div>
                <h3 className="mt-6 font-[var(--font-display)] text-xl font-bold">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
