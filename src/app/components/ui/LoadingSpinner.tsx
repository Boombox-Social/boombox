"use client";
import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

export function LoadingSpinner({ size = "medium", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  const borderWidth = {
    small: "2px",
    medium: "3px",
    large: "4px",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 20,
      }}
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full`}
        style={{
          border: `${borderWidth[size]} solid var(--border)`,
          borderTopColor: "var(--primary)",
        }}
      />
      {text && (
        <p
          className={textSizes[size]}
          style={{
            color: "var(--muted)",
            textAlign: "center",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}