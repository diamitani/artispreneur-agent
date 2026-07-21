import type { Metadata } from "next";
import { AuthPage } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Artispreneur Agent workspace and hire your AI business team",
};

export default function SignUpPage() {
  return <AuthPage mode="signup" />;
}
