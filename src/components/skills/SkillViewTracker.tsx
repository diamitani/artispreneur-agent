"use client";

import { useEffect } from "react";

export function SkillViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/skills/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "skill_viewed", slug }),
    }).catch(() => undefined);
  }, [slug]);
  return null;
}
