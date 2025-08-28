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

  // This single function is now the source of truth for loading data
  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select(`*, task_notes(*)`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else if (data) {
      const transformedTasks = data.map(task => ({
        ...task,
        notes: task.task_notes.sort((a: TaskNote, b: TaskNote) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || []
      }));
      setTasks(transformedTasks);
    }
    setLoading(false);
  };

  // This useEffect handles both the initial data load AND listens for realtime changes
  useEffect(() => {
    fetchTasks(); // Fetch initial data

    const channel = supabase
      .channel('public-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' }, // Listen for ANY change in our database
        (payload) => {
          console.log('Realtime change received!', payload);
          // When a change occurs, simply re-fetch all data to keep the UI in sync
          fetchTasks();
        }
      )
      .subscribe();

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // The empty array ensures this effect runs only once

  // --- THIS IS THE KEY MODIFIED FUNCTION ---
  // Updated addTask function for app/page.tsx
const addTask = async (
  text: string, 
  priority: "low" | "medium" | "high" = "medium",
  shouldEnhance: boolean = false
) => {
  if (shouldEnhance) {
    // **AI ENHANCEMENT MODE - FIRE AND FORGET**
    // When AI is enabled, we ONLY send to N8N and do nothing else
    console.log("AI Enhancement enabled. Sending to N8N workflow...");
    
    try {
      // Your actual N8N webhook URL
      const response = await fetch('https://sosopkhakadze.app.n8n.cloud/webhook/06accbd7-96d9-4dbe-ad88-f6f5af121f14', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          title: text, 
          priority: priority 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log("Successfully sent to N8N. Task will be created by workflow.");
    } catch (error) {
      console.error("Error sending to N8N:", error);
      // Optional: Show user notification that AI enhancement failed
      // You could add a toast notification here
    }
    
    // Important: Return early - do NOT create the task locally
    return; 
  }

  // **STANDARD MODE - Direct database insertion**
  // Only executed when AI enhancement is OFF
  console.log("Standard mode: Creating task directly in database...");
  
  try {
    const { error } = await supabase
      .from("tasks")
      .insert([{ 
        text, 
        priority, 
        completed: false 
      }]);

    if (error) {
      console.error("Error adding task:", error);
      throw error;
    }
    
    console.log("Task created successfully in standard mode");
  } catch (error) {
    console.error("Database error:", error);
    // Optional: Show user error notification
  }
};

  // --- ALL OTHER FUNCTIONS ARE NOW SIMPLIFIED ---
  // We no longer need to call setTasks() manually after each operation.
  // The realtime listener makes our code much cleaner.

  // Fixed toggleTask function for app/page.tsx
const toggleTask = async (id: string) => {
  // Find the task to update
  const taskToUpdate = tasks.find(task => task.id === id);
  if (!taskToUpdate) {
    console.error("Task not found:", id);
    return;
  }

  // Calculate the new completed state
  const newCompletedState = !taskToUpdate.completed;
  
  console.log(`Toggling task ${id}: ${taskToUpdate.completed} -> ${newCompletedState}`);

  try {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: newCompletedState })
      .eq("id", id);

    if (error) {
      console.error("Error toggling task:", error);
      throw error;
    }

    console.log("Task toggled successfully");
  } catch (error) {
    console.error("Failed to toggle task:", error);
    // Optional: Show user notification about the error
  }
};

  const editTask = async (id: string, newText: string) => {
    await supabase.from("tasks").update({ text: newText }).eq("id", id);
  };

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
  };

  const addTaskNote = async (taskId: string, content: string) => {
    await supabase.from("task_notes").insert([{ task_id: taskId, content }]);
  };

  const deleteTaskNote = async (taskId: string, noteId: string) => {
    await supabase.from("task_notes").delete().eq("id", noteId);
  };
  
  // --- The rest of your component remains the same ---

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