import { UnifiedSidebar } from "@/components/shared/unified-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}