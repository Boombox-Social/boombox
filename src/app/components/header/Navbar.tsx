"use client";
import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { UserNav } from "./UserNav";

interface NavbarProps {
  onMenuClick: () => void;
  showBurger: boolean;
  sidebarCollapsed: boolean;
}

export function Navbar({ onMenuClick, showBurger, sidebarCollapsed }: NavbarProps) {
  return (
    <nav
      className={`
        fixed top-0 right-0 h-16 z-40
        transition-all duration-200
        ${sidebarCollapsed ? "left-0 md:left-[72px]" : "left-0 md:left-[220px]"}
      `}
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Mobile Menu Button */}
        {showBurger && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Bars3Icon className="w-6 h-6 text-foreground" />
          </button>
        )}

        {/* Spacer for desktop */}
        <div className="hidden md:block flex-1" />

        {/* User Navigation */}
        <UserNav />
      </div>
    </nav>
  );
}