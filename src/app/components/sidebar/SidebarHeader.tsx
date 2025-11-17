import React from "react";
import { ChevronLeftIcon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useTheme } from "../../contexts/ThemeContext";

interface SidebarHeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function SidebarHeader({ collapsed, onCollapse, mobileOpen, setMobileOpen }: SidebarHeaderProps) {
  const { theme } = useTheme();
  
  const logoSrc = theme === "dark" 
    ? "/assets/images/boombox-logo.webp" 
    : "/assets/images/boombox-primary-logo.png";

  return (
    <div
      className={`
        flex items-center py-4 px-4 transition-all duration-300
        ${collapsed ? "justify-center" : "justify-between"}
      `}
      style={{
        borderBottom: "1px solid var(--border)",
        minHeight: "64px",
      }}
    >
      <div className="flex items-center gap-3">
        <Image
          src={logoSrc}
          alt="Logo"
          width={collapsed ? 32 : 36}
          height={collapsed ? 32 : 36}
          className="rounded-lg transition-all duration-300"
          style={{
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        />

        {!collapsed && (
          <div className="flex flex-col">
            <span 
              className="font-bold text-base tracking-tight"
              style={{ color: "var(--card-foreground)" }}
            >
              Boombox Social
            </span>
            <span 
              className="text-xs"
              style={{ color: "var(--muted)" }}
            >
              Internal AI App
            </span>
          </div>
        )}
      </div>

      {/* Desktop collapse button */}
      {!collapsed && (
        <button
          onClick={onCollapse}
          className="rounded-md w-8 h-8 items-center justify-center border-none cursor-pointer hidden md:flex transition-all duration-200"
          style={{
            background: "transparent",
            color: "var(--muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--secondary)";
            e.currentTarget.style.color = "var(--card-foreground)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted)";
          }}
          aria-label="Collapse sidebar"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      )}

      {/* Desktop expand button (floating) */}
      {collapsed && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCollapse();
          }}
          className="hidden md:flex fixed left-[72px] top-5 rounded-full w-8 h-8 items-center justify-center border cursor-pointer transition-all duration-200"
          style={{ 
            zIndex: 999,
            pointerEvents: "auto",
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--muted)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--primary)";
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.color = "var(--primary-foreground)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--card)";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.12)";
          }}
          aria-label="Expand sidebar"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      )}

      {/* Mobile close button */}
      {mobileOpen && setMobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-md w-8 h-8 flex items-center justify-center border-none cursor-pointer md:hidden transition-all duration-200"
          style={{
            background: "transparent",
            color: "var(--muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--secondary)";
            e.currentTarget.style.color = "var(--card-foreground)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted)";
          }}
          aria-label="Close sidebar"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}