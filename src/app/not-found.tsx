import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export const metadata = { title: "Page not found" };

/**
 * There was no 404 page, so a mistyped URL rendered Next's default. Several
 * links in the footer used to point at pages that did not exist — this is the
 * page that catches whatever slips through next time.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg-surface)] px-6">
      <div className="max-w-md">
        <p className="type-mono-label text-[color:var(--color-crimson)]">404</p>
        <h1
          className="font-heading mt-3 text-[color:var(--color-black)]"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15 }}
        >
          That page doesn&apos;t exist.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-gray-dark)]">
          The link may be out of date, or the page may have moved.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={ROUTES.home} className="btn btn--primary btn--md">
            Go home
          </Link>
          <Link href={ROUTES.dashboard} className="btn btn--outline btn--md">
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
