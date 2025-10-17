"use client";
import React from "react";
import { SidebarHeader } from "./SidebarHeader";
import { DashboardSection } from "./DashboardSection";
import { ClientList } from "./ClientList";
import { SidebarFooter } from "./SidebarFooter";
import type { Client } from "../../types";

interface SidePanelProps {
  collapsed: boolean;
  onCollapse: () => void;
  clients: Client[];
  onAddClientClick: () => void;
  isLoading?: boolean;
  error?: string | null;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function SidePanel({
  collapsed,
  onCollapse,
  clients,
  onAddClientClick,
  isLoading = false,
  error = null,
  mobileOpen,
  setMobileOpen,
}: SidePanelProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full
          bg-card
          border-r border-border
          transition-all duration-200 z-50
          ${collapsed ? "w-[72px]" : "w-[220px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          backgroundColor: 'rgb(var(--card))'
        }}
      >
        {/* Inner container with explicit background */}
        <div className="flex flex-col h-full bg-card"
          style={{
            backgroundColor: 'rgb(var(--card))'
          }}
        >
          <SidebarHeader
            collapsed={collapsed}
            onCollapse={onCollapse}
            onMobileClose={() => setMobileOpen(false)}
          />

          <div className="flex-1 overflow-y-auto bg-card">
            <DashboardSection collapsed={collapsed} />
            <ClientList
              clients={clients}
              collapsed={collapsed}
              onAddClient={onAddClientClick}
              isLoading={isLoading}
              error={error}
            />
          </div>

          <SidebarFooter collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}