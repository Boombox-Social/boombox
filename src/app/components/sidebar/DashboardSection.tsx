"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";

interface DashboardSectionProps {
  collapsed: boolean;
}

export function DashboardSection({ collapsed }: DashboardSectionProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  const isOnDashboard = pathname === "/dashboard";

  return (
    <div
      style={{
        padding: collapsed ? "8px 8px" : "12px 16px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={handleDashboardClick}
        className="w-full flex items-center border-none cursor-pointer transition-all duration-200"
        style={{
          gap: 10,
          background: isOnDashboard ? "var(--primary)" : "transparent",
          color: isOnDashboard ? "var(--primary-foreground)" : "var(--card-foreground)",
          border: isOnDashboard ? "none" : "2px solid var(--border)",
          borderRadius: 6,
          padding: collapsed ? 8 : "10px 12px",
          fontWeight: 600,
          fontSize: 14,
          justifyContent: collapsed ? "center" : "flex-start",
          marginBottom: collapsed ? 0 : 8,
        }}
        onMouseEnter={(e) => {
          if (!isOnDashboard) {
            e.currentTarget.style.background = "var(--secondary)";
            e.currentTarget.style.borderColor = "var(--primary)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOnDashboard) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border)";
          }
        }}
        aria-label={collapsed ? "Dashboard" : undefined}
      >
        <HomeIcon width={18} />
        {!collapsed && "Dashboard"}
      </button>

      {!collapsed && (
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full text-sm outline-none transition-all duration-200"
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "2px solid var(--border)",
            background: "var(--background)",
            color: "var(--card-foreground)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      )}
    </div>
  );
}