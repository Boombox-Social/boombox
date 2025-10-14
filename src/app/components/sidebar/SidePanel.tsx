import React from "react";
import { SidebarHeader } from "./SidebarHeader";
import { DashboardSection } from "./DashboardSection";
import { ClientList } from "./ClientList";
import { SidebarFooter } from "./SidebarFooter";
import { Client } from "../../types";

interface SidePanelProps {
  collapsed: boolean;
  onCollapse: () => void;
  clients: Client[];
  onAddClientClick: () => void;
  isLoading?: boolean;
  error?: string;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function SidePanel({
  collapsed,
  onCollapse,
  clients,
  onAddClientClick,
  isLoading = false,
  error,
  mobileOpen = false,
  setMobileOpen,
}: SidePanelProps) {

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`
          fixed inset-0 z-30 bg-[rgba(0,0,0,0.18)] transition-opacity duration-200
          ${mobileOpen ? "block md:hidden" : "hidden"}
        `}
        onClick={() => setMobileOpen && setMobileOpen(false)}
      />
      <aside
        className={`
          flex flex-col bg-[#23262F] text-[#F1F5F9] border-r border-[#2D3142]
          transition-all duration-200
          fixed top-0 left-0 h-screen
          ${mobileOpen ? "translate-x-0 z-50" : "-translate-x-full z-50"}
          md:translate-x-0
          w-[220px] 
          ${collapsed ? "md:w-[72px] md:z-40" : "md:w-[220px] md:z-50"}
          md:static
          overflow-y-auto
        `}
        style={{ minWidth: 0 }}
      >
        <SidebarHeader
          collapsed={mobileOpen ? false : collapsed}
          onCollapse={onCollapse}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <DashboardSection collapsed={mobileOpen ? false : collapsed} />
        {isLoading ? (
          <div className="flex items-center justify-center text-center text-[#94A3B8] text-sm flex-1 py-4 px-2">
            <div className="w-5 h-5 border-2 border-[#94A3B8] border-t-[#2563eb] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-center text-red-500 text-sm flex-1 py-4 px-2">
            {collapsed ? "!" : `Error: ${error}`}
          </div>
        ) : (
          <ClientList clients={clients} collapsed={mobileOpen ? false : collapsed} />
        )}
        <SidebarFooter collapsed={mobileOpen ? false : collapsed} onAddClientClick={onAddClientClick} />
      </aside>
    </>
  );
}