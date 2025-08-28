// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { Header } from "@/components/Header";
import { Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // <-- IMPORT Supabase client

// ---
// STEP 1: Update the Task type to match our Supabase table
// `id` is now a string (UUID), and we'll use `created_at` to match the column name.
// ---
export type Task = {
  id: string;
  text: string;
  completed: boolean;
  created_at: string; // Changed from createdAt: Date
  priority: "low" | "medium" | "high";
};

export default function HomePage() {
  // The local state now starts empty and will be filled by data from Supabase.
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  // ---
  // STEP 2: Fetch tasks from Supabase when the component mounts
  // ---
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      // Select all tasks, ordered by the creation date so newest are first
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
      } else if (data) {
        setTasks(data);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []); // The empty dependency array means this runs once on mount

  // ---
  // STEP 3: Refactor all functions to be `async` and use Supabase
  // ---

  const addTask = async (text: string, priority: "low" | "medium" | "high" = "medium") => {
    // ---
    // THE FIX:
    // 1. Pass the new task as an object inside an array: `[{ ... }]`. This is the required syntax.
    // 2. Use `.select()` immediately after `.insert()`. This tells Supabase to perform the
    //    insert and then immediately return the full row that was just created, including
    //    the database-generated values like `id` and `created_at`.
    // ---
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ text, priority, completed: false }]) // <-- Use an array here
      .select()                                       // <-- And chain .select()
      .single(); // <-- .single() is a helper to get the first object from the returned array
  
    if (error) {
      console.error("Error adding task:", error);
      // You can add user-facing error handling here if you like
    } else if (data) {
      // Now `data` is the complete new task object from the database.
      // We can add it to our local state instantly. This is called an "optimistic update".
      setTasks((prevTasks) => [data, ...prevTasks]);
    }
  };

  const toggleTask = async (id: string) => { // id is now a string
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    // `update` the 'completed' status for the task where 'id' matches
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !taskToUpdate.completed })
      .eq("id", id);

    if (error) {
      console.error("Error toggling task:", error);
    } else {
      // Update the local state for instant UI feedback
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const editTask = async (id: string, newText: string) => { // id is now a string
    // `update` the 'text' for the task where 'id' matches
    const { error } = await supabase
      .from("tasks")
      .update({ text: newText })
      .eq("id", id);
    
    if (error) {
      console.error("Error editing task:", error);
    } else {
      // Update local state
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
      );
    }
  };

  const deleteTask = async (id: string) => { // id is now a string
    // `delete` the row where 'id' matches
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    
    if (error) {
      console.error("Error deleting task:", error);
    } else {
      // Update local state by filtering out the deleted task
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  // Calculate stats (this logic remains the same)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="fixed top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="fixed bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      
      <main className="relative max-w-4xl mx-auto py-8 px-4">
        <Header />

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

        <div className="space-y-8">
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <TaskInput onAddTask={addTask} />
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {/* We can show a loading spinner or skeleton here in the future */}
            {!loading && (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            )}
          </div>
        </div>

        {tasks.length === 0 && !loading && (
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