"use client";

import { Reveal } from "./Reveal";

export function TerminalShowcase() {
  return (
    <section className="relative -mt-10 md:-mt-16">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[#141414] shadow-[var(--shadow-xl)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-[11px] text-[color:var(--color-gray-mid)]">
                agent — tonight&apos;s session
              </span>
            </div>
            <div className="space-y-0 px-5 py-6 font-mono text-[12.5px] leading-[2] text-white/80 md:px-7">
              <p>
                <span className="text-[color:var(--color-gold)]">you</span>
                <span className="text-white/30"> › </span>
                Need an EPK and three NYC rooms this quarter.
              </p>
              <p className="text-white/40">⋯ EPK Builder + Booking / Outreach on it</p>
              <p>
                <span className="text-[color:var(--color-crimson)]">agent</span>
                <span className="text-white/30"> › </span>
                One-sheet and press bio drafted. 12 rooms matched. 3 pitches ready for your
                approval.
              </p>
              <p className="text-[color:var(--color-success)]">
                ✓ waiting on you — nothing sent
                <span className="cursor-blink" />
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
