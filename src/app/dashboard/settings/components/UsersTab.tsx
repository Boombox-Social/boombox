"use client";
import React from "react";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
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

interface UsersTabProps {
  users: User[];
  isLoading: boolean;
  currentUserId?: number;
  onRefresh: () => void;
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
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

export function UsersTab({
  users,
  isLoading,
  currentUserId,
  onRefresh,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: UsersTabProps) {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 
          className="text-lg sm:text-xl font-semibold"
          style={{ color: "var(--card-foreground)" }}
        >
          User Management
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg disabled:opacity-60 transition-all duration-200 text-sm font-medium"
            style={{
              background: "var(--secondary)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.background = "var(--background)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--secondary)";
            }}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={onAddUser}
            className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1E40AF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--primary)";
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div 
            className="w-6 h-6 mx-auto rounded-full animate-spin mb-3"
            style={{
              border: "2px solid var(--border)",
              borderTopColor: "var(--primary)",
            }}
          />
          <div 
            className="text-sm sm:text-base"
            style={{ color: "var(--muted)" }}
          >
            Loading users...
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full">
              <thead>
                <tr 
                  className="border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <th 
                    className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    User
                  </th>
                  <th 
                    className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden sm:table-cell"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Role
                  </th>
                  <th 
                    className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden md:table-cell"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Status
                  </th>
                  <th 
                    className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden lg:table-cell"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Last Login
                  </th>
                  <th 
                    className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden lg:table-cell"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Created
                  </th>
                  <th 
                    className="text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors"
                    style={{ borderColor: "var(--border)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--secondary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div 
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0"
                          style={{
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div 
                            className="font-medium text-xs sm:text-sm truncate"
                            style={{ color: "var(--card-foreground)" }}
                          >
                            {user.name}
                          </div>
                          <div 
                            className="text-xs truncate"
                            style={{ color: "var(--muted)" }}
                          >
                            {user.email}
                          </div>
                          {/* Show role badge on mobile */}
                          <span
                            className="inline-block sm:hidden mt-1 px-2 py-0.5 rounded text-[10px] font-medium text-white"
                            style={{ backgroundColor: getRoleBadgeColor(user.role) }}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getRoleBadgeColor(user.role) }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: user.isActive
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                          color: user.isActive ? "var(--success)" : "var(--danger)",
                        }}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td 
                      className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm hidden lg:table-cell"
                      style={{ color: "var(--muted)" }}
                    >
                      {formatDate(user.lastLogin)}
                    </td>
                    <td 
                      className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm hidden lg:table-cell"
                      style={{ color: "var(--muted)" }}
                    >
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => onEditUser(user)}
                          className="p-1 sm:p-1.5 rounded transition-colors"
                          style={{ color: "var(--muted)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--primary)";
                            e.currentTarget.style.background = "rgba(37, 99, 235, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--muted)";
                            e.currentTarget.style.background = "transparent";
                          }}
                          title="Edit User"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        {user.id !== currentUserId && (
                          <button
                            onClick={() => onDeleteUser(user)}
                            className="p-1 sm:p-1.5 rounded transition-colors"
                            style={{ color: "var(--muted)" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "var(--danger)";
                              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "var(--muted)";
                              e.currentTarget.style.background = "transparent";
                            }}
                            title="Delete User"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && !isLoading && (
            <div 
              className="text-center py-8 text-sm sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}