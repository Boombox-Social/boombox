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
          ? "flex flex-col items-center justify-center py-4 px-2"
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
      {/* Desktop collapse button (hidden on mobile) */}
      {!collapsed && (
        <button
          onClick={onCollapse}
          className="bg-[#23262F] text-[#F1F5F9] rounded-full w-8 h-8 items-center justify-center border-none cursor-pointer ml-2 hidden md:flex"
          aria-label="Collapse sidebar"
        >
          <ChevronLeftIcon width={20} />
        </button>
      )}
      {/* Mobile close button */}
      {mobileOpen && setMobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="bg-[#23262F] text-[#F1F5F9] rounded-full w-8 h-8 flex items-center justify-center border-none cursor-pointer ml-2 md:hidden absolute right-2"
          aria-label="Close sidebar"
        >
          <XMarkIcon width={20} />
        </button>
      )}
    </div>
  );
}