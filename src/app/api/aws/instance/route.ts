import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getAwsHermesAgent,
  getAwsInstanceProfile,
  getAwsInstanceProject,
  instancePlaneStatus,
} from "@/lib/aws/instance-registry";
import { getHermesSnapshot } from "@/lib/hermes/runtime";
import { hubBackendLabel } from "@/lib/hub/store";

export const runtime = "nodejs";

/** AWS instance control-plane status for the signed-in workspace */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile, project, agent, hermes] = await Promise.all([
    getAwsInstanceProfile(session.sub),
    getAwsInstanceProject(session.sub, session.projectId),
    getAwsHermesAgent(session.sub),
    getHermesSnapshot(session.sub, session.projectId),
  ]);

  return NextResponse.json({
    ok: true,
    plane: instancePlaneStatus(),
    hub_backend: hubBackendLabel(),
    workspace_path: session.workspacePath,
    profile,
    project,
    agent,
    hermes: {
      soul_loaded: hermes.soul_loaded,
      pal_loaded: hermes.pal_loaded,
      active_skills: hermes.active_skills,
      completeness: hermes.completeness,
      runtime: hermes.runtime,
    },
  });
}
