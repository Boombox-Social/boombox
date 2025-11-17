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
    <div 
      className="flex min-h-screen relative"
      style={{ background: "var(--background)" }}
    >
      {/* SidePanel */}
      <SidePanel
        collapsed={sidebarCollapsed}
        onCollapse={() => {
          setSidebarCollapsed(!sidebarCollapsed);
        }}
        clients={clients}
        onAddClientClick={openModal}
        isLoading={isLoading}
        error={error}
        mobileOpen={sidebarMobileOpen}
        setMobileOpen={setSidebarMobileOpen}
      />

      {/* Navbar */}
      <Navbar
        onMenuClick={() => setSidebarMobileOpen(true)}
        showBurger={!sidebarMobileOpen}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main content */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-200
          pt-20 px-4 md:px-6
          ${sidebarCollapsed ? "md:ml-[64px]" : "md:ml-[260px]"}
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