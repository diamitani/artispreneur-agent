import { PageHeader } from "@/components/dashboard/PageHeader";

const courses = [
  { title: "Music Business 101", lessons: 12, badge: "Free" as const, progress: 60, color: "#111" },
  { title: "Copyright & Royalties", lessons: 8, badge: "Pro" as const, progress: 0, color: "#CC0000" },
  { title: "Artist Branding Masterclass", lessons: 10, badge: "Pro" as const, progress: 0, color: "#1A1A1A" },
  { title: "Booking & Live Performance", lessons: 15, badge: "Free" as const, progress: 20, color: "#CC0000" },
  { title: "DSP Distribution Guide", lessons: 6, badge: "Free" as const, progress: 0, color: "#444" },
  { title: "Contract Basics", lessons: 9, badge: "Pro" as const, progress: 0, color: "#111" },
];

export default function AcademyPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Learn"
        title="Academy"
        subtitle="Courses, articles, and resources for music entrepreneurs."
      />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <div
              key={i}
              className="cursor-pointer overflow-hidden rounded-[8px] bg-white shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <div
                className="flex h-[100px] items-center justify-center"
                style={{ background: c.color }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
              </div>
              <div className="p-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-gray-mid)]">
                    {c.lessons} lessons
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      c.badge === "Pro"
                        ? "bg-[color:var(--color-gold-light)] text-[color:var(--color-black)]"
                        : "bg-[color:var(--color-bg-surface)] text-[color:var(--color-gray-mid)]"
                    }`}
                  >
                    {c.badge}
                  </span>
                </div>
                <h4 className="font-heading mb-2 text-[14px] text-[color:var(--color-black)]">{c.title}</h4>
                {c.progress > 0 && (
                  <div>
                    <div className="h-[3px] overflow-hidden rounded bg-[color:var(--color-border)]">
                      <div
                        className="h-full rounded bg-[color:var(--color-crimson)]"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-[color:var(--color-gray-subtle)]">{c.progress}% complete</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
