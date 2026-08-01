import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata = {
  title: "Build your agent",
  description:
    "Answer a few questions and Artispreneur compiles your Master Soul.md — the file every one of your agents reads before it does anything.",
};

/**
 * The intake that produces Master Soul.md.
 *
 * Replaces an earlier questionnaire that posted to a compiler whose output was
 * written outside the tenancy-scoped workspace, so the agent never read it.
 */
export default async function OnboardingPage() {
  const session = await getSessionUser();
  if (!session) redirect("/signin?next=/onboarding");

  return <OnboardingWizard />;
}
