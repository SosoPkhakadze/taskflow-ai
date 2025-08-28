"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Target, Sparkles, Loader2, CheckCircle } from "lucide-react";

export function TaskInput({ 
  onAddTask 
}: { 
  onAddTask: (text: string, priority?: "low" | "medium" | "high", shouldEnhance?: boolean) => Promise<void>
}) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isExpanded, setIsExpanded] = useState(false);
  const [enhanceEnabled, setEnhanceEnabled] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleAdd = async () => {
    if (text.trim()) {
      setIsAdding(true);
      try {
        await onAddTask(text.trim(), priority, enhanceEnabled);
        
        // Clear form after successful submission
        setText("");
        setPriority("medium");
        
        // Show different success behavior based on enhancement mode
        if (enhanceEnabled) {
          // For AI enhancement, show a message that task will appear soon
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 4000);
        }
        
        // Don't reset enhancement toggle - let user decide
        setIsExpanded(false);
        
      } catch (error) {
        console.error("Error adding task:", error);
        // You could add error toast notification here
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const priorityConfig = {
    low: { color: "from-green-500 to-green-600", icon: Target, label: "Low" },
    medium: { color: "from-yellow-500 to-orange-500", icon: Zap, label: "Medium" },
    high: { color: "from-red-500 to-pink-500", icon: Sparkles, label: "High" }
  };

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-blue-600/20 rounded-3xl blur-xl" />
      
      <div className="relative glass rounded-3xl p-6 shadow-2xl">
        {/* Success message for AI enhancement */}
        {showSuccessMessage && enhanceEnabled && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20 animate-fade-in">
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>Task sent for AI enhancement! It will appear in your list shortly.</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Add New Task</h3>
              <p className="text-sm text-muted-foreground">
                {enhanceEnabled 
                  ? "AI will enhance your task for better clarity" 
                  : "What would you like to accomplish?"
                }
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? "Less" : "More"}
          </Button>
        </div>

        {/* Main input area */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={enhanceEnabled 
                ? "e.g., Design landing page (AI will enhance this)" 
                : "e.g., Design a stunning landing page for the product launch..."
              }
              className="text-lg h-14 pl-6 pr-32 bg-background/50 border-2 border-white/10 focus:border-blue-400/50 rounded-2xl placeholder:text-muted-foreground/70 transition-all duration-300"
              disabled={isAdding}
            />
            
            {/* Quick add button */}
            <Button
              onClick={handleAdd}
              disabled={!text.trim() || isAdding}
              className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {enhanceEnabled ? "Sending to AI..." : "Adding..."}
                </>
              ) : (
                <>
                  {enhanceEnabled ? <Sparkles className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {enhanceEnabled ? "Enhance" : "Add"}
                </>
              )}
            </Button>
          </div>

          {/* Expanded options */}
          {isExpanded && (
            <div className="animate-scale-in space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Priority Level</label>
                <div className="flex items-center space-x-1">
                  {(Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>).map((level) => {
                    const config = priorityConfig[level];
                    const Icon = config.icon;
                    return (
                      <button
                        key={level}
                        onClick={() => setPriority(level)}
                        disabled={isAdding}
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          priority === level
                            ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105`
                            : "bg-background/30 text-muted-foreground hover:bg-background/50"
                        } disabled:opacity-50`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{config.label}</span>
                        </div>
                        {priority === level && (
                          <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Enhancement Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">AI Enhancement</label>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">
                    {enhanceEnabled ? "ON" : "OFF"}
                  </span>
                  <button
                    onClick={() => setEnhanceEnabled(!enhanceEnabled)}
                    disabled={isAdding}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                      enhanceEnabled ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        enhanceEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {enhanceEnabled && (
                <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-start space-x-2 text-sm">
                    <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-blue-400 font-medium">AI Enhancement Mode Active</div>
                      <div className="text-blue-300/80 mt-1">
                        Your task will be processed by AI and added automatically with improved clarity and actionability.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Character count and shortcuts */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-muted-foreground">
            {text.length > 0 && (
              <span>
                {text.length} characters • Press Enter to {enhanceEnabled ? "send for enhancement" : "add"}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <kbd className="px-2 py-1 bg-background/30 rounded-md border border-white/10">⌘</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-background/30 rounded-md border border-white/10">Enter</kbd>
            <span>to quick {enhanceEnabled ? "enhance" : "add"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}