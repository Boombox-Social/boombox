"use client";
import React, { useState, useEffect } from "react";
import { getClientTheme, setClientTheme, Theme } from "../../lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = getClientTheme();
    setTheme(currentTheme);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setClientTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="bg-card rounded-lg shadow p-6 border border-border animate-pulse">
        <div className="h-6 bg-muted rounded w-32 mb-4"></div>
        <div className="h-12 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-4">
        Appearance
      </h3>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-card-foreground mb-3">
          Theme Preference
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => handleThemeChange("light")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
              theme === "light"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="font-medium text-sm text-foreground">
                Light
              </span>
              {theme === "light" && (
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => handleThemeChange("dark")}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
              theme === "dark"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <span className="font-medium text-sm text-foreground">
                Dark
              </span>
              {theme === "dark" && (
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        </div>
        <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
          Theme preference is saved for this session only. It will reset to Dark Mode when your session ends.
        </p>
      </div>
    </div>
  );
}