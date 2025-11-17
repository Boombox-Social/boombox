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

  const getSelectedClientId = () => {
    const match = pathname.match(/\/dashboard\/client\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const selectedClientId = getSelectedClientId();

  if (!clients || clients.length === 0) {
    return (
      <div 
        className="text-center text-sm py-8 w-full px-4"
        style={{ color: "var(--muted)" }}
      >
        {collapsed ? (
          <svg 
            className="w-6 h-6 mx-auto" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
              clipRule="evenodd" 
            />
          </svg>
        ) : (
          "No clients yet"
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex-1 overflow-y-auto client-list-scrollbar ${
        collapsed ? "p-2 flex flex-col items-center gap-2" : "px-3 py-2"
      }`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "var(--border) transparent",
      }}
    >
      {/* Clients Header */}
      {!collapsed && (
        <div 
          className="text-xs font-semibold uppercase tracking-wider px-3 py-2 mb-1"
          style={{ color: "var(--muted)" }}
        >
          Clients
        </div>
      )}

      {clients.map((client) => {
        return (
          <ClientItem
            key={client.id}
            client={client}
            isSelected={selectedClientId === client.id}
            collapsed={collapsed}
            onClick={() => {}}
          />
        );
      })}

      <style jsx>{`
        .client-list-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .client-list-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .client-list-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
        .client-list-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted);
        }
      `}</style>
    </div>
  );
}