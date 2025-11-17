"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
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
        className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-all duration-200"
        style={{
          background: isOpen ? "var(--secondary)" : "transparent",
          border: "1px solid var(--border)",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = "var(--secondary)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {authState.user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
        </div>
        <span 
          className="text-sm font-medium hidden sm:block"
          style={{ color: "var(--card-foreground)" }}
        >
          {authState.user?.name || "User"}
        </span>
        <ChevronDownIcon 
          className={`w-3 h-3 hidden sm:block transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--muted)" }}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 z-50"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* User Info Header */}
            <div 
              className="px-4 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {authState.user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    {authState.user?.name || "User"}
                  </p>
                  <p 
                    className="text-xs truncate"
                    style={{ color: "var(--muted)" }}
                  >
                    {authState.user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleSettings}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors duration-200"
                style={{
                  background: "transparent",
                  color: "var(--card-foreground)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Cog6ToothIcon 
                  className="w-4 h-4"
                  style={{ color: "var(--muted)" }}
                />
                <span>Settings</span>
              </button>
              
              <div 
                className="my-1 mx-2"
                style={{
                  height: "1px",
                  background: "var(--border)",
                }}
              />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors duration-200"
                style={{
                  background: "transparent",
                  color: "var(--card-foreground)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <ArrowRightOnRectangleIcon 
                  className="w-4 h-4"
                  style={{ color: "var(--muted)" }}
                />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}