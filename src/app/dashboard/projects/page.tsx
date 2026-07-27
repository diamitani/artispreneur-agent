"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { EmptyState } from "@/components/shared/empty-state";
import { NewProjectModal } from "@/components/projects/new-project-modal";
import type { ProjectView } from "@/types/project";

export default function ProjectsPage() {
  const { projects, loading, error, createProject } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);

  function handleCreateProject(data: {
    name: string;
    description?: string;
    color: string;
    defaultView: ProjectView;
  }) {
    createProject(data);
    setModalOpen(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200" />
              <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="mt-4 flex items-center gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
                <div className="h-5 w-14 animate-pulse rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#AA0000]"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Project Grid or Empty State */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start organizing your work"
          actionLabel="New Project"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              {/* Color dot */}
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />

              {/* Name */}
              <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-[#CC0000]">
                {project.name}
              </h3>

              {/* Description */}
              {project.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {project.description}
                </p>
              )}

              {/* Footer */}
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                  {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 capitalize text-gray-600">
                  {project.status}
                </span>
                <span className="ml-auto">
                  {new Date(project.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
