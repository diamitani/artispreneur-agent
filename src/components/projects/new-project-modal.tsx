"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectView } from "@/types/project";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    color: string;
    defaultView: ProjectView;
  }) => void;
}

const colorSwatches = [
  "#CC0000",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#6b7280",
];

const viewOptions: { value: ProjectView; label: string }[] = [
  { value: "kanban", label: "Kanban" },
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
];

export function NewProjectModal({ open, onClose, onSubmit }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<string>(colorSwatches[0] ?? "#CC0000");
  const [defaultView, setDefaultView] = useState<ProjectView>("kanban");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      defaultView,
    });
    setName("");
    setDescription("");
    setColor(colorSwatches[0] ?? "#CC0000");
    setDefaultView("kanban");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">New Project</h2>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My new project"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this project about?"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000] resize-none"
                />
              </div>

              {/* Color */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="flex gap-2">
                  {colorSwatches.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => setColor(swatch)}
                      className={cn(
                        "h-8 w-8 rounded-full transition-transform",
                        color === swatch
                          ? "scale-110 ring-2 ring-offset-2"
                          : "hover:scale-105"
                      )}
                      style={{
                        backgroundColor: swatch,
                        // @ts-expect-error ring-color CSS custom property
                        "--tw-ring-color": color === swatch ? swatch : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Default View */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Default View
                </label>
                <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                  {viewOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDefaultView(option.value)}
                      className={cn(
                        "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                        defaultView === option.value
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#CC0000] px-4 py-2 text-sm font-medium text-white hover:bg-[#b00000] transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
