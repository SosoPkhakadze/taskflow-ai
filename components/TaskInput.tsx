"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TaskInput({ onAddTask }: { onAddTask: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAddTask(text.trim());
    setText("");
  };

  return (
    <div className="flex gap-2 mt-8">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g., Launch the new marketing campaign by Friday"
        className="flex-1"
      />
      <Button onClick={handleAdd} className="cursor-pointer">
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
}
