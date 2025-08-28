"use client";

import { useState } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { Header } from "@/components/Header";

export type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Design landing page", completed: false },
    { id: 2, text: "Write API docs", completed: true },
    { id: 3, text: "Prepare sprint demo", completed: false },
  ]);

  // Add a new task
  const addTask = (text: string) => {
    const newTask: Task = { id: Date.now(), text, completed: false };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle task completed status
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Edit a task's text
  const editTask = (id: number, newText: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  // Delete a task
  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="max-w-2xl mx-auto py-8">
      {/* Header with theme toggle */}
      <Header />

      {/* Page title */}
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          TaskFlow AI
        </h1>
        <p className="mt-2 text-lg text-blue-400">
          Your Intelligent Task Management Hub
        </p>
      </div>

      {/* Add task input */}
      <TaskInput onAddTask={addTask} />

      {/* Task list with filters and actions */}
      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onEdit={editTask}
        onDelete={deleteTask}
      />
    </main>
  );
}
