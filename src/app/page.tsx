"use client";
import React, { useState } from "react";
import { COLORS, UI_CONFIG } from "./constants";
import { useClientManagement, useModal } from "./hooks";
import { createClientFromForm } from "./utils";

// Import Components
import { SidePanel } from "./components/sidebar";
import { AddClientModal } from "./components/modals";
import ClientDetails from "./components/ClientDetails";
import DashboardContent from "./components/DashboardContent";

function ExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        left: UI_CONFIG.SIDEBAR_WIDTH.COLLAPSED,
        top: 24,
        zIndex: 20,
        background: "none",
        border: "none",
        color: COLORS.text,
        width: 32,
        height: 32,
        cursor: "pointer",
        padding: 0,
      }}
      aria-label="Expand sidebar"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="2" height="12" rx="1" fill="currentColor" />
        <rect
          x="7"
          y="4"
          width="10"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </button>
  );
}

export default function Home() {
  // State Management
  const [collapsed, setCollapsed] = useState(false);
  const { clients, selectedClient, setSelectedClient, addClient } =
    useClientManagement();

  const addClientModal = useModal();

  // Event Handlers
  const handleAddClientSubmit = (formData: any) => {
    const newClient = createClientFromForm(formData);
    addClient(formData);
    addClientModal.close();
  };

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  // Styles
  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    background: COLORS.bg,
    color: COLORS.text,
    padding: "min(5vw, 32px)",
    marginLeft: collapsed
      ? UI_CONFIG.SIDEBAR_WIDTH.COLLAPSED
      : UI_CONFIG.SIDEBAR_WIDTH.EXPANDED,
    transition: `margin-left ${UI_CONFIG.TRANSITION_DURATION}`,
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    background: COLORS.bg,
    minHeight: "100vh",
    position: "relative",
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <SidePanel
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        clients={clients}
        onAddClientClick={addClientModal.open}
      />

      {/* Expand Button (shown when collapsed) */}
      {collapsed && <ExpandButton onClick={() => setCollapsed(false)} />}

      {/* Main Content */}
      <main style={mainContentStyle}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {selectedClient ? (
            <ClientDetails client={selectedClient} />
          ) : (
            <DashboardContent />
          )}
        </div>
      </main>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={addClientModal.isOpen}
        onClose={addClientModal.close}
        onSubmit={handleAddClientSubmit}
      />
    </div>
  );
}
