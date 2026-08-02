import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ROUTES } from "@/lib/constants";
import { SignInError } from "@/components/auth/SignInError";

export const metadata = {
  title: "Sign In",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; missing?: string }>;
}) {
  const { error, missing } = await searchParams;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Logo className="text-3xl" />
        <h1 className="mt-6 font-[var(--font-display)] text-2xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-500">Sign in to your workspace</p>
      </div>

      {error && <SignInError error={error} missing={missing} />}

      <div className="space-y-5">
        <a
          href="/api/auth/login?return=/dashboard"
          className="block w-full rounded-md bg-crimson px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-crimson-dark focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 transition-colors"
        >
          Sign In
        </a>
      </div>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.signup} className="font-medium text-crimson hover:text-crimson-dark">
          Sign up
        </Link>
      </p>
    </div>
  );
}
