"use client";

import { useState, useEffect } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { Header } from "@/components/Header";
import { Zap, TrendingUp, CheckCircle2 } from "lucide-react";

export type Task = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: "low" | "medium" | "high";
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      text: "Design landing page with modern UI components", 
      completed: false, 
      createdAt: new Date(),
      priority: "high"
    },
    { 
      id: 2, 
      text: "Write comprehensive API documentation", 
      completed: true, 
      createdAt: new Date(),
      priority: "medium"
    },
    { 
      id: 3, 
      text: "Prepare interactive sprint demo presentation", 
      completed: false, 
      createdAt: new Date(),
      priority: "high"
    },
  ]);

  const addTask = (text: string, priority: "low" | "medium" | "high" = "medium") => {
    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date(),
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id: number, newText: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen relative">
      {/* Floating elements for visual interest */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="fixed top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="fixed bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      
      <main className="relative max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <Header />

        {/* Hero section with enhanced styling */}
        <div className="text-center mt-12 mb-8 animate-fade-up">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="text-foreground"> AI</span>
            </h1>
            <div className="absolute -top-2 -right-2">
              <Zap className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Your <span className="text-blue-400 font-semibold">intelligent</span> task management hub with 
            <span className="text-purple-400 font-semibold"> AI-powered</span> productivity insights
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="glass rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalTasks}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{completedTasks}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-foreground">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="space-y-8">
          {/* Enhanced task input */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <TaskInput onAddTask={addTask} />
          </div>

          {/* Enhanced task list */}
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onEdit={editTask}
              onDelete={deleteTask}
            />
          </div>
        </div>

        {/* Floating action hints */}
        {tasks.length === 0 && (
          <div className="fixed bottom-8 right-8 max-w-sm">
            <div className="glass rounded-2xl p-4 text-sm text-muted-foreground animate-bounce">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>Start by adding your first task above!</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}