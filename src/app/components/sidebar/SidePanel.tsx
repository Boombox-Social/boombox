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
}

export function SidePanel({
  collapsed,
  onCollapse,
  clients,
  onAddClientClick,
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
      <ClientList clients={clients} collapsed={collapsed} />
      <SidebarFooter
        collapsed={collapsed}
        onAddClientClick={onAddClientClick}
      />
    </aside>
  );
}
