"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2 } from "lucide-react";
import { Task } from "@/app/page";
import { EditTaskDialog } from "./EditTaskDialog";
import { useState } from "react";

type Props = {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Card className="flex items-center justify-between p-4 bg-[var(--card)] border border-gray-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 rounded-xl">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="transition-transform duration-200"
        />
        <span
          className={`transition-all duration-200 ${
            task.completed
              ? "line-through text-gray-400"
              : "text-[var(--foreground)]"
          }`}
        >
          {task.text}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
      size="icon"
      className="hover:bg-blue-500/20 cursor-pointer rounded-full transition-all duration-300"
          onClick={() => setIsEditing(true)}
        >
          <FilePenLine className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors duration-300" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-500/20 cursor-pointer rounded-full transition-all duration-300"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors duration-300" />
        </Button>
      </div>
    </Card>
      
        

      <EditTaskDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        initialText={task.text}
        onSave={(newText: string) => onEdit(task.id, newText)}
      />
    </>
  );
}
