// dashboard/layout.tsx
"use client";
import React, { useState } from "react";
import { useClientManagement, useModal } from "../hooks";
import { NewClientForm } from "../types";
import { AddClientModal } from "../components/modals/AddClientModal";
import { SidePanel } from "../components/sidebar/SidePanel";

function ExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 1000,
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      ☰
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
      const _newClient = await addClient(clientData); // Add underscore prefix
      closeModal();
    } catch (error) {
      console.error("Failed to add client:", error);
      throw error;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      {!sidebarCollapsed && (
        <SidePanel
          collapsed={false}
          onCollapse={() => setSidebarCollapsed(true)}
          clients={clients}
          onAddClientClick={openModal}
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Expand Button (shown when sidebar is collapsed) */}
      {sidebarCollapsed && (
        <ExpandButton onClick={() => setSidebarCollapsed(false)} />
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? 0 : 0,
          transition: "margin-left 0.3s ease",
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
