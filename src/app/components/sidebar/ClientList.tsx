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
      <div className="text-center text-[#94A3B8] text-[15px] py-8 w-full">
        No clients added yet.
      </div>
    );
  }

  return (
<div
  className={`flex-1 overflow-y-auto ${collapsed ? 'p-0 items-center gap-2' : 'p-2 items-stretch gap-0'} client-list-scrollbar`}
>
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
