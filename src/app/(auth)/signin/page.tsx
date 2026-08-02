import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { isDirectAuthConfigured } from "@/lib/auth/cognito-direct";
import { isAuthDevBypass } from "@/lib/auth/config";
import { AuthUnavailable } from "@/components/auth/AuthUnavailable";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign In" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; missing?: string; next?: string; email?: string; verified?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next?.startsWith("/") ? sp.next : "/dashboard";

  if (isAuthDevBypass()) redirect(next);

  // Clear any stale session cookie so a broken/rotated cookie can't loop forever.
  // The cookie will be re-set fresh after successful sign-in.
  const cookieStore = await cookies();
  cookieStore.set("aa_session", "", { maxAge: 0, path: "/" });

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace."
      subtitle={sp.verified === "1" ? "Email verified — you're all set. Sign in below." : undefined}
    >
      {isDirectAuthConfigured() ? (
        <SignInForm returnTo={next} initialEmail={sp.email ?? ""} />
      ) : (
        <AuthUnavailable />
      )}
    </AuthShell>
  );
}
