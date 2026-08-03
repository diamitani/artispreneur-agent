// DashboardShell (used by every page) owns the full viewport layout.
// This layout just passes children through to avoid double-wrapping.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
