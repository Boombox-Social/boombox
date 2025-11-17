"use client";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useTheme } from "@/app/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9" aria-hidden="true">
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors hover:bg-secondary"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon className="w-5 h-5 text-muted hover:text-foreground transition-colors" />
      ) : (
        <MoonIcon className="w-5 h-5 text-muted hover:text-foreground transition-colors" />
      )}
    </button>
  );
}