"use client";
import React, { useState, useRef, useEffect } from "react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-200"
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
        <div 
          className="absolute right-0 mt-2 w-64 rounded-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* User Info Header */}
          <div 
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
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
                {authState.user?.role && (
                  <span 
                    className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      background: "rgba(37, 99, 235, 0.1)",
                      color: "var(--primary)",
                    }}
                  >
                    {authState.user.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleSettings}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all duration-200"
              style={{
                background: "transparent",
                color: "var(--card-foreground)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
                const icon = e.currentTarget.querySelector('svg');
                if (icon && icon instanceof SVGElement) {
                  icon.style.color = "var(--primary)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                const icon = e.currentTarget.querySelector('svg');
                if (icon && icon instanceof SVGElement) {
                  icon.style.color = "var(--muted)";
                }
              }}
            >
              <Cog6ToothIcon 
                className="w-4 h-4 transition-colors duration-200"
                style={{ color: "var(--muted)" }}
              />
              <span className="font-medium">Settings</span>
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
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all duration-200"
              style={{
                background: "transparent",
                color: "var(--card-foreground)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.color = "var(--danger)";
                const icon = e.currentTarget.querySelector('svg');
                if (icon && icon instanceof SVGElement) {
                  icon.style.color = "var(--danger)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--card-foreground)";
                const icon = e.currentTarget.querySelector('svg');
                if (icon && icon instanceof SVGElement) {
                  icon.style.color = "var(--muted)";
                }
              }}
            >
              <ArrowRightOnRectangleIcon 
                className="w-4 h-4 transition-colors duration-200"
                style={{ color: "var(--muted)" }}
              />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}