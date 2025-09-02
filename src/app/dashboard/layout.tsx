// File Structure: src/app/dashboard/layout.tsx - Main dashboard layout with sidebar and client management
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
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        fontSize: 18,
        fontWeight: "bold",
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
  // State Management
  const [collapsed, setCollapsed] = useState(false);
  const { clients, addClient, isLoading, error } = useClientManagement();
  const addClientModal = useModal();

  // Event Handlers
  const handleAddClientSubmit = async (formData: NewClientForm) => {
    try {
      const newClient = await addClient(formData);
    } catch (error) {
      throw error; // Re-throw so the modal can catch it
    }
  };

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  // Styles
  const containerStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    background: "#181A20",
    overflow: "hidden",
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    marginLeft: collapsed ? 80 : 280,
    transition: "margin-left 0.3s ease",
    overflow: "auto",
    position: "relative",
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <SidePanel
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        clients={clients}
        onAddClientClick={addClientModal.open}
        isLoading={isLoading}
        error={error}
      />

      {/* Main Content */}
      <main style={mainContentStyle}>{children}</main>

      {/* Expand Button (shown when sidebar is collapsed) */}
      {collapsed && <ExpandButton onClick={toggleSidebar} />}

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={addClientModal.isOpen}
        onClose={addClientModal.close}
        onSubmit={handleAddClientSubmit}
      />
    </div>
  );
}
