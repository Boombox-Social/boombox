// components/sidebar/DashboardSection.tsx
import React from "react";
import { HomeIcon } from "@heroicons/react/24/solid";
import { Client } from "../../types";
import { COLORS } from "../../constants";

interface DashboardSectionProps {
  collapsed: boolean;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
}

export function DashboardSection({
  collapsed,
  selectedClient,
  setSelectedClient,
}: DashboardSectionProps) {
  return (
    <div
      style={{
        padding: collapsed ? "0 8px" : "0 20px",
        marginBottom: 8,
      }}
    >
      <button
        onClick={() => setSelectedClient(null)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: selectedClient == null ? COLORS.hover : COLORS.card,
          color: COLORS.text,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: collapsed ? 8 : "8px 12px",
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
          justifyContent: collapsed ? "center" : "flex-start",
          marginBottom: 8,
        }}
        aria-label={collapsed ? "Dashboard" : undefined}
      >
        <HomeIcon width={20} />
        {!collapsed && "Dashboard"}
      </button>

      {!collapsed && (
        <input
          type="text"
          placeholder="Search for clients"
          style={{
            width: "100%",
            padding: "6px 12px",
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.bg,
            color: COLORS.text,
            marginBottom: 12,
            fontSize: 14,
          }}
        />
      )}
    </div>
  );
}
