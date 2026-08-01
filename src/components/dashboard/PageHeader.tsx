/**
 * Standard heading for a dashboard page.
 *
 * The dashboard layout already supplies the sidebar and topbar, so pages
 * render their own heading inline rather than wrapping themselves in a second
 * shell.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="type-mono-label text-[color:var(--color-crimson)]">{eyebrow}</p>
        )}
        <h1 className="font-heading mt-1 text-[22px] text-[color:var(--color-black)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13.5px] text-[color:var(--color-gray-mid)]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
