// File Structure: src/app/components/sidebar/ClientList.tsx - Component that renders the list of clients
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Client } from "../../types";
import { ClientItem } from "./ClientItem";

interface ClientListProps {
  clients: Client[];
  collapsed: boolean;
}

export function ClientList({ clients, collapsed }: ClientListProps) {
  const pathname = usePathname();

  console.log(
    "ClientList - rendering with clients:",
    clients?.length || 0,
    "collapsed:",
    collapsed
  ); // Debug log

  // Extract client ID from URL if we're on a client page
  const getSelectedClientId = () => {
    const match = pathname.match(/\/dashboard\/client\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const selectedClientId = getSelectedClientId();

  if (!clients || clients.length === 0) {
    console.log("ClientList - no clients to display"); // Debug log
    return null;
  }

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
      className="client-list-scrollbar"
    >
      {clients.map((client) => {
        console.log("ClientList - rendering client:", client.name, client.id); // Debug log
        return (
          <ClientItem
            key={client.id}
            client={client}
            isSelected={selectedClientId === client.id}
            collapsed={collapsed}
            onClick={() => {}} // No longer needed since we handle navigation in ClientItem
          />
        );
      })}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .client-list-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .client-list-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .client-list-scrollbar::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 3px;
        }
        .client-list-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}
