import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

/** Account settings are part of the profile page. */
export default function DashboardSettingsPage() {
  redirect(ROUTES.profile);
}
