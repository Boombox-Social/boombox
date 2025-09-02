"use client";
import React from "react";

const colors = {
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
};

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
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
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
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-t-transparent`}
        style={{
          borderColor: colors.muted,
          borderTopColor: colors.accent,
        }}
      />
      {text && (
        <p
          className={textSizes[size]}
          style={{
            color: colors.muted,
            textAlign: "center",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
