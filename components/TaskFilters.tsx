"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Filter = "all" | "todo" | "completed";

export function TaskFilters({
  onFilterChange,
  activeFilter,
}: {
  onFilterChange: (filter: Filter) => void;
  activeFilter?: Filter;
}) {
  const [active, setActive] = useState<Filter>("all");

  const current = activeFilter ?? active;

  const handleClick = (filter: Filter) => {
    setActive(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex justify-center gap-4 mt-8">
      <Button
          variant={current === "all" ? "default" : "outline"}
          onClick={() => handleClick("all")}
          className="cursor-pointer rounded-full px-4 py-1 transition-all duration-300 hover:bg-blue-500/20"
        >
          All
      </Button>

      <Button
        variant={current === "todo" ? "default" : "outline"}
        onClick={() => handleClick("todo")}
        className="cursor-pointer"
      >
        To-Do
      </Button>
      <Button
        variant={current === "completed" ? "default" : "outline"}
        onClick={() => handleClick("completed")}
        className="cursor-pointer"
      >
        Completed
      </Button>
    </div>
  );
}
