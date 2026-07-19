import { WorkspaceMissionControl } from "@/components/workspace/WorkspaceMissionControl";

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string }>;
}) {
  const { artist } = await searchParams;
  return <WorkspaceMissionControl artistId={artist} />;
}
