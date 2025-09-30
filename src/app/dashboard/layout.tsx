"use client";
import React, { useState } from "react";
import { useClientManagement, useModal } from "../hooks";
import { NewClientForm } from "../types";
import { AddClientModal } from "../components/modals/AddClientModal";
import { SidePanel } from "../components/sidebar/SidePanel";
import { UserNav } from "../components/header/UserNav";

function BurgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fixed top-4 left-2 z-40 md:hidden text-[#F1F5F9] rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
      onClick={onClick}
      aria-label="Open sidebar"
    >
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { clients, addClient, isLoading, error } = useClientManagement();
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop logic
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false); // mobile overlay

  return (
    <div className="flex min-h-screen relative">
      {/* Burger icon for mobile */}
      {!sidebarMobileOpen && (
        <BurgerButton onClick={() => setSidebarMobileOpen(true)} />
      )}

      {/* SidePanel: overlay on mobile, normal on desktop */}
      <SidePanel
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(true)}
        clients={clients}
        onAddClientClick={openModal}
        isLoading={isLoading}
        error={error}
        mobileOpen={sidebarMobileOpen}
        setMobileOpen={setSidebarMobileOpen}
      />

      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="hidden md:flex fixed top-4 left-[80px] z-30 text-[#F1F5F9] rounded-full w-10 h-10 items-center justify-center shadow-lg"
          aria-label="Expand sidebar"
          style={{ transition: "left 0.2s" }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 5l8 7-8 7" />
          </svg>
        </button>
      )}

      {/* Main content */}
      <main
        className={`
          flex-1 bg-[#181A20] min-h-screen transition-all
          ml-0 [${sidebarCollapsed ? "72px" : "220px"}]
          p-6
        `}
      >
        {children}
      </main>

      <AddClientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={async (clientData: NewClientForm) => {
          await addClient(clientData);
          closeModal();
        }}
      />
      <UserNav />
    </div>
  );
}