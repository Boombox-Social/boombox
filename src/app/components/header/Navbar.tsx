"use client";
import React from "react";
import { UserNav } from "./UserNav";

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
        cursor: cursor-pointer
      `}
      style={{
        background: "transparent",
        borderBottom: "none",
        left: sidebarCollapsed ? "72px" : "0px",
      }}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Burger Button (mobile only) */}
        <div className="flex items-center md:hidden">
          {showBurger && (
            <button
              onClick={onMenuClick}
              className="text-[#F1F5F9] rounded-lg p-2 hover:bg-[#2D3142] transition-colors"
              aria-label="Open sidebar"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Right: User Nav */}
        <div className="ml-auto">
          <UserNav />
        </div>
      </div>
    </nav>
  );
}