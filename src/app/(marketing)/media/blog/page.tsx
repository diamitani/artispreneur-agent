import { MarketingShell } from "@/components/marketing/MarketingShell";
import { NewsletterSignup } from "@/components/marketing/newsletter-signup";
import { RssTicker } from "@/components/marketing/rss-ticker";
import Link from "next/link";
import { ArrowRight, Clock, TrendingUp, Tag } from "lucide-react";

interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  featured?: boolean;
}

const FEATURED: BlogArticle = {
  slug: "independent-artists-market-share-2026",
  title: "Independent Artists Now Control 47% of Global Streaming Revenue",
  excerpt: "Without a single label deal. Here's how the landscape shifted — and what it means for your career strategy in 2026 and beyond.",
  category: "Industry Analysis",
  author: "Artispreneur Media",
  date: "2026-08-02",
  readTime: "6 min read",
  imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
  featured: true,
};

const ARTICLES: BlogArticle[] = [
  FEATURED,
  {
    slug: "bmi-rate-restructure-2026",
    title: "BMI Restructures Royalty Rates — What Self-Published Songwriters Need to Know",
    excerpt: "The new rate structure fundamentally changes how independent songwriters get paid. Your agent can help you navigate the transition.",
    category: "Publishing",
    author: "Artispreneur Media",
    date: "2026-08-01",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&q=80",
  },
  {
    slug: "copyright-ai-music-rules-2026",
    title: "U.S. Copyright Office Finalizes AI-Generated Music Rules",
    excerpt: "The long-awaited mechanical licensing rules for AI-generated works are here. Here's what independent artists must understand.",
    category: "Legal",
    author: "Artispreneur Media",
    date: "2026-07-31",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&q=80",
  },
  {
    slug: "distrokid-splits-2026",
    title: "DistroKid Launches Instant Split-Sheet Generation — Our Take",
    excerpt: "Built-in split sheets are here. How it compares to your Artispreneur agent's automated split sheet workflow.",
    category: "Tools",
    author: "Artispreneur Media",
    date: "2026-07-30",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600&q=80",
  },
  {
    slug: "spotify-royalty-record-2026",
    title: "Spotify Reports Record $10B+ in Royalty Payouts to Indies",
    excerpt: "The streaming giant's latest transparency report reveals a massive shift toward independent artists. Are you capturing your share?",
    category: "Revenue",
    author: "Artispreneur Media",
    date: "2026-07-29",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80",
  },
  {
    slug: "grammy-submission-guide-2026",
    title: "Grammy Submission Guide: What Independent Artists Must Know for 2027",
    excerpt: "Deadlines, eligibility, and the step-by-step submission process — your agent can prepare everything you need.",
    category: "Industry",
    author: "Artispreneur Media",
    date: "2026-07-28",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=600&q=80",
  },
  {
    slug: "sxsw-2027-artist-applications",
    title: "SXSW 2027 Artist Applications Open — Record Indie Showcase Slots",
    excerpt: "More independent showcase slots than ever. Your booking agent can handle the application while you focus on the music.",
    category: "Booking",
    author: "Artispreneur Media",
    date: "2026-07-27",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
  },
  {
    slug: "tiktok-distribution-expansion-2026",
    title: "TikTok Music Distribution Expands to 50+ New Markets",
    excerpt: "The platform's distribution program now reaches most of the world. Here's how to get your music on TikTok's global feed.",
    category: "Distribution",
    author: "Artispreneur Media",
    date: "2026-07-26",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&q=80",
  },
  {
    slug: "sync-licensing-guide-2026",
    title: "Sync Licensing in 2026: How Indie Artists Are Earning $10K-$50K Per Placement",
    excerpt: "TV, film, ads, games — sync is the fastest-growing revenue stream for independent musicians. Here's the complete guide.",
    category: "Revenue",
    author: "Artispreneur Media",
    date: "2026-07-25",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80",
  },
];

const CATEGORIES = [
  "Industry Analysis",
  "Publishing",
  "Revenue",
  "Legal",
  "Booking",
  "Distribution",
  "Tools",
  "Industry",
];

const TRENDING = ARTICLES.slice(0, 4);

export default function BlogPage() {
  return (
    <MarketingShell>
      <RssTicker />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-4xl text-black mb-3">The Artispreneur Blog</h1>
            <p className="text-gray-500 max-w-2xl">
              Industry analysis, career strategy, and music business intelligence for independent artists building sustainable careers.
            </p>
          </div>

          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Main content */}
            <div className="flex-1">
              {/* Featured article */}
              <Link
                href={`/media/blog/${FEATURED.slug}`}
                className="group mb-10 block overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img
                      src={FEATURED.imageUrl}
                      alt={FEATURED.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <span className="mb-3 inline-block w-fit rounded bg-crimson/10 px-2.5 py-1 text-[11px] font-bold text-crimson uppercase tracking-wide">
                      {FEATURED.category}
                    </span>
                    <h2 className="font-display text-2xl text-black leading-snug mb-3 group-hover:text-crimson transition-colors">
                      {FEATURED.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{FEATURED.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{FEATURED.author}</span>
                      <span>•</span>
                      <span>{FEATURED.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {FEATURED.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Article grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {ARTICLES.slice(1).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/media/blog/${article.slug}`}
                    className="group overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <span className="mb-2 inline-block w-fit rounded bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                        {article.category}
                      </span>
                      <h3 className="font-display text-base text-black leading-snug mb-2 group-hover:text-crimson transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA after articles */}
              <div className="mt-10 rounded-xl bg-black p-8 text-center">
                <h3 className="font-display text-xl text-white mb-2">
                  Your agent can handle all of this automatically.
                </h3>
                <p className="text-white/50 text-sm mb-5 max-w-md mx-auto">
                  From sync licensing research to booking outreach — your Artispreneur agent monitors the industry so you don't have to.
                </p>
                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-bold text-black hover:bg-gold-light transition-colors"
                >
                  Try Your Agent Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
              {/* Newsletter */}
              <NewsletterSignup variant="sidebar" />

              {/* Trending */}
              <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-crimson" />
                  <h3 className="font-display text-base text-black">Trending</h3>
                </div>
                <div className="space-y-3">
                  {TRENDING.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/media/blog/${article.slug}`}
                      className="block group"
                    >
                      <p className="text-sm font-medium text-black group-hover:text-crimson transition-colors leading-snug">
                        {article.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{article.date}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-crimson" />
                  <h3 className="font-display text-base text-black">Categories</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <span
                      key={cat}
                      className="cursor-pointer rounded bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-crimson hover:text-white transition-colors"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}