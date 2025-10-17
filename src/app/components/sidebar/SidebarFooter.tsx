"use client";
import React from "react";
import { useAuth } from "../../hooks/useAuth";

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  const { authState } = useAuth();

  if (!authState.user) return null;

  return (
    <div className={`p-4 border-t border-border ${collapsed ? 'flex justify-center' : ''}`}>
      <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          {authState.user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {authState.user.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {authState.user.email}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}