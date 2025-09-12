// dashboard/layout.tsx
"use client";
import React, { useState } from "react";
import { useClientManagement, useModal } from "../hooks";
import { NewClientForm } from "../types";
import { AddClientModal } from "../components/modals/AddClientModal";
import { SidePanel } from "../components/sidebar/SidePanel";
import { UserNav } from "../components/header/UserNav";

function ExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#2563eb",
        color: "#F1F5F9",
        border: "none",
        cursor: "pointer",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      →
    </button>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clients, addClient, isLoading, error } = useClientManagement();
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAddClient = async (clientData: NewClientForm) => {
    try {
      const _newClient = await addClient(clientData);
      closeModal();
    } catch (error) {
      console.error("Failed to add client:", error);
      throw error;
    }
  };

  // Calculate sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? 80 : 280; // Match your UI_CONFIG values

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      {/* Sidebar - Always rendered but conditionally visible */}
      <SidePanel
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(true)}
        clients={clients}
        onAddClientClick={openModal}
        isLoading={isLoading}
        error={error}
      />

      {/* Add UserNav component */}
      <UserNav />

      {/* Expand Button (shown when sidebar is collapsed) */}
      {sidebarCollapsed && (
        <ExpandButton onClick={() => setSidebarCollapsed(false)} />
      )}

      {/* Main Content - FIXED: Add proper margin to account for sidebar */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarWidth, // This is the key fix
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          background: "#181A20", // Match your app background
          position: "relative",
        }}
      >
        {children}
      </main>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddClient}
      />
    </div>
  );
}
