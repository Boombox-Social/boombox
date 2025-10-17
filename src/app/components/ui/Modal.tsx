"use client";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getClientTheme, Theme } from "../../lib/theme";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  maxWidth,
}: ModalProps) {
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  // Use maxWidth if provided, otherwise use size
  const widthClass = maxWidth || sizeClasses[size];

  // Get background color based on theme
  const backgroundColor = theme === "dark" ? "rgb(35, 38, 47)" : "rgb(248, 250, 252)";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full ${widthClass}
            bg-card rounded-xl shadow-2xl border border-border
            transform transition-all
            animate-in fade-in slide-in-from-bottom-4 duration-300
          `}
          style={{
            backgroundColor: backgroundColor
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Only show if title is provided */}
          {title && (
            <div 
              className="flex items-center justify-between p-6 border-b border-border"
              style={{
                backgroundColor: backgroundColor
              }}
            >
              <h2 className="text-xl font-semibold text-foreground">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            </div>
          )}

          {/* Content */}
          <div 
            className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            style={{
              backgroundColor: backgroundColor
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}