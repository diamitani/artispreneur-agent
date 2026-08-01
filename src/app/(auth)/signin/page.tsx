import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { isDirectAuthConfigured } from "@/lib/auth/cognito-direct";
import { isAuthDevBypass } from "@/lib/auth/config";
import { AuthUnavailable } from "@/components/auth/AuthUnavailable";

export const metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; verified?: string; email?: string }>;
}) {
  const sp = await searchParams;
  // Only same-origin paths — an open redirect here would be a phishing vector.
  const next = sp.next?.startsWith("/") ? sp.next : "/dashboard";

  if (isAuthDevBypass()) redirect(next);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace."
      subtitle={
        sp.verified
          ? "Email verified. Sign in to finish setting up."
          : "Your agents have been keeping the lights on."
      }
    >
      {isDirectAuthConfigured() ? (
        // `email` is set when arriving from verification, so the field is prefilled.
        <SignInForm returnTo={next} initialEmail={sp.email} />
      ) : (
        <AuthUnavailable />
      )}
    </AuthShell>
  );
}
