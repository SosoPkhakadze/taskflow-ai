"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Save, X, Sparkles, Type } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialText: string;
  onSave: (text: string) => void;
};

export function EditTaskDialog({ open, onOpenChange, initialText, onSave }: Props) {
  const [text, setText] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setText(initialText);
  }, [initialText, open]);

  const handleSave = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    // Simulate a brief save operation for UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onSave(text.trim());
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass border-2 border-white/20 shadow-2xl">
        {/* Header */}
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Type className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Edit Task
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Make changes to your task details
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Task Description
            </label>
            <div className="relative">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what needs to be done..."
                className="text-base h-12 bg-background/30 border-2 border-white/10 focus:border-blue-400/50 rounded-xl transition-all duration-300"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="text-xs text-muted-foreground">
                  {text.length}/200
                </div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <kbd className="px-2 py-1 bg-background/30 rounded border border-white/10">⌘</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-background/30 rounded border border-white/10">Enter</kbd>
            <span>to save</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 hover:bg-red-500/10 hover:text-red-400"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!text.trim() || isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}