"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Sparkles } from "lucide-react";

export function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  if (!mounted) return null;

  return (
    <header className="relative">
      {/* Animated background blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-600/10 rounded-2xl blur-xl" />
      
      <div className="relative glass rounded-2xl p-6 mx-auto max-w-2xl animate-fade-up">
        <div className="flex justify-between items-center">
          {/* Logo section with enhanced styling */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                TaskFlow AI
              </h1>
              <p className="text-xs text-muted-foreground">Intelligent Task Management</p>
            </div>
          </div>

          {/* Enhanced theme toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative group h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              {/* Animated background */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              
              {/* Theme icons with smooth transition */}
              <div className="relative">
                <Sun 
                  className={`absolute w-5 h-5 transition-all duration-500 ${
                    theme === "light" 
                      ? "rotate-0 scale-100 text-yellow-500" 
                      : "rotate-90 scale-0 text-yellow-500"
                  }`} 
                />
                <Moon 
                  className={`absolute w-5 h-5 transition-all duration-500 ${
                    theme === "dark" 
                      ? "rotate-0 scale-100 text-blue-400" 
                      : "-rotate-90 scale-0 text-blue-400"
                  }`} 
                />
              </div>
              
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
            </Button>
          </div>
        </div>
        
        {/* Subtle bottom gradient line */}
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
    </header>
  );
}