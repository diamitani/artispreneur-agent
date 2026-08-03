"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

interface NewsletterSignupProps {
  variant?: "sidebar" | "banner" | "inline";
  className?: string;
}

export function NewsletterSignup({ variant = "sidebar", className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // Simulate API call — replace with actual HubSpot/Resend integration
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("success");
    setEmail("");
  };

  if (variant === "banner") {
    return (
      <div className={`bg-crimson px-6 py-10 ${className}`}>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Mail className="h-8 w-8 text-white" />
          <h2 className="font-display text-2xl text-white">The Weekly Music Business Brief</h2>
          <p className="text-sm text-white/75 max-w-md">
            Industry headlines, career insights, and your agent's top recommendations — delivered every Monday.
          </p>
          {status === "success" ? (
            <div className="flex items-center gap-2 rounded-md bg-white/15 px-5 py-3 text-white">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">You're in. Check your inbox Monday.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-md border-0 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-1.5 rounded-md bg-gold px-4 py-2.5 text-sm font-bold text-black hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Signing up..." : "Subscribe"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`rounded-lg bg-charcoal p-5 ${className}`}>
        <h3 className="font-display text-base text-white mb-1">Stay Updated</h3>
        <p className="text-xs text-white/50 mb-4">Weekly music business intel in your inbox.</p>
        {status === "success" ? (
          <div className="flex items-center gap-2 rounded-md bg-gold/10 px-3 py-2 text-gold text-sm">
            <Check className="h-4 w-4" />
            <span>Subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-crimson"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center justify-center gap-1.5 rounded-md bg-crimson px-3 py-2 text-sm font-bold text-white hover:bg-crimson-light transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    );
  }

  // Default: sidebar variant
  return (
    <div className={`rounded-lg border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gold/20">
          <Mail className="h-4 w-4 text-black" />
        </div>
        <h3 className="font-display text-base text-black">Weekly Brief</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Industry headlines, career insights, and agent tips — every Monday morning.
      </p>
      {status === "success" ? (
        <div className="flex items-center gap-2 rounded-md bg-gold/20 px-3 py-2 text-sm font-medium text-black/70">
          <Check className="h-4 w-4" />
          <span>Subscribed!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-crimson"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-1.5 rounded-md bg-crimson px-3 py-2 text-sm font-bold text-white hover:bg-crimson-dark transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Signing up..." : "Subscribe Free"}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}