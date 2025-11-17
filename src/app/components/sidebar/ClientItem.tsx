"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { ClientItemProps } from "../../types";

export function ClientItem({
  client,
  isSelected,
  collapsed,
  onClick: _onClick,
}: ClientItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/client/${client.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center border-none cursor-pointer transition-all duration-200
        ${collapsed ? "gap-0 p-2 justify-center rounded-lg" : "gap-3 px-3 py-2.5 justify-start rounded-md"}
      `}
      style={{
        background: isSelected ? "var(--primary)" : "transparent",
        color: isSelected ? "var(--primary-foreground)" : "var(--muted)",
        marginBottom: collapsed ? 8 : 4,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "var(--secondary)";
          e.currentTarget.style.color = "var(--card-foreground)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--muted)";
        }
      }}
    >
      {/* Client Avatar */}
      <div className="flex-shrink-0 w-8 h-8">
        {client.logo ? (
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            className="w-8 h-8 rounded-full object-cover"
            style={{
              border: isSelected ? "2px solid var(--primary-foreground)" : "none",
            }}
          />
        ) : (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: isSelected ? "rgba(255, 255, 255, 0.2)" : "var(--primary)",
            }}
          >
            <UserIcon 
              className="w-4 h-4" 
              style={{ 
                color: isSelected ? "var(--primary-foreground)" : "#ffffff" 
              }} 
            />
          </div>
        )}
      </div>

      {/* Client Name */}
      {!collapsed && (
        <div
          className={`
            flex-1 text-left text-sm whitespace-nowrap overflow-hidden text-ellipsis
            ${isSelected ? "font-semibold" : "font-medium"}
          `}
        >
          {client.name}
        </div>
      )}
    </button>
  );
}