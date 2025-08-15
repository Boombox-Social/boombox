// components/sidebar/SidebarHeader.tsx
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { COLORS } from "../../constants";

interface SidebarHeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
}

export function SidebarHeader({ collapsed, onCollapse }: SidebarHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: collapsed ? "24px 0 16px 0" : "16px 20px",
        gap: 12,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: COLORS.accent,
        }}
      />
      {!collapsed && <span style={{ fontWeight: 600 }}>Boombox Marketing</span>}
      {!collapsed && (
        <button
          onClick={onCollapse}
          style={{
            marginLeft: 8,
            background: COLORS.side,
            color: COLORS.text,
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "none",
          }}
          aria-label="Collapse sidebar"
        >
          <ChevronLeftIcon width={20} />
        </button>
      )}
    </div>
  );
}
