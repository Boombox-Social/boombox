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
          fixed inset-0 z-30 transition-opacity duration-300
          ${mobileOpen ? "block md:hidden" : "hidden"}
        `}
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(2px)",
        }}
        onClick={() => setMobileOpen && setMobileOpen(false)}
      />
      <aside
        className={`
          flex flex-col transition-all duration-300 ease-in-out
          fixed top-0 left-0 h-screen
          ${mobileOpen ? "translate-x-0 z-50" : "-translate-x-full z-50"}
          md:translate-x-0
          w-[260px] 
          ${collapsed ? "md:w-[64px] md:z-40" : "md:w-[260px] md:z-50"}
          overflow-hidden
        `}
        style={{
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <SidebarHeader
          collapsed={mobileOpen ? false : collapsed}
          onCollapse={onCollapse}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <DashboardSection collapsed={mobileOpen ? false : collapsed} />

        {/* Scrollable content area */}
        <div 
          className="flex-1 overflow-y-auto flex flex-col"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background: var(--border);
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: var(--muted);
            }
          `}</style>
          {isLoading ? (
            <div 
              className="flex items-center justify-center text-center text-sm flex-1 py-8 px-4"
              style={{ color: "var(--muted)" }}
            >
              <div 
                className="w-6 h-6 rounded-full animate-spin"
                style={{
                  border: "2px solid var(--border)",
                  borderTopColor: "var(--primary)",
                }}
              />
            </div>
          ) : error ? (
            <div 
              className="flex items-center justify-center text-center text-sm flex-1 py-8 px-4"
              style={{ color: "var(--danger)" }}
            >
              {collapsed ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <span>Error: {error}</span>
              )}
            </div>
          ) : (
            <ClientList clients={clients} collapsed={mobileOpen ? false : collapsed} />
          )}
        </div>

        <SidebarFooter collapsed={mobileOpen ? false : collapsed} onAddClientClick={onAddClientClick} />
      </aside>
    </>
  );
}