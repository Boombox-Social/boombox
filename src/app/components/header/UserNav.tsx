"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon 
} from "@heroicons/react/24/solid";

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSettings = () => {
    router.push("/dashboard/settings");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-[#181A20] rounded-lg px-4 py-2 border border-[#2D3142] hover:bg-[#2D3142] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-sm font-bold text-[#F1F5F9]">
          {authState.user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}
        </div>
        {/* Always show user name on all screen sizes */}
        <span className="text-[#F1F5F9] text-sm font-medium">
          {authState.user?.name || "User"}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-[#23262F] border border-[#2D3142] rounded-lg shadow-lg py-1 z-50">
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-[#F1F5F9] hover:bg-[#2D3142] transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-[#F1F5F9] hover:bg-[#2D3142] transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}