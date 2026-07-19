"use client";

import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  onClick,
  type = "button",
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.25, y: y * 0.25 });
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn("inline-flex items-center justify-center", className)}
    >
      {children}
    </motion.button>
  );
}
