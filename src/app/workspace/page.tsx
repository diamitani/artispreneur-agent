import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AgentWorkspace } from "@/components/workspace/agent/AgentWorkspace";

export const metadata = { title: "Workspace" };

/**
 * Agent Workspace — drop files, ask in plain language, approve what ships.
 * Every panel is driven by the ROSTR backend.
 */
export default async function WorkspacePage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/api/auth/login?return=/workspace");
  }
  return <AgentWorkspace />;
}
