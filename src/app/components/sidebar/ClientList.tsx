import React from "react";
import { Client } from "../../types/client.types";
import { ClientItem } from "./ClientItem";

interface ClientListProps {
  clients: Client[];
  selectedClient: Client | null;
  setSelectedClient: (client: Client) => void;
  collapsed: boolean;
}

export function ClientList({
  clients,
  selectedClient,
  setSelectedClient,
  collapsed,
}: ClientListProps) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: collapsed ? "0 0" : "0 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: collapsed ? "center" : "stretch",
        gap: collapsed ? 8 : 0,
      }}
    >
      {clients.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999", padding: 12 }}>
          No clients found
        </div>
      ) : (
        clients.map((client) => (
          <ClientItem
            key={client.id}
            client={client}
            isSelected={selectedClient?.id === client.id}
            collapsed={collapsed}
            onClick={() => setSelectedClient(client)}
          />
        ))
      )}
    </div>
  );
}
