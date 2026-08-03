"use client";

import { useState, useEffect, useRef } from "react";
import { Rss, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TickerItem {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
}

// Simulated RSS feed items — replace with actual RSS fetching via API route
const MOCK_TICKER: TickerItem[] = [
  {
    id: "1",
    title: "Spotify reports record $10B+ in royalty payouts to independent artists in 2026",
    source: "Billboard",
    url: "/media/blog/spotify-royalty-record-2026",
    date: "2026-08-02",
  },
  {
    id: "2",
    title: "BMI announces new royalty rate structure benefiting self-published songwriters",
    source: "Music Business Worldwide",
    url: "/media/blog/bmi-rate-restructure-2026",
    date: "2026-08-01",
  },
  {
    id: "3",
    title: "U.S. Copyright Office finalizes new mechanical licensing rules for AI-generated music",
    source: "Hypebot",
    url: "/media/blog/copyright-ai-music-rules-2026",
    date: "2026-07-31",
  },
  {
    id: "4",
    title: "DistroKid launches instant split-sheet generation for collaborators",
    source: "DIY Musician",
    url: "/media/blog/distrokid-splits-2026",
    date: "2026-07-30",
  },
  {
    id: "5",
    title: "Independent artists now account for 47% of global streaming revenue — up from 38%",
    source: "Billboard",
    url: "/media/blog/indie-artists-market-share-2026",
    date: "2026-07-29",
  },
  {
    id: "6",
    title: "Grammy submission deadline approaching — here's what independent artists need to know",
    source: "Music Business Worldwide",
    url: "/media/blog/grammy-submission-guide-2026",
    date: "2026-07-28",
  },
  {
    id: "7",
    title: "SXSW 2027 opens artist applications — record number of showcase slots for indie performers",
    source: "Hypebot",
    url: "/media/blog/sxsw-2027-artist-applications",
    date: "2026-07-27",
  },
  {
    id: "8",
    title: "TikTok expands music distribution program to 50+ new markets worldwide",
    source: "DIY Musician",
    url: "/media/blog/tiktok-distribution-expansion-2026",
    date: "2026-07-26",
  },
];

export function RssTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items] = useState<TickerItem[]>(MOCK_TICKER);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      if (!isPaused && el) {
        scrollPos += speed;
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Duplicate items for seamless infinite scroll
  const tickerItems = [...items, ...items];

  return (
    <div
      className="relative flex h-9 items-center overflow-hidden bg-black border-b border-white/[0.06]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fixed label */}
      <div className="absolute left-0 top-0 z-10 flex h-full items-center gap-2 bg-black px-4">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
        </span>
        <Rss className="h-3.5 w-3.5 text-gold" />
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">
          Live
        </span>
      </div>

      {/* Separator */}
      <div className="absolute left-[90px] top-0 z-10 h-full w-px bg-white/[0.08]" />

      {/* Scrolling items */}
      <div
        ref={scrollRef}
        className="flex w-full items-center gap-8 overflow-hidden whitespace-nowrap pl-[100px]"
        style={{ scrollbarWidth: "none" }}
      >
        {tickerItems.map((item, i) => (
          <Link
            key={`${item.id}-${i}`}
            href={item.url}
            className="inline-flex items-center gap-2 text-[11px] text-white/55 hover:text-gold transition-colors shrink-0"
          >
            <span className="font-bold text-gold/50">{item.source}</span>
            <span className="text-white/20">•</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-[90px] top-0 w-12 h-full bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-black to-transparent" />

      {/* Newsletter CTA */}
      <Link
        href="/media/blog"
        className="absolute right-0 top-0 z-10 flex h-full items-center gap-1.5 bg-gold px-4 text-[11px] font-bold text-black hover:bg-gold-light transition-colors"
      >
        <span className="hidden sm:inline">Get this in your inbox</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}