"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return { mounted, isDark, toggleTheme };
}

/**
 * Icon-only day/night toggle button.
 * Use standalone (e.g. landing page footer).
 */
export function ThemeToggle({ className }) {
  const { mounted, isDark, toggleTheme } = useThemeToggle();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {!mounted ? null : isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

/**
 * Day/night toggle row for dropdown menus (avatar menus, sidebar footer).
 */
export function ThemeToggleMenuItem({ className }) {
  const { mounted, isDark, toggleTheme } = useThemeToggle();

  return (
    <DropdownMenuItem className={cn("cursor-pointer", className)} onSelect={toggleTheme}>
      {!mounted ? null : isDark ? (
        <Sun className="mr-2 h-4 w-4" />
      ) : (
        <Moon className="mr-2 h-4 w-4" />
      )}
      <span>{mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Theme"}</span>
    </DropdownMenuItem>
  );
}
