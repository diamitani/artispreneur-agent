"use client";

import { UnifiedSidebar } from "@/components/shared/unified-sidebar";
import { GraduationCap, Clock, BarChart3, Play, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const COURSES = [
  {
    id: "music-business-101",
    title: "Music Business 101 — Build Your Foundation",
    description: "From EIN registration to LLC formation, this course walks you through every legal and business step to professionalize your music career.",
    category: "Business Formation",
    lessons: 12,
    duration: "4 hours",
    level: "Beginner",
    enrolled: 847,
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&q=80",
  },
  {
    id: "publishing-royalties",
    title: "Publishing & Royalties — Capture Every Dollar",
    description: "Learn how PROs work, how to register your tracks, and how to track royalties across ASCAP, BMI, Spotify, and Apple Music.",
    category: "Publishing",
    lessons: 10,
    duration: "3.5 hours",
    level: "Intermediate",
    enrolled: 623,
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
  },
  {
    id: "booking-touring",
    title: "Booking & Touring — Fill Your Calendar",
    description: "Research venues, write outreach emails, negotiate deals, and build a touring circuit — all without a booking agent.",
    category: "Booking",
    lessons: 8,
    duration: "3 hours",
    level: "Intermediate",
    enrolled: 412,
    progress: 35,
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
  },
  {
    id: "brand-epk",
    title: "Brand Building & EPK Creation",
    description: "Define your brand identity, create professional press kits, and build a visual presence that venues and labels take seriously.",
    category: "Brand",
    lessons: 9,
    duration: "2.5 hours",
    level: "Beginner",
    enrolled: 531,
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80",
  },
  {
    id: "sync-licensing",
    title: "Sync Licensing Masterclass",
    description: "How independent artists are earning $10K-$50K per TV/film placement. Research opportunities, pitch music supervisors, negotiate deals.",
    category: "Revenue",
    lessons: 14,
    duration: "5 hours",
    level: "Advanced",
    enrolled: 389,
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=600&q=80",
  },
  {
    id: "social-media-strategy",
    title: "Social Media Strategy for Musicians",
    description: "Content calendars, hook scripts, UGC briefs, and paid ad strategies for Instagram, TikTok, and YouTube.",
    category: "Marketing",
    lessons: 11,
    duration: "3 hours",
    level: "Beginner",
    enrolled: 702,
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&q=80",
  },
];

const CATEGORIES = ["All", "Business Formation", "Publishing", "Booking", "Brand", "Revenue", "Marketing", "Legal"];

export default function AcademyPage() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3">
          <div>
            <h1 className="font-display text-lg text-black">Academy</h1>
            <p className="text-xs text-gray-400">Master the music business — courses, AI tutor, and career intelligence</p>
          </div>
          <Link
            href="/workspace/chat"
            className="flex items-center gap-2 rounded-lg bg-crimson px-4 py-2 text-sm font-bold text-white hover:bg-crimson-dark transition-colors"
          >
            <GraduationCap className="h-4 w-4" />
            Ask AI Tutor
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Categories */}
          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  cat === "All"
                    ? "bg-crimson text-white"
                    : "border border-gray-200 text-gray-500 hover:border-crimson hover:text-crimson"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.map((course) => (
              <Link
                key={course.id}
                href={`/academy/${course.id}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-crimson hover:shadow-md transition-all"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="mb-2 inline-block w-fit rounded bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                    {course.category}
                  </span>
                  <h3 className="font-display text-base text-black mb-2 group-hover:text-crimson transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{course.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {course.level}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {course.progress > 0 && (
                    <div className="mb-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-crimson transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-crimson font-medium">{course.progress}% complete</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Users className="h-3 w-3" />
                      {course.enrolled.toLocaleString()} enrolled
                    </span>
                    <span className="text-[11px] font-bold text-crimson group-hover:underline">
                      {course.progress > 0 ? "Continue" : "Start Course"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* AI Tutor CTA */}
          <div className="mt-10 rounded-xl bg-black p-8 text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-gold mb-3" />
            <h3 className="font-display text-xl text-white mb-2">AI Tutor — Learn at Your Speed</h3>
            <p className="text-white/50 text-sm mb-5 max-w-md mx-auto">
              Stuck on a concept? Your AI tutor explains it in plain language, gives you examples, and quizzes you until you've got it.
            </p>
            <Link
              href="/workspace/chat?context=academy-tutor"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-black hover:bg-gold-light transition-colors"
            >
              Ask the AI Tutor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}