import React from "react";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface SidebarHeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function SidebarHeader({ collapsed, onCollapse, mobileOpen, setMobileOpen }: SidebarHeaderProps) {
  return (
    <div
      className={
        collapsed
          ? "flex flex-col items-center justify-center py-4 px-2 relative"
          : "flex flex-row items-center justify-center py-4 px-2 gap-3"
      }
    >
      <Image
        src="/assets/images/boombox-logo.webp"
        alt="Logo"
        width={40}
        height={40}
        className="rounded-full"
      />

      {/* Desktop collapse button (when expanded) */}
      {!collapsed && (
        <button
          onClick={onCollapse}
          className="bg-[#23262F] text-[#F1F5F9] rounded-full w-8 h-8 items-center justify-center border-none cursor-pointer ml-2 hidden md:flex hover:bg-[#2D3142] transition-colors"
          aria-label="Collapse sidebar"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      )}

      {/* Desktop expand button (when collapsed) - positioned beside the collapsed sidebar */}
      {collapsed && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCollapse();
          }}
          className="hidden md:flex fixed left-[80px] top-4 text-[#F1F5F9] rounded-full w-10 h-10 items-center justify-center border-none cursor-pointer shadow-lg hover:bg-[#1E40AF] transition-all"
          style={{ 
            zIndex: 9999,
            pointerEvents: "auto"
          }}
          aria-label="Expand sidebar"
        >
          <ChevronLeftIcon className="w-5 h-5 rotate-180" />
        </button>
      )}

      {/* Mobile close button */}
      {mobileOpen && setMobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="bg-[#23262F] text-[#F1F5F9] rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer ml-2 md:hidden absolute right-2 hover:bg-[#2D3142] transition-colors"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}