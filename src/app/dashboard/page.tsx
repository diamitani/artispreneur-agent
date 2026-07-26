import Link from "next/link";
import { FolderKanban, MessageSquare, BookOpen, Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const stats = [
  { label: "Active Tasks", value: 0 },
  { label: "Completed", value: 0 },
  { label: "Outputs", value: 0 },
  { label: "Messages", value: 0 },
];

const quickActions = [
  { label: "Create Project", href: ROUTES.projects, icon: FolderKanban },
  { label: "Chat with Agent", href: ROUTES.chat, icon: MessageSquare },
  { label: "Add Knowledge", href: ROUTES.knowledge, icon: BookOpen },
  { label: "Browse Skills", href: ROUTES.skills, icon: Sparkles },
];

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Welcome banner */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-[var(--font-display)] text-xl font-bold text-gray-900">
          Welcome back, Artist
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Your AI music business team is ready. What would you like to work on today?
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-crimson hover:shadow-md"
            >
              <action.icon className="h-6 w-6 text-crimson" />
              <span className="text-center text-xs font-medium text-gray-700">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Recent Activity</h3>
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-400">No recent activity yet</p>
          <p className="mt-1 text-xs text-gray-300">
            Start a project or chat with your agent to see activity here.
          </p>
        </div>
      </div>
    </div>
  );
}
