import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Access your Artispreneur Agent workspace",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
