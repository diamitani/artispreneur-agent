"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quotes } from "@phosphor-icons/react";

const testimonials = [
  {
    quote: "Finally, something that gets how indie artists actually work. The contract agent alone saved me from a bad sync deal.",
    name: "Dominique Reyes",
    role: "Producer, Bluewater Collective",
    avatar: "DR",
  },
  {
    quote: "Set up my LLC, registered with ASCAP, and had a press kit ready in one afternoon. No lawyer fees, no confusion.",
    name: "Jamal Okonkwo",
    role: "R&B Artist, Chicago",
    avatar: "JO",
  },
  {
    quote: "The outreach agent booked me three college shows I never would have found myself. Approval before send was key.",
    name: "Sienna Marchetti",
    role: "Singer-Songwriter",
    avatar: "SM",
  },
];

const springTransition = { type: "spring", stiffness: 100, damping: 20 } as const;

export function FloatingTestimonial() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[current] ?? testimonials[0]!;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={springTransition}
          className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6 backdrop-blur-sm"
        >
          <Quotes
            weight="fill"
            className="mb-3 h-6 w-6 text-[color:var(--color-gold)]/60"
          />
          <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            {t.quote}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-gold)]/15 text-xs font-semibold text-[color:var(--color-gold)]">
              {t.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                {t.name}
              </p>
              <p className="text-xs text-[color:var(--color-text-dim)]">{t.role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="mt-4 flex gap-1.5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-[color:var(--color-gold)]"
                : "w-1.5 bg-[color:var(--color-border)]"
            }`}
            aria-label={`Show testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
