import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ChatPanel } from "@/components/dashboard/ChatPanel";

export default function BookingCenterPage() {
  return (
    <DashboardShell title="Booking Center" subtitle="CRM, outreach & directory">
      <ChatPanel
        title="Booking"
        placeholder="Find venues, draft outreach emails, manage your CRM..."
        greeting="Hi! I'm your Booking AI manager. I can help you find venues, draft outreach emails, manage your contacts, and track your booking pipeline. What do you need today?"
      />
    </DashboardShell>
  );
}
