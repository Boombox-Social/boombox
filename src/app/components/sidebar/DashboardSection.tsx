"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { HomeIcon, UsersIcon } from "@heroicons/react/24/solid";

interface DashboardSectionProps {
  collapsed: boolean;
}

export function DashboardSection({ collapsed }: DashboardSectionProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  const handleInfluencersClick = () => {
    router.push("/dashboard/influencers");
  };

  const isOnDashboard = pathname === "/dashboard";
  const isOnInfluencers = pathname === "/dashboard/influencers";

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

      {/* Influencer Master List Navigation */}
      <button
        onClick={handleInfluencersClick}
        className="w-full flex items-center border-none cursor-pointer transition-all duration-200"
        style={{
          gap: 10,
          background: isOnInfluencers ? "var(--primary)" : "transparent",
          color: isOnInfluencers ? "var(--primary-foreground)" : "var(--card-foreground)",
          border: isOnInfluencers ? "none" : "2px solid var(--border)",
          borderRadius: 6,
          padding: collapsed ? 8 : "10px 12px",
          fontWeight: 600,
          fontSize: 14,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
        onMouseEnter={(e) => {
          if (!isOnInfluencers) {
            e.currentTarget.style.background = "var(--secondary)";
            e.currentTarget.style.borderColor = "var(--primary)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOnInfluencers) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border)";
          }
        }}
        aria-label={collapsed ? "Influencers" : undefined}
      >
        <UsersIcon width={18} />
        {!collapsed && "Influencers"}
      </button>
    </div>
  );
}