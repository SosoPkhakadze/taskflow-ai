"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 max-w-2xl mx-auto rounded-lg bg-[var(--card)] shadow-md shadow-blue-500/20 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-white">TaskFlow AI</h1>
      <Button
        variant="ghost"
        onClick={toggleTheme}
        className={`cursor-pointer p-2 rounded-full transition-colors duration-300
          ${theme === "dark" ? "bg-blue-600 hover:bg-blue-500" : "bg-yellow-400 hover:bg-yellow-300"}
        `}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-white" />
        ) : (
          <Moon className="w-5 h-5 text-white" />
        )}
      </Button>
    </header>
  );
}
