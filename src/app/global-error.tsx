"use client";

/**
 * Last-resort boundary. This catches errors thrown in the root layout itself,
 * which `error.tsx` cannot — without it, that class of failure renders Next's
 * unstyled default page with a stack trace in development and a bare
 * "Application error" in production.
 *
 * It replaces the whole document, so it must render its own <html> and <body>
 * and cannot rely on the app's stylesheet being loaded.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#F5F5F5",
          color: "#111111",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main style={{ maxWidth: 440 }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#CC0000",
            }}
          >
            Artispreneur
          </p>
          <h1 style={{ margin: "12px 0 0", fontSize: 30, lineHeight: 1.15 }}>
            Something went wrong.
          </h1>
          <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65, color: "#444" }}>
            Your workspace and everything in it is safe. Try again, and if this
            keeps happening, email{" "}
            <a href="mailto:support@artispreneur.com" style={{ color: "#CC0000" }}>
              support@artispreneur.com
            </a>
            .
          </p>
          {/* The digest is a hash, not a stack trace — safe to show, and it is
              what lets support find the matching server log. */}
          {error.digest && (
            <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "#777" }}>
              Reference {error.digest}
            </p>
          )}
          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: 8,
                background: "#CC0000",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Deliberately a plain anchor, not next/link: the root layout is
                the thing that just failed, so a client-side navigation would
                re-render straight back into the broken tree. A full document
                load is the point. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "1px solid #ccc",
                color: "#111",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
