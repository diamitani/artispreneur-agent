import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { isDirectAuthConfigured } from "@/lib/auth/cognito-direct";
import { isAuthDevBypass } from "@/lib/auth/config";
import { AuthUnavailable } from "@/components/auth/AuthUnavailable";

export const metadata = { title: "Create your workspace" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next?.startsWith("/") ? sp.next : "/onboarding";

  if (isAuthDevBypass()) redirect(next);

  return (
    <AuthShell
      eyebrow="Start free"
      title="Create your workspace."
      subtitle="No credit card. Your agents and a real workspace deploy in about a minute."
    >
      {isDirectAuthConfigured() ? <SignUpForm returnTo={next} /> : <AuthUnavailable />}
    </AuthShell>
  );
}
