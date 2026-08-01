import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { ConfirmForm } from "@/components/auth/ConfirmForm";

export const metadata = { title: "Verify your email" };

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string }>;
}) {
  const sp = await searchParams;
  if (!sp.email) redirect("/signup");
  const next = sp.next?.startsWith("/") ? sp.next : "/onboarding";

  return (
    <AuthShell
      eyebrow="One more step"
      title="Check your email."
      subtitle={
        <>
          We sent a verification code to{" "}
          <span className="font-semibold text-[color:var(--color-black)]">{sp.email}</span>.
        </>
      }
    >
      <ConfirmForm email={sp.email} returnTo={next} />
    </AuthShell>
  );
}
