// components/sidebar/SidePanel.tsx
import React from "react";
import { Client } from "../../types";
import { COLORS, UI_CONFIG } from "../../constants";
import { SidebarHeader } from "./SidebarHeader";
import { DashboardSection } from "./DashboardSection";
import { ClientList } from "./ClientList";
import { SidebarFooter } from "./SidebarFooter";

interface SidePanelProps {
  collapsed: boolean;
  onCollapse: () => void;
  clients: Client[];
  onAddClientClick: () => void;
  isLoading?: boolean; // Add this property
  error?: string; // Add this property
}

export function SidePanel({
  collapsed,
  onCollapse,
  clients,
  onAddClientClick,
  isLoading = false, // Add default value
  error, // Add this parameter
}: SidePanelProps) {
  const sidebarStyle: React.CSSProperties = {
    background: COLORS.side,
    color: COLORS.text,
    width: collapsed
      ? UI_CONFIG.SIDEBAR_WIDTH.COLLAPSED
      : UI_CONFIG.SIDEBAR_WIDTH.EXPANDED,
    transition: `width ${UI_CONFIG.TRANSITION_DURATION}`,
    borderRight: `1px solid ${COLORS.border}`,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "fixed",
    zIndex: 10,
  };

  return (
    <aside style={sidebarStyle}>
      <SidebarHeader collapsed={collapsed} onCollapse={onCollapse} />
      <DashboardSection collapsed={collapsed} />

      {/* Show loading state, error, or client list */}
      {isLoading ? (
        <div
          style={{
            padding: collapsed ? "8px" : "16px",
            color: COLORS.muted,
            textAlign: "center",
            fontSize: "14px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: "20px",
                height: "20px",
                border: `2px solid ${COLORS.muted}`,
                borderTop: `2px solid ${COLORS.accent}`,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            <>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: `2px solid ${COLORS.muted}`,
                  borderTop: `2px solid ${COLORS.accent}`,
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "8px",
                }}
              />
              Loading clients...
            </>
          )}
        </div>
      ) : error ? (
        <div
          style={{
            padding: collapsed ? "8px" : "16px",
            color: "#EF4444",
            textAlign: "center",
            fontSize: "14px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {collapsed ? "!" : `Error: ${error}`}
        </div>
      ) : (
        <ClientList clients={clients} collapsed={collapsed} />
      )}

      <SidebarFooter
        collapsed={collapsed}
        onAddClientClick={onAddClientClick}
      />

      {/* Add spinning animation */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </aside>
  );
}
