"use client";

import { motion } from "framer-motion";
import { Envelope, LockKey, SpinnerGap, User, GoogleLogo, AppleLogo } from "@phosphor-icons/react";

type AuthFormProps = {
  mode: "signin" | "signup";
  onSubmit: () => void;
  isSubmitting: boolean;
};

const springTransition = { type: "spring", stiffness: 100, damping: 20 };

export function AuthForm({ mode, onSubmit, isSubmitting }: AuthFormProps) {
  const isSignUp = mode === "signup";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-sm font-medium text-[color:var(--color-text-primary)] transition-colors hover:border-[color:var(--color-border-dark)] hover:bg-[color:var(--color-card)] disabled:opacity-50"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={springTransition}
        >
          <GoogleLogo weight="bold" className="h-4 w-4" />
          Google
        </motion.button>
        <motion.button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-sm font-medium text-[color:var(--color-text-primary)] transition-colors hover:border-[color:var(--color-border-dark)] hover:bg-[color:var(--color-card)] disabled:opacity-50"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={springTransition}
        >
          <AppleLogo weight="fill" className="h-4 w-4" />
          Apple
        </motion.button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-1 border-t border-[color:var(--color-border)]" />
        <span className="px-4 text-xs text-[color:var(--color-text-dim)]">or continue with email</span>
        <div className="flex-1 border-t border-[color:var(--color-border)]" />
      </div>

      {/* Name field (signup only) */}
      {isSignUp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={springTransition}
        >
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            Full name
          </label>
          <div className="relative">
            <User
              weight="regular"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-dim)]"
            />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Maya Rivera"
              className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-dim)] transition-colors focus:border-[color:var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-gold)]/30"
            />
          </div>
        </motion.div>
      )}

      {/* Email field */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
          Email address
        </label>
        <div className="relative">
          <Envelope
            weight="regular"
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-dim)]"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="maya@label.com"
            className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-dim)] transition-colors focus:border-[color:var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-gold)]/30"
          />
        </div>
      </div>

      {/* Password field */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-[color:var(--color-text-secondary)]">
            Password
          </label>
          {!isSignUp && (
            <a
              href="/api/auth/login?forgot=1"
              className="text-xs text-[color:var(--color-text-dim)] transition-colors hover:text-[color:var(--color-gold)]"
            >
              Forgot password?
            </a>
          )}
        </div>
        <div className="relative">
          <LockKey
            weight="regular"
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-dim)]"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
            className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-dim)] transition-colors focus:border-[color:var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-gold)]/30"
          />
        </div>
      </div>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="btn btn--primary btn--md btn--block mt-6 h-12 text-base"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={springTransition}
      >
        {isSubmitting ? (
          <>
            <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
            <span>Redirecting...</span>
          </>
        ) : isSignUp ? (
          "Create account"
        ) : (
          "Sign in"
        )}
      </motion.button>
    </form>
  );
}
