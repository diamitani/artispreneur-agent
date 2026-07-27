import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Logo className="text-3xl" />
        <h1 className="mt-6 font-[var(--font-display)] text-2xl font-bold text-gray-900">
          Create your workspace
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Start building your music business with AI
        </p>
      </div>

      <div className="space-y-5">
        <a
          href="/api/auth/login?signup=1&return=/onboarding"
          className="block w-full rounded-md bg-crimson px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-crimson-dark focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 transition-colors"
        >
          Create Account
        </a>
      </div>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href={ROUTES.signin} className="font-medium text-crimson hover:text-crimson-dark">
          Sign in
        </Link>
      </p>
    </div>
  );
}
