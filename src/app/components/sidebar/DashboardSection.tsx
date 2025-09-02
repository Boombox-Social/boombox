"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";
import { COLORS } from "../../constants";

interface DashboardSectionProps {
  collapsed: boolean;
}

export function DashboardSection({ collapsed }: DashboardSectionProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleDashboardClick = () => {
    // Navigate to main dashboard
    router.push("/dashboard");
  };

  const isOnDashboard = pathname === "/dashboard";

  return (
    <div
      style={{
        padding: collapsed ? "0 8px" : "0 20px",
        marginBottom: 8,
      }}
    >
      <button
        onClick={handleDashboardClick}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: isOnDashboard ? COLORS.hover : COLORS.card,
          color: COLORS.text,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: collapsed ? 8 : "8px 12px",
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
          justifyContent: collapsed ? "center" : "flex-start",
          marginBottom: 8,
        }}
        aria-label={collapsed ? "Dashboard" : undefined}
      >
        <HomeIcon width={20} />
        {!collapsed && "Dashboard"}
      </button>

      {!collapsed && (
        <input
          type="text"
          placeholder="Search for clients"
          style={{
            width: "100%",
            padding: "6px 12px",
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.bg,
            color: COLORS.text,
            marginBottom: 12,
            fontSize: 14,
          }}
        />
      )}
    </div>
  );
}
