import React from "react";

interface OpenDetailsButtonProps {
  onClick: () => void;
}

export function OpenDetailsButton({ onClick }: OpenDetailsButtonProps) {
  return (
    <button
      className="w-full px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
      style={{
        background: "var(--primary)",
        color: "var(--primary-foreground)",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1E40AF";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--primary)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      Open Details
    </button>
  );
}