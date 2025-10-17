"use client";
import React from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ClientItem } from "./ClientItem";
import type { Client } from "../../types";

interface ClientListProps {
  clients: Client[];
  collapsed: boolean;
  onAddClient: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function ClientList({
  clients,
  collapsed,
  onAddClient,
  isLoading = false,
  error = null,
}: ClientListProps) {
  return (
    <div className="p-2">
      <div className={`flex items-center justify-between mb-2 ${collapsed ? 'justify-center' : 'px-2'}`}>
        {!collapsed && (
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Clients
          </h2>
        )}
        <button
          onClick={onAddClient}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
          title="Add Client"
          aria-label="Add Client"
        >
          <PlusIcon className="w-4 h-4 text-foreground" />
        </button>
      </div>

      <div className="space-y-1">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-sm text-red-500">{error}</div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-sm text-muted-foreground">No clients yet</div>
          </div>
        ) : (
          clients.map((client) => (
            <ClientItem key={client.id} client={client} collapsed={collapsed} />
          ))
        )}
      </div>
    </div>
  );
}