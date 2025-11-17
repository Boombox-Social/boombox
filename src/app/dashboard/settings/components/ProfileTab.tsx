"use client";
import React from "react";
import { UserRole } from "../../../../generated/prisma";

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileTabProps {
  user: User | null;
}

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "var(--danger)";
    case UserRole.ADMIN:
      return "var(--warning)";
    case UserRole.SMM:
      return "var(--primary)";
    default:
      return "var(--muted)";
  }
};

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "Never";
  const d = new Date(date);
  return (
    d.toLocaleDateString() +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

export function ProfileTab({ user }: ProfileTabProps) {
  if (!user) return null;

  return (
    <div className="p-4 sm:p-6">
      <h2 
        className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
        style={{ color: "var(--card-foreground)" }}
      >
        Profile Information
      </h2>

      <div className="space-y-4 sm:space-y-6">
        {/* User Avatar and Basic Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-center sm:text-left">
            <h3 
              className="text-base sm:text-lg font-semibold"
              style={{ color: "var(--card-foreground)" }}
            >
              {user.name}
            </h3>
            <p 
              className="text-sm sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              {user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span
                className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: getRoleBadgeColor(user.role) }}
              >
                {user.role}
              </span>
              <span
                className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: user.isActive
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
                  color: user.isActive ? "var(--success)" : "var(--danger)",
                }}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label 
              className="block text-xs sm:text-sm font-medium mb-2"
              style={{ color: "var(--card-foreground)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={user.name || ""}
              disabled
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border disabled:opacity-60 text-sm sm:text-base"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--card-foreground)",
              }}
            />
          </div>

          <div>
            <label 
              className="block text-xs sm:text-sm font-medium mb-2"
              style={{ color: "var(--card-foreground)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border disabled:opacity-60 text-sm sm:text-base"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--card-foreground)",
              }}
            />
          </div>

          <div>
            <label 
              className="block text-xs sm:text-sm font-medium mb-2"
              style={{ color: "var(--card-foreground)" }}
            >
              Role
            </label>
            <input
              type="text"
              value={user.role || ""}
              disabled
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border disabled:opacity-60 text-sm sm:text-base"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--card-foreground)",
              }}
            />
          </div>

          <div>
            <label 
              className="block text-xs sm:text-sm font-medium mb-2"
              style={{ color: "var(--card-foreground)" }}
            >
              Last Login
            </label>
            <input
              type="text"
              value={formatDate(user.lastLogin)}
              disabled
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border disabled:opacity-60 text-sm sm:text-base"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--card-foreground)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}