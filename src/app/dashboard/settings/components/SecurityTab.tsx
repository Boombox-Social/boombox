"use client";
import React from "react";

interface SecurityTabProps {
  onLogout: () => void;
}

export function SecurityTab({ onLogout }: SecurityTabProps) {
  return (
    <div className="p-4 sm:p-6">
      <h2 
        className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
        style={{ color: "var(--card-foreground)" }}
      >
        Security Settings
      </h2>

      <div className="space-y-4 sm:space-y-6">
        {/* Account Actions */}
        <div 
          className="rounded-lg p-4 sm:p-6"
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
          }}
        >
          <h3 
            className="text-base sm:text-lg font-medium mb-3 sm:mb-4"
            style={{ color: "var(--card-foreground)" }}
          >
            Account Actions
          </h3>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 sm:py-3">
              <div>
                <h4 
                  className="font-medium text-sm sm:text-base"
                  style={{ color: "var(--card-foreground)" }}
                >
                  Sign Out
                </h4>
                <p 
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Sign out from your current session
                </p>
              </div>
              <button
                onClick={onLogout}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                style={{
                  background: "var(--danger)",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--danger)";
                }}
              >
                Sign Out
              </button>
            </div>

            <div 
              className="border-t pt-3 sm:pt-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 sm:py-3">
                <div>
                  <h4 
                    className="font-medium text-sm sm:text-base"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Change Password
                  </h4>
                  <p 
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    Update your account password
                  </p>
                </div>
                <button
                  disabled
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg opacity-60 cursor-not-allowed text-sm font-medium"
                  style={{
                    background: "var(--muted)",
                    color: "var(--background)",
                  }}
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Session Information */}
        <div 
          className="rounded-lg p-4 sm:p-6"
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
          }}
        >
          <h3 
            className="text-base sm:text-lg font-medium mb-3 sm:mb-4"
            style={{ color: "var(--card-foreground)" }}
          >
            Session Information
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span 
                className="text-xs sm:text-sm"
                style={{ color: "var(--muted)" }}
              >
                Current Session:
              </span>
              <span 
                className="text-xs sm:text-sm"
                style={{ color: "var(--card-foreground)" }}
              >
                Active
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span 
                className="text-xs sm:text-sm"
                style={{ color: "var(--muted)" }}
              >
                User Agent:
              </span>
              <span
                className="text-xs sm:text-sm truncate max-w-full sm:max-w-xs"
                style={{ color: "var(--card-foreground)" }}
                title={
                  typeof window !== "undefined"
                    ? navigator.userAgent
                    : "N/A"
                }
              >
                {typeof window !== "undefined"
                  ? navigator.userAgent.split(" ")[0]
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}