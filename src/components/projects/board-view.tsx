"use client";

import type { Task } from "@/types/task";
import { TaskCard } from "./task-card";

interface BoardViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function BoardView({ tasks, onTaskClick }: BoardViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          variant="board"
          onClick={() => onTaskClick(task)}
        />
      ))}
    </div>
  );
}
