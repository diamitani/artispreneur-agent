import { PageHeader } from "@/components/dashboard/PageHeader";
import { BillingPanel } from "@/components/billing/BillingPanel";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export const metadata = { title: "Settings" };

/**
 * Account settings. Previously this route redirected straight to /profile and
 * had no billing surface at all, so a subscriber had no way to see their plan
 * or cancel — which the pricing page promises.
 */
export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        subtitle="Your plan, billing, and artist profile."
      />

      <BillingPanel />

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-bold text-gray-900">Artist profile</h2>
        <p className="mt-1 text-[13.5px] text-gray-600">
          Your stage name, genre, and the details your agents work from.
        </p>
        <Link href={ROUTES.profile} className="btn btn--outline btn--sm mt-4">
          Open profile
        </Link>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-bold text-gray-900">Your agent&apos;s context</h2>
        <p className="mt-1 text-[13.5px] text-gray-600">
          Re-run the intake to rebuild your Master Soul.md — the file every agent
          reads before it drafts anything.
        </p>
        <Link href={ROUTES.onboarding} className="btn btn--outline btn--sm mt-4">
          Update my Soul.md
        </Link>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-bold text-gray-900">Sign out</h2>
        <p className="mt-1 text-[13.5px] text-gray-600">
          Ends this session on this device.
        </p>
        <a href="/api/auth/logout" className="btn btn--outline btn--sm mt-4">
          Sign out
        </a>
      </section>
    </div>
  );
}
