"use client";

import Link from "next/link";

interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  /** Navigates. Takes precedence over `onAction` when both are supplied. */
  actionHref?: string;
  onAction?: () => void;
}

const ACTION_CLASS =
  "mt-4 inline-block rounded-lg bg-[#CC0000] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b00000]";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <Icon size={48} className="mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={ACTION_CLASS}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <button onClick={onAction} className={ACTION_CLASS}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
