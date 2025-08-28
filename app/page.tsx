// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskList } from "@/components/TaskList";
import { Header } from "@/components/Header";
import { Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export type TaskNote = {
  id: string;
  task_id: string;
  content: string;
  created_at: string;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  priority: "low" | "medium" | "high";
  notes?: TaskNote[];
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      
      // Fetch tasks with their notes
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          task_notes (
            id,
            task_id,
            content,
            created_at
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
      } else if (data) {
        // Transform the data to match our Task type
        const transformedTasks = data.map(task => ({
          ...task,
          notes: task.task_notes || []
        }));
        setTasks(transformedTasks);
      }
      
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const enhanceTaskTitle = async (title: string): Promise<string> => {
    try {
      const response = await fetch('https://sosopkhakadze.app.n8n.cloud/webhook/06accbd7-96d9-4dbe-ad88-f6f5af121f14', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the webhook returns the enhanced title in a 'enhanced_title' field
        return data.enhanced_title || data.title || title;
      } else {
        console.error('Failed to enhance task title:', response.statusText);
        return title; // Fallback to original title
      }
    } catch (error) {
      console.error('Error enhancing task title:', error);
      return title; // Fallback to original title
    }
  };

  const addTask = async (
    text: string, 
    priority: "low" | "medium" | "high" = "medium",
    shouldEnhance: boolean = false
  ) => {
    let finalTitle = text;
    
    // Enhance the title if requested
    if (shouldEnhance) {
      finalTitle = await enhanceTaskTitle(text);
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ text: finalTitle, priority, completed: false }])
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
    } else if (data) {
      // Add the new task with empty notes array
      setTasks((prevTasks) => [{ ...data, notes: [] }, ...prevTasks]);
    }
  };

  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !taskToUpdate.completed })
      .eq("id", id);

    if (error) {
      console.error("Error toggling task:", error);
    } else {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const editTask = async (id: string, newText: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ text: newText })
      .eq("id", id);

    if (error) {
      console.error("Error editing task:", error);
    } else {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const addTaskNote = async (taskId: string, content: string) => {
    const { data, error } = await supabase
      .from("task_notes")
      .insert([{ task_id: taskId, content }])
      .select()
      .single();

    if (error) {
      console.error("Error adding note:", error);
    } else if (data) {
      // Update the local state
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, notes: [...(task.notes || []), data] }
            : task
        )
      );
    }
  };

  const deleteTaskNote = async (taskId: string, noteId: string) => {
    const { error } = await supabase
      .from("task_notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      console.error("Error deleting note:", error);
    } else {
      // Update the local state
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, notes: task.notes?.filter(note => note.id !== noteId) || [] }
            : task
        )
      );
    }
  };

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
            Your <span className="text-blue-400 font-semibold">intelligent</span> task management hub with{" "}
            <span className="text-purple-400 font-semibold">AI-powered</span> productivity insights
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
            {!loading && (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={deleteTask}
                onAddNote={addTaskNote}
                onDeleteNote={deleteTaskNote}
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