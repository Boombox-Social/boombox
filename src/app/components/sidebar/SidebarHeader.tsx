"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  XMarkIcon 
} from "@heroicons/react/24/solid";

interface SidebarHeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function SidebarHeader({
  collapsed,
  onCollapse,
  mobileOpen,
  setMobileOpen,
}: SidebarHeaderProps) {
  const { theme, mounted } = useTheme();

  const logoSrc =
    theme === "dark"
      ? "/assets/images/boombox-logo.webp"
      : "/assets/images/boombox-primary-logo.png";

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-between h-16 px-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between h-16 px-4 border-b flex-shrink-0"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Logo */}
      {!collapsed && (
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

      )}

      {/* Collapsed Logo */}
      {collapsed && (
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

      )}

      {/* Desktop: Collapse Button (always visible) */}
      {!mobileOpen && (
        <button
          onClick={onCollapse}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200 flex-shrink-0"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--secondary)";
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted)";
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Mobile: Close Button */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--secondary)";
            e.currentTarget.style.borderColor = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
          aria-label="Close sidebar"
        >
          <XMarkIcon 
            className="w-5 h-5" 
            style={{ color: "var(--card-foreground)" }}
          />
        </button>
      )}
    </div>
  );
}