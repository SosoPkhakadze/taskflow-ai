"use client";

import { useMemo, useState } from "react";
import { TaskItem } from "@/components/TaskItem";
import { TaskFilters } from "@/components/TaskFilters";
import { Task } from "@/app/page";

type Props = {
  tasks: Task[];
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
};

export function TaskList({ tasks, onToggle, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState<"all" | "todo" | "completed">("all");

  const visibleTasks = useMemo(() => {
    if (filter === "todo") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="mt-8 space-y-4">
      <TaskFilters onFilterChange={setFilter} />
      <div className="mt-4 grid gap-3">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {visibleTasks.length === 0 && (
          <p className="text-gray-500 text-center">No tasks found.</p>
        )}
      </div>
    </div>
  );
}
