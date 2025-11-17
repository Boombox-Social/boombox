import React from "react";
import { ActionButtonProps } from "../../types";

export function ActionButton({
  onClick,
  variant,
  collapsed,
  icon,
  text,
}: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      className="w-full transition-all duration-200"
      style={{
        background: isPrimary ? "var(--primary)" : "transparent",
        color: isPrimary ? "var(--primary-foreground)" : "var(--card-foreground)",
        border: isPrimary ? "none" : "2px solid var(--border)",
        borderRadius: 6,
        padding: collapsed ? 8 : "10px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        minWidth: collapsed ? 48 : undefined,
        minHeight: 40,
        boxShadow: isPrimary ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
      }}
      onMouseEnter={(e) => {
        if (isPrimary) {
          e.currentTarget.style.background = "#1E40AF";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(37, 99, 235, 0.2)";
          e.currentTarget.style.transform = "translateY(-1px)";
        } else {
          e.currentTarget.style.background = "var(--secondary)";
          e.currentTarget.style.borderColor = "var(--primary)";
        }
      }}
      onMouseLeave={(e) => {
        if (isPrimary) {
          e.currentTarget.style.background = "var(--primary)";
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
          e.currentTarget.style.transform = "translateY(0)";
        } else {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "var(--border)";
        }
      }}
      aria-label={collapsed ? text : undefined}
    >
      {collapsed ? icon : text}
    </button>
  );
}