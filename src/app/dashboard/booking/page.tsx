import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardAgentChat } from "@/components/dashboard/DashboardAgentChat";

export const metadata = { title: "Booking Center" };

export default function BookingCenterPage() {
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      <PageHeader
        eyebrow="Booking"
        title="Booking Center"
        subtitle="Venue research, outreach drafts, and your booking pipeline."
      />
      <div className="min-h-0 flex-1">
        <DashboardAgentChat
          greeting="I handle booking. I can research rooms that fit your genre and draw, draft the outreach, build follow-up sequences, and track where every conversation stands. Nothing sends until you approve it. Where are we playing?"
          suggestions={[
            "Find venues near me that book my genre",
            "Draft an outreach email to a talent buyer",
            "Build a follow-up sequence for cold venues",
            "What should be on my tech rider?",
          ]}
          placeholder="Find venues, draft outreach, manage your pipeline…"
        />
      </div>
    </div>
  );
}
