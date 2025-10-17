"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getClientTheme, Theme } from "../../lib/theme";

interface SidebarHeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
}

export function SidebarHeader({ collapsed, onCollapse, onMobileClose }: SidebarHeaderProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = getClientTheme();
    setTheme(currentTheme);

    // Listen for theme changes
    const handleStorageChange = () => {
      const newTheme = getClientTheme();
      setTheme(newTheme);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for theme changes within the same tab
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail as Theme);
    };
    
    window.addEventListener("themechange" as any, handleThemeChange as any);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themechange" as any, handleThemeChange as any);
    };
  }, []);

  // Choose logo based on theme
  const logoSrc = theme === "dark" 
    ? "/assets/images/boombox-logo.webp"  // Light logo for dark mode
    : "/assets/images/boombox-black.webp";   // Dark logo for light mode

  // Prevent flash during hydration
  if (!mounted) {
    return (
      <div className={`flex items-center justify-between p-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          {!collapsed && (
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image 
          src={logoSrc}
          alt="Boombox Logo" 
          width={collapsed ? 32 : 40}
          height={collapsed ? 32 : 40}
          className="rounded-full flex-shrink-0 transition-opacity duration-200"
          priority
        />
        {!collapsed && (
          <h1 className="text-lg font-bold text-foreground">Boombox</h1>
        )}
      </div>
      
      {/* Mobile Close Button */}
      <button
        onClick={onMobileClose}
        className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
        aria-label="Close menu"
      >
        <XMarkIcon className="w-5 h-5 text-foreground" />
      </button>

      {/* Desktop Collapse Button */}
      <button
        onClick={onCollapse}
        className="hidden md:block p-2 hover:bg-secondary rounded-lg transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          className={`w-5 h-5 text-foreground transition-transform ${collapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}