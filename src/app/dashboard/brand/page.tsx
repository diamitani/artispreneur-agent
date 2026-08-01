import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardAgentChat } from "@/components/dashboard/DashboardAgentChat";

export const metadata = { title: "Brand Center" };

export default function BrandCenterPage() {
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      <PageHeader
        eyebrow="Brand"
        title="Brand Center"
        subtitle="EPKs, bios, visual identity, and social content — written in your voice."
      />
      <div className="min-h-0 flex-1">
        <DashboardAgentChat
          greeting="I handle your brand. I can build your EPK, write bios at every length, define your content pillars, and draft social copy that stays consistent with your story. What are we making?"
          suggestions={[
            "Build my EPK from what you know about me",
            "Write my bio in short, medium, and long",
            "Define my content pillars for this quarter",
            "Draft a visual direction brief for my next cover",
          ]}
          placeholder="Create social content, press kits, brand assets…"
        />
      </div>
    </div>
  );
}
