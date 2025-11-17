"use client";
import React from "react";
import { UserNav } from "./UserNav";
import { ThemeToggle } from "../ThemeToggle";
import { Bars3Icon } from "@heroicons/react/24/solid";

interface NavbarProps {
  onMenuClick: () => void;
  showBurger: boolean;
  sidebarCollapsed?: boolean;
}

export function Navbar({ onMenuClick, showBurger, sidebarCollapsed = false }: NavbarProps) {
  return (
    <nav 
      className={`
        fixed top-0 z-30 h-16
        transition-all duration-200
        right-0
      `}
      style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        left: sidebarCollapsed ? "64px" : "260px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: Burger Button (mobile only) */}
        <div className="flex items-center md:hidden">
          {showBurger && (
            <button
              onClick={onMenuClick}
              className="rounded-lg p-2 transition-all duration-200"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
              aria-label="Open sidebar"
            >
              <Bars3Icon 
                className="w-5 h-5"
                style={{ color: "var(--card-foreground)" }}
              />
            </button>
          )}
        </div>

        {/* Right: User Nav & Theme Toggle */}
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </nav>
  );
}