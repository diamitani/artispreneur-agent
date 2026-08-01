import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardAgentChat } from "@/components/dashboard/DashboardAgentChat";

export const metadata = { title: "Chat" };

export default function DashboardChatPage() {
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      <PageHeader
        eyebrow="Master agent"
        title="Chat"
        subtitle="Ask in plain language — your agent routes it to the right specialist."
      />
      <div className="min-h-0 flex-1">
        <DashboardAgentChat />
      </div>
    </div>
  );
}
