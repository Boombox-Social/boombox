"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Client } from "../../types";

interface ClientItemProps {
  client: Client;
  collapsed: boolean;
}

export function ClientItem({ client, collapsed }: ClientItemProps) {
  const pathname = usePathname();
  const isActive = pathname === `/dashboard/client/${client.id}`;

  return (
    <Link
      href={`/dashboard/client/${client.id}`}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${collapsed ? 'justify-center' : ''}
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary"
        }
      `}
      title={collapsed ? client.name : undefined}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
      }`}>
        {client.name.charAt(0).toUpperCase()}
      </div>
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{client.name}</div>
          <div className="text-xs opacity-70 truncate">{client.industry}</div>
        </div>
      )}
    </Link>
  );
}