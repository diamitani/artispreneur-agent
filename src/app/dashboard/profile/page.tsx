import { DashboardShell } from "@/components/dashboard/DashboardShell";

const details = [
  ["Artist Name", "Your Stage Name"],
  ["Genre", "Hip-Hop / Rap"],
  ["Email", "artist@artispreneur.com"],
  ["Plan", "Artispreneur Pro"],
];

export default function ProfilePage() {
  return (
    <DashboardShell title="Profile" subtitle="Your artist account">
      <div className="p-5 md:p-7">
        <div className="mx-auto max-w-[520px]">
          {/* Profile card */}
          <div className="mb-4 overflow-hidden rounded-[10px] bg-white shadow-[var(--shadow-md)]">
            <div className="relative h-[100px] bg-[color:var(--color-bg-dark)]">
              <div className="absolute -bottom-[30px] left-6 flex h-[60px] w-[60px] items-center justify-center rounded-full border-[3px] border-white bg-[color:var(--color-crimson)]">
                <span className="text-[22px] font-bold text-white">A</span>
              </div>
            </div>
            <div className="px-6 pb-6 pt-10">
              <h2 className="font-heading text-xl text-[color:var(--color-black)]">Your Artist Profile</h2>
              <p className="mt-1 text-[13px] text-[color:var(--color-gray-mid)]">Independent Artist · Hip-Hop / Rap</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded bg-[color:var(--color-gold-light)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-black)]">
                  Pro Member
                </span>
                <span className="rounded bg-[color:var(--color-bg-surface)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-gray-mid)]">
                  Artist
                </span>
                <span className="rounded bg-[color:var(--color-success)]/10 px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-success)]">
                  EIN Registered
                </span>
              </div>
            </div>
          </div>

          {/* Account details */}
          <div className="rounded-[8px] bg-white p-5 shadow-[var(--shadow-sm)]">
            <h3 className="font-heading mb-3.5 text-[15px] text-[color:var(--color-black)]">Account Details</h3>
            <div>
              {details.map(([label, val], i) => (
                <div
                  key={label}
                  className={`flex items-center justify-between py-2.5 text-[13px] ${
                    i < details.length - 1 ? "border-b border-[color:var(--color-border)]" : ""
                  }`}
                >
                  <span className="font-medium text-[color:var(--color-gray-mid)]">{label}</span>
                  <span className="font-semibold text-[color:var(--color-black)]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
