import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CommandCenter } from "@/components/workspace/agent/CommandCenter";

export const metadata = { title: "Your Command Center" };

/**
 * Workspace — the Dashboard.html command center, powered by the ROSTR
 * pipeline and AWS AgentCore (compile → provision → execute → approve).
 */
export default async function WorkspacePage() {
  const session = await getSessionUser();
  if (!session) redirect("/api/auth/login?return=/workspace");
  return <CommandCenter />;
}
