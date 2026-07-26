import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ChatPanel } from "@/components/dashboard/ChatPanel";

export default function BrandCenterPage() {
  return (
    <DashboardShell title="Brand Center" subtitle="AI-powered branding & social media">
      <ChatPanel
        title="Brand"
        placeholder="Create social content, press kits, logos..."
        greeting="Hi! I'm your Brand AI manager. I can help you create press kits, social content, brand assets, and visual identity. What do you need today?"
      />
    </DashboardShell>
  );
}
