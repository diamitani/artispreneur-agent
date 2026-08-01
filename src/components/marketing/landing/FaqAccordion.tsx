"use client";

import { useState } from "react";
import { FAQ } from "./landing-data";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl">
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-[color:var(--color-border)]">
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="text-[15.5px] font-semibold text-[color:var(--color-black)]">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={`mt-0.5 shrink-0 text-[color:var(--color-crimson)] transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            {isOpen && (
              <p className="max-w-2xl pb-5 text-[14.5px] leading-relaxed text-[color:var(--color-gray-mid)]">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
