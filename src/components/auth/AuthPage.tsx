"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { brand } from "@/lib/brand";
import { AuthForm } from "./AuthForm";
import { FloatingTestimonial } from "./FloatingTestimonial";

type AuthPageProps = {
  mode: "signin" | "signup";
};

const springTransition = { type: "spring", stiffness: 100, damping: 20 };

export function AuthPage({ mode }: AuthPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = mode === "signup";
  const heading = isSignUp ? "Start your journey" : "Welcome back";
  const subheading = isSignUp
    ? "Create your workspace and hire your AI business team."
    : "Sign in to your Artispreneur workspace.";

  const altText = isSignUp ? "Already have an account?" : "New to Artispreneur?";
  const altLink = isSignUp ? "/signin" : "/signup";
  const altLabel = isSignUp ? "Sign in" : "Create account";

  const handleSubmit = () => {
    setIsSubmitting(true);
    const endpoint = `/api/auth/login?${isSignUp ? "signup=1&return=/onboarding" : "return=/workspace"}`;
    window.location.href = endpoint;
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[color:var(--color-bg-page)]">
      <div className="grid min-h-[100dvh] w-full lg:grid-cols-[1fr_minmax(420px,480px)]">
        {/* Left panel — brand showcase */}
        <div className="relative hidden overflow-hidden bg-[color:var(--color-charcoal)] lg:block">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-gold)]/8 via-transparent to-[color:var(--color-charcoal)]" />

          {/* Mesh gradient blob */}
          <motion.div
            className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.22, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute -bottom-48 -right-24 h-[400px] w-[400px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, var(--color-crimson) 0%, transparent 70%)",
              filter: "blur(100px)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={brand.logo.primaryPng}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10"
                priority
              />
              <span className="font-heading text-xl tracking-tight text-[color:var(--color-text-primary)]">
                Artispreneur
              </span>
              <span className="badge-agent">AGENT</span>
            </Link>

            {/* Hero copy */}
            <div className="max-w-md">
              <motion.h1
                className="font-heading text-4xl tracking-tight text-[color:var(--color-text-primary)] xl:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.1 }}
              >
                Your AI business team,{" "}
                <span className="text-[color:var(--color-gold)]">on demand</span>
              </motion.h1>
              <motion.p
                className="mt-5 text-lg leading-relaxed text-[color:var(--color-text-muted)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.2 }}
              >
                Seven specialist agents handle royalties, contracts, outreach,
                and press kits — you approve before anything ships.
              </motion.p>
            </div>

            {/* Floating testimonial */}
            <FloatingTestimonial />
          </div>

          {/* Edge line */}
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[color:var(--color-border)] to-transparent" />
        </div>

        {/* Right panel — form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springTransition}
          >
            {/* Mobile logo */}
            <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
              <Image
                src={brand.logo.primaryPng}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9"
                priority
              />
              <span className="font-heading text-lg tracking-tight text-[color:var(--color-text-primary)]">
                Artispreneur
              </span>
              <span className="badge-agent">AGENT</span>
            </Link>

            <div className="mb-8">
              <h2 className="font-heading text-3xl tracking-tight text-[color:var(--color-text-primary)]">
                {heading}
              </h2>
              <p className="mt-2 text-[color:var(--color-text-muted)]">{subheading}</p>
            </div>

            <AuthForm mode={mode} onSubmit={handleSubmit} isSubmitting={isSubmitting} />

            <p className="mt-8 text-center text-sm text-[color:var(--color-text-muted)]">
              {altText}{" "}
              <Link
                href={altLink}
                className="font-medium text-[color:var(--color-gold)] transition-colors hover:text-[color:var(--color-gold-light)]"
              >
                {altLabel}
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-[color:var(--color-text-dim)]">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[color:var(--color-text-muted)]">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[color:var(--color-text-muted)]">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
