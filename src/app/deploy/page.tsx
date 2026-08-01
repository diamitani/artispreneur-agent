import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { DeployWorkspace } from "@/components/workspace/DeployWorkspace";

export const metadata = {
  title: "Deploying your workspace",
};

/**
 * Post-signup workspace deployment.
 *
 * Onboarding hands off here after PAL intake; the client component runs the
 * UserOps pipeline and streams progress, then forwards to the dashboard.
 */
export default async function DeployPage() {
  const session = await getSessionUser();
  if (!session) redirect("/signin?next=/deploy");

  return <DeployWorkspace nextHref="/dashboard" />;
}
