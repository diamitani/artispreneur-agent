import type { Metadata } from "next";
import { AuthPage } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Artispreneur Agent workspace",
};

export default function SignInPage() {
  return <AuthPage mode="signin" />;
}
