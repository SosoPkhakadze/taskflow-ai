"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePenLine, Trash2, Clock, Flag, StickyNote, Plus, X } from "lucide-react";
import { Task, TaskNote } from "@/app/page";
import { EditTaskDialog } from "./EditTaskDialog";
import { useState } from "react";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  onAddNote: (taskId: string, content: string) => void;
  onDeleteNote: (taskId: string, noteId: string) => void;
};

export function TaskItem({ task, onToggle, onEdit, onDelete, onAddNote, onDeleteNote }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // ✨ FIX: Create a safe priority value that defaults to 'medium' if task.priority is null or undefined.
  // This prevents the application from crashing if a task has bad data.
  const safePriority = task.priority || 'medium';

  const priorityConfig = {
    low: { color: "from-green-500 to-green-600", bg: "bg-green-500/10", text: "text-green-400" },
    medium: { color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10", text: "text-yellow-400" },
    high: { color: "from-red-500 to-pink-500", bg: "bg-red-500/10", text: "text-red-400" }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleAddNote = async () => {
    if (newNote.trim()) {
      setIsAddingNote(true);
      try {
        await onAddNote(task.id, newNote.trim());
        setNewNote("");
      } catch (error) {
        console.error("Error adding note:", error);
      } finally {
        setIsAddingNote(false);
      }
    }
  };

  const handleNoteKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const noteCount = task.notes?.length || 0;
  const maxNotes = 5; // Maximum 5 notes per task

  return (
    <>
      <div 
        className="group relative animate-fade-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background glow */}
        <div 
          className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
            task.completed 
              ? "bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"
              : "bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"
          } ${isHovered ? "scale-105 opacity-100" : "scale-100 opacity-50"} blur-xl`} 
        />
        
        <Card className={`relative glass border-2 transition-all duration-300 hover:shadow-2xl ${
          task.completed 
            ? "border-green-500/30 bg-green-500/5"
            : "border-white/10 hover:border-blue-400/30"
        } ${isHovered ? "scale-[1.02] shadow-xl" : "scale-100"} rounded-2xl overflow-hidden`}>
          {/* Priority indicator bar */}
          {/* ✨ FIX: Use the 'safePriority' variable here to prevent crash */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${priorityConfig[safePriority].color} ${
            task.completed ? "opacity-50" : "opacity-100"
          }`} />
          
          <div className="p-6">
            <div className="flex items-start justify-between">
              {/* Left section - Checkbox and content */}
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                {/* Enhanced checkbox */}
                <div className="relative pt-1">
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      console.log('Wrapper onClick triggered:', {
                        taskId: task.id,
                        currentCompleted: task.completed
                      });
                      e.stopPropagation();
                      onToggle(task.id);
                    }}
                  >
                    <Checkbox
                      checked={task.completed}
                      // Remove onCheckedChange completely - handle it with wrapper onClick
                      className={`transition-all duration-300 ${
                        task.completed 
                          ? "bg-green-500 border-green-500 scale-110"
                          : "border-white/30 hover:border-blue-400/50"
                      } w-5 h-5 pointer-events-none`}
                    />
                  </div>
                  {task.completed && (
                    <div className="absolute inset-0 rounded bg-green-500/20 animate-ping pointer-events-none" />
                  )}
                </div>
                
                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className={`text-lg font-medium transition-all duration-300 ${
                      task.completed 
                        ? "line-through text-muted-foreground/70"
                        : "text-foreground group-hover:text-blue-400"
                    } break-words`}>
                      {task.text}
                    </p>
                  </div>
                  
                  {/* Task metadata */}
                  <div className="flex items-center space-x-4 mt-3">
                    {/* Priority badge */}
                    {/* ✨ FIX: Use the 'safePriority' variable here as well */}
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[safePriority].bg} ${priorityConfig[safePriority].text}`}>
                      <Flag className="w-3 h-3" />
                      <span className="capitalize">{safePriority}</span>
                    </div>
                    
                    {/* Time indicator */}
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(task.created_at)}</span>
                    </div>

                    {/* Notes indicator */}
                    {noteCount > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-purple-400">
                        <StickyNote className="w-3 h-3" />
                        <span>{noteCount} note{noteCount !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right section - Action buttons */}
              <div className={`flex items-center space-x-1 transition-all duration-300 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-purple-500/20 transition-all duration-300 group/btn"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  <StickyNote className="w-4 h-4 text-muted-foreground group-hover/btn:text-purple-400 transition-colors duration-300" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-blue-500/20 transition-all duration-300 group/btn"
                  onClick={() => setIsEditing(true)}
                >
                  <FilePenLine className="w-4 h-4 text-muted-foreground group-hover/btn:text-blue-400 transition-colors duration-300" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-red-500/20 transition-all duration-300 group/btn"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground group-hover/btn:text-red-400 transition-colors duration-300" />
                </Button>
              </div>
            </div>

            {/* Notes section */}
            {showNotes && (
              <div className="mt-6 space-y-4 animate-fade-in border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center">
                    <StickyNote className="w-4 h-4 mr-2 text-purple-400" />
                    Notes ({noteCount}/{maxNotes})
                  </h4>
                </div>

                {/* Existing notes */}
                {task.notes && task.notes.length > 0 && (
                  <div className="space-y-2">
                    {task.notes.map((note, index) => (
                      <div
                        key={note.id}
                        className="p-3 bg-background/50 rounded-lg border border-white/10 group/note hover:border-purple-400/30 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-foreground/80 flex-1 whitespace-pre-wrap">
                            {note.content}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover/note:opacity-100 transition-opacity duration-200 hover:bg-red-500/20 ml-2 flex-shrink-0"
                            onClick={() => onDeleteNote(task.id, note.id)}
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {formatTimeAgo(note.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new note */}
                {noteCount < maxNotes && (
                  <div className="flex space-x-2">
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyPress={handleNoteKeyPress}
                      placeholder="Add a note..."
                      className="flex-1 bg-background/30 border-white/10 focus:border-purple-400/50"
                      disabled={isAddingNote}
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || isAddingNote}
                      size="sm"
                      className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
                    >
                      {isAddingNote ? (
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}

                {noteCount >= maxNotes && (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    Maximum number of notes reached ({maxNotes})
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Hover effect overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          } pointer-events-none rounded-2xl`} />
        </Card>
      </div>
      
      <EditTaskDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        initialText={task.text}
        onSave={(newText: string) => onEdit(task.id, newText)}
      />
    </>
  );
}