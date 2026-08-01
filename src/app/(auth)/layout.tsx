/**
 * Auth routes render edge to edge — AuthShell provides the split layout,
 * so this group adds no container of its own.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white">{children}</div>;
}
