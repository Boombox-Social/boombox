"use client";
import React, { useState } from "react";
import { useClientManagement, useModal } from "../hooks";
import { NewClientForm } from "../types";
import { AddClientModal } from "../components/modals/AddClientModal";
import { SidePanel } from "../components/sidebar/SidePanel";
import { Navbar } from "../components/header/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { clients, addClient, isLoading, error } = useClientManagement();
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Unified Navbar - adjusts position based on sidebar */}
      <Navbar
        onMenuClick={() => setSidebarMobileOpen(true)}
        showBurger={!sidebarMobileOpen}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* SidePanel */}
      <SidePanel
        collapsed={sidebarCollapsed}
        onCollapse={() => {
          console.log("Toggle sidebar, current state:", sidebarCollapsed);
          setSidebarCollapsed(!sidebarCollapsed);
        }}
        clients={clients}
        onAddClientClick={openModal}
        isLoading={isLoading}
        error={error}
        mobileOpen={sidebarMobileOpen}
        setMobileOpen={setSidebarMobileOpen}
      />

      {/* Main content - reduced z-index */}
      <main
        className={`
          flex-1 bg-[#181A20] min-h-screen transition-all
          pt-16
          ml-0 md:ml-[${sidebarCollapsed ? "72px" : "220px"}]
          p-6
        `}
        style={{ zIndex: 1 }} // Below both navbar and expand button
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
    </div>
  );
}