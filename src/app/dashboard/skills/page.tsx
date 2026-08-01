import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

/** Skills live in the marketplace library, which owns the install/activate UI. */
export default function DashboardSkillsPage() {
  redirect(ROUTES.skillsLibrary);
}
