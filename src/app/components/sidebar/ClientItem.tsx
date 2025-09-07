// components/sidebar/ClientItem.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { ClientItemProps } from "../../types";
import { COLORS } from "../../constants";

export function ClientItem({
  client,
  isSelected,
  collapsed,
  onClick: _onClick, // Add underscore prefix
}: ClientItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/client/${client.id}`);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 12,
        padding: collapsed ? "8px" : "12px",
        borderRadius: 8,
        border: "none",
        background: isSelected ? COLORS.accent : "transparent",
        color: isSelected ? COLORS.text : COLORS.muted,
        cursor: "pointer",
        transition: "all 0.2s",
        justifyContent: collapsed ? "center" : "flex-start",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = COLORS.hover;
          e.currentTarget.style.color = COLORS.text;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = COLORS.muted;
        }
      }}
    >
      {/* Client Avatar */}
      <div style={{ flexShrink: 0, width: 32, height: 32 }}>
        {client.logo ? (
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserIcon style={{ width: 16, height: 16, color: COLORS.text }} />
          </div>
        )}
      </div>

      {/* Client Name */}
      {!collapsed && (
        <div
          style={{
            flex: 1,
            textAlign: "left",
            fontSize: 14,
            fontWeight: isSelected ? 600 : 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {client.name}
        </div>
      )}
    </button>
  );
}