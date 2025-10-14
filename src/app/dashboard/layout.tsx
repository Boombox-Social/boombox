"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useClientManagement, useModal } from "../hooks";
import { NewClientForm } from "../types";
import { AddClientModal } from "../components/modals/AddClientModal";
import { SidePanel } from "../components/sidebar/SidePanel";
import { Navbar } from "../components/header/Navbar";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clients, addClient, isLoading, error, loadClients } =
    useClientManagement();
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname === "/dashboard") {
      loadClients();
    }
  }, [pathname, loadClients]);

  return (
    <div className="flex min-h-screen relative bg-[#181A20]">
      {/* Unified Navbar */}
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

      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="hidden md:flex fixed top-4 left-[80px] z-30 bg-[#2563eb] text-[#F1F5F9] rounded-full w-10 h-10 items-center justify-center shadow-lg hover:bg-[#1E40AF] transition-colors"
          aria-label="Expand sidebar"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 5l8 7-8 7" />
          </svg>
        </button>
      )}

      {/* Main content */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-200
          pt-20 px-4 md:px-6
          ${sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[220px]"}
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
    </div>
  );
}