"use client";

import { useMemo, useState } from "react";
import { TaskItem } from "@/components/TaskItem";
import { TaskFilters } from "@/components/TaskFilters";
import { Task } from "@/app/page";
import { Search, SortAsc, Grid3X3, List, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
    tasks: Task[];
    onToggle: (id: string) => void;  
    onEdit: (id: string, newText: string) => void; 
    onDelete: (id: string) => void; 
  };

export function TaskList({ tasks, onToggle, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState<"all" | "todo" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "alphabetical">("created");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const visibleTasks = useMemo(() => {
    let filtered = tasks;

    // Apply text filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filter === "todo") {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter(task => task.completed);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "alphabetical":
          return a.text.localeCompare(b.text);
        case "created":
        default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [tasks, filter, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === "high" && !t.completed).length;

    return { total, completed, pending, highPriority };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-600/10 rounded-3xl blur-xl" />
        
        <div className="relative glass rounded-3xl p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-3">Ready to be productive?</h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
            Start by creating your first task above. Let's turn your ideas into achievements!
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>AI-powered suggestions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>Smart prioritization</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and controls */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-600/10 rounded-2xl blur-xl" />
        
        <div className="relative glass rounded-2xl p-6">
          {/* Stats row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Done</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              {stats.highPriority > 0 && (
                <>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{stats.highPriority}</div>
                    <div className="text-xs text-muted-foreground">High Priority</div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-9 w-9"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-9 w-9"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 bg-background/30 border-white/10 focus:border-blue-400/50"
              />
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === "created" ? "priority" : sortBy === "priority" ? "alphabetical" : "created")}
                className="bg-background/30 border-white/10 hover:bg-background/50"
              >
                <SortAsc className="w-4 h-4 mr-2" />
                {sortBy === "created" ? "Recent" : sortBy === "priority" ? "Priority" : "A-Z"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <TaskFilters onFilterChange={setFilter} activeFilter={filter} />

      {/* Task grid/list */}
      <div className={`${
        viewMode === "grid" 
          ? "grid grid-cols-1 lg:grid-cols-2 gap-4" 
          : "space-y-3"
      }`}>
        {visibleTasks.map((task, index) => (
          <div
            key={task.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <TaskItem
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      {/* Empty state for filtered results */}
      {visibleTasks.length === 0 && (searchQuery || filter !== "all") && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {searchQuery ? (
              <Search className="w-8 h-8 text-muted-foreground" />
            ) : filter === "completed" ? (
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            ) : (
              <Clock className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No matching tasks found" : `No ${filter} tasks`}
          </h3>
          <p className="text-muted-foreground">
            You don&apos;t have any {filter} tasks at the moment
          </p>
          {(searchQuery || filter !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
              className="mt-4"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}