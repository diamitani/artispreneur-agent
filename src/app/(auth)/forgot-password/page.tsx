import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { isDirectAuthConfigured } from "@/lib/auth/cognito-direct";
import { AuthUnavailable } from "@/components/auth/AuthUnavailable";

export const metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password."
      subtitle="We'll email you a code, then you can pick a new password."
    >
      {isDirectAuthConfigured() ? <ResetPasswordForm /> : <AuthUnavailable />}
    </AuthShell>
  );
}
