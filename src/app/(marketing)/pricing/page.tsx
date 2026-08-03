import { MarketingShell } from "@/components/marketing/MarketingShell";
import { RssTicker } from "@/components/marketing/rss-ticker";
import Link from "next/link";
import { Check, ArrowRight, Users, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Artispreneur",
  description: "Start free, upgrade when your business demands it. $99/month for the full AI music business team.",
};

const FREE_FEATURES = [
  "Career dashboard — see your entire music business at a glance",
  "1 Academy course with AI tutor",
  "3 free agent actions per month (EIN registration, contract generation, or PRO registration)",
  "Industry directory browse — 78K+ contacts",
  "Weekly Music Business Brief newsletter",
  "Public artist profile page",
  "Community support",
];

const ALL_ACCESS_FEATURES = [
  "Everything in Free",
  "Unlimited agent workspace — use your AI agent as much as you want",
  "All 10+ specialist skills (Publishing, Legal, Finance, PR, Booking, Brand)",
  "Unlimited projects, outputs, and file storage",
  "Composio integrations: Gmail, Calendar, Drive, Spotify, HubSpot",
  "Skills marketplace — install new capabilities anytime",
  "Custom contract generation from 21+ templates",
  "EPK builder — electronic press kits in minutes",
  "Music catalog manager with split sheets",
  "Priority AI model access",
  "Priority support",
];

const FAQ = [
  {
    q: "What's the founding member offer?",
    a: "The first 100 artists to upgrade to All-Access get a full year free. Members 101-1,000 get 50% off. Your rate is locked in for life — no price increases.",
  },
  {
    q: "What exactly is an 'agent action'?",
    a: "An agent action is a completed task — like generating a contract, registering an EIN, building an EPK, or researching venues. You get 3 free actions per month. After that, you'll need All-Access for unlimited use.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no commitments. Cancel anytime and you keep access through the end of your billing period. No questions asked.",
  },
  {
    q: "Can I buy just one service instead of subscribing?",
    a: "Yes. One-time agent actions (like a single EIN registration or EPK build) are available starting at $49 in the skills marketplace. No subscription needed for individual purchases.",
  },
  {
    q: "Do agents send things without my approval?",
    a: "Never. Every outgoing action — emails, social posts, contract submissions — passes through your approval queue. You review everything before it goes live.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your files, outputs, and account remain accessible. You can export everything anytime. If you cancel All-Access, you drop to the Free plan and keep all your data.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <RssTicker />

      {/* Hero */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            One plan. Everything included.
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            Start building your music business for free. Upgrade to All-Access when you're ready to let your AI agent handle everything.
          </p>

          {/* Founding offer badge */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2 text-sm font-bold text-black">
            <Users className="h-4 w-4" />
            <span>First 100 members get All-Access free for 1 year</span>
            <span className="ml-1 rounded-full bg-black px-2 py-0.5 text-[10px] text-gold">47 spots left</span>
          </div>
        </div>
      </section>

      {/* Two cards */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Free tier */}
            <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="font-display text-2xl font-bold text-black">Starter</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-black">$0</span>
                <span className="text-sm text-gray-400">/forever</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                Everything you need to start your music business — including 3 free agent actions every month.
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-lg border-2 border-crimson px-4 py-3 text-center text-sm font-bold text-crimson hover:bg-crimson hover:text-white transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* All-Access tier */}
            <div className="flex flex-col rounded-xl border-2 border-crimson bg-white p-8 shadow-lg ring-1 ring-crimson/10 relative">
              <span className="absolute -top-3 left-6 rounded-full bg-crimson px-3 py-1 text-xs font-bold text-white">
                Most Popular
              </span>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-black">All-Access</h2>
                <span className="rounded bg-gold/20 px-2 py-0.5 text-[11px] font-bold text-black">BEST VALUE</span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-black">$99</span>
                <span className="text-sm text-gray-400">/month</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">Save 20% with annual billing — $79/mo</p>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                The full AI music business team. Every agent, every skill, every integration — unlimited.
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {ALL_ACCESS_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup?plan=all-access"
                className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-crimson px-4 py-3 text-center text-sm font-bold text-white hover:bg-crimson-dark transition-colors"
              >
                <Zap className="h-4 w-4" />
                Get All-Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-display text-3xl font-bold text-black">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 space-y-8">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-semibold text-black">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white">
            Your AI music business team is ready.
          </h2>
          <p className="mt-4 text-gray-400">
            Start free. No credit card. First 100 members get All-Access free for a year.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-3.5 text-sm font-bold text-black transition-colors hover:bg-gold-light"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}