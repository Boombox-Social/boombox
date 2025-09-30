// File Structure: src/app/dashboard/settings/page.tsx - Settings page with user management modals
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { PlusIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { useAuth, usePermission } from "../../hooks/useAuth";
import { UserRole } from "../../../generated/prisma";
import { AddUserModal, DeleteUserModal } from "../../components/modals";

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

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
}

type SettingsTab = "profile" | "users" | "security" | "archived";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
};

export default function SettingsPage() {
  const { authState, logout } = useAuth();
  const {
    hasPermission: _hasPermission,
    isSuperAdmin,
    isAdmin: _isAdmin,
    currentUser: _currentUser,
  } = usePermission(); // Add underscore prefixes to unused variables

  // Dummy data for archived clients
  const archivedClients = [
    {
      id: 1,
      name: "Acme Corp",
      industry: "Technology",
      status: "Archived",
    },
    {
      id: 2,
      name: "Beta Solutions",
      industry: "Consulting",
      status: "Archived",
    },
    {
      id: 3,
      name: "Gamma Media",
      industry: "Marketing",
      status: "Archived",
    },
  ];

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);

    // UI-only handlers
  const handleRestoreClient = (clientId: number) => {
    alert(`Restore client with ID: ${clientId}`);
  };

  const handlePermanentDeleteClient = (clientId: number) => {
    alert(`Permanently delete client with ID: ${clientId}`);
  };

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Memoize fetchUsers to prevent infinite re-renders
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setError("");
    try {
      const response = await fetch("/api/auth/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
      setHasLoadedUsers(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Fetch users only when switching to users tab and haven't loaded yet
  useEffect(() => {
    if (
      activeTab === "users" &&
      isSuperAdmin &&
      !hasLoadedUsers &&
      !isLoadingUsers
    ) {
      fetchUsers();
    }
  }, [activeTab, isSuperAdmin, hasLoadedUsers, isLoadingUsers, fetchUsers]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRefreshUsers = () => {
    setHasLoadedUsers(false);
    fetchUsers();
  };

  const handleAddUser = async (userData: CreateUserData) => {
    try {
      const response = await fetch("/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      const data = await response.json();

      // Add the new user to the list
      setUsers((prev) => [...prev, data.user]);

      // Show success (you could add a toast notification here)
      console.log("User created successfully:", data.user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      // Remove the user from the list
      setUsers((prev) => prev.filter((user) => user.id !== userId));

      // Show success (you could add a toast notification here)
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteUserModal(true);
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

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return colors.danger;
      case UserRole.ADMIN:
        return colors.warning;
      case UserRole.SMM:
        return colors.accent;
      default:
        return colors.muted;
    }
  };

  const tabs: { key: SettingsTab; label: string; visible: boolean }[] = [
    { key: "profile", label: "Profile", visible: true },
    {
      key: "users",
      label: "User Management",
      visible: isSuperAdmin,
    },
    { key: "archived", label: "Archived Clients", visible: isSuperAdmin },
    { key: "security", label: "Security", visible: true },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);

  return (
    <>
      {/* Header */}
      <div className="mb-8 p-6">
        <h1 className="text-3xl font-bold text-[#F1F5F9] mb-2">Settings</h1>
        <p className="text-[#94A3B8]">
          Manage your account and application settings
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-[#23262F] rounded-lg p-1 border border-[#2D3142] w-fit">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? "bg-[#2563eb] text-[#F1F5F9]"
                  : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#2D3142]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-[#23262F] rounded-xl border border-[#2D3142] overflow-hidden">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-6">
              Profile Information
            </h2>

            <div className="space-y-6">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-[#2563eb] flex items-center justify-center text-2xl font-bold text-[#F1F5F9]">
                  {authState.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#F1F5F9]">
                    {authState.user?.name}
                  </h3>
                  <p className="text-[#94A3B8]">{authState.user?.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{
                        backgroundColor: getRoleBadgeColor(
                          authState.user?.role || UserRole.SMM
                        ),
                      }}
                    >
                      {authState.user?.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        authState.user?.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {authState.user?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#F1F5F9] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authState.user?.name || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-[#2D3142] bg-[#181A20] text-[#F1F5F9] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#F1F5F9] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={authState.user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-[#2D3142] bg-[#181A20] text-[#F1F5F9] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#F1F5F9] mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={authState.user?.role || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-[#2D3142] bg-[#181A20] text-[#F1F5F9] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#F1F5F9] mb-2">
                    Last Login
                  </label>
                  <input
                    type="text"
                    value={formatDate(authState.user?.lastLogin)}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-[#2D3142] bg-[#181A20] text-[#F1F5F9] disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab (Super Admin Only) */}
        {activeTab === "users" && isSuperAdmin && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#F1F5F9]">
                User Management
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefreshUsers}
                  disabled={isLoadingUsers}
                  className="px-4 py-2 bg-[#2D3142] text-[#F1F5F9] rounded-lg hover:bg-[#374151] disabled:opacity-60 transition-colors"
                >
                  {isLoadingUsers ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-[#2563eb] text-[#F1F5F9] rounded-lg hover:bg-[#1E40AF] transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add User
                </button>
              </div>
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-8">
                <div className="text-[#94A3B8]">Loading users...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2D3142]">
                      <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">
                        Last Login
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#2D3142] hover:bg-[#2D3142]/30"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-sm font-bold text-[#F1F5F9]">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-[#F1F5F9]">
                                {user.name}
                              </div>
                              <div className="text-sm text-[#94A3B8]">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{
                              backgroundColor: getRoleBadgeColor(user.role),
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#94A3B8] text-sm">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="py-4 px-4 text-[#94A3B8] text-sm">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          {/* Only show delete button for users other than current user */}
                          {user.id !== authState.user?.id && (
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="p-1 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                              title="Delete User"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && !isLoadingUsers && (
                  <div className="text-center py-8 text-[#94A3B8]">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {/* Archived Clients Tab (UI only, dummy data) */}
      {activeTab === "archived" && isSuperAdmin && (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#F1F5F9] mb-6">
            Archived Clients
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2D3142]">
                  <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">Industry</th>
                  <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-[#F1F5F9]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {archivedClients.map((client) => (
                  <tr key={client.id} className="border-b border-[#2D3142] hover:bg-[#2D3142]/30">
                    <td className="py-4 px-4 font-medium text-[#F1F5F9]">{client.name}</td>
                    <td className="py-4 px-4 text-[#94A3B8]">{client.industry}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-600">
                        Archived
                      </span>
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <button
                        onClick={() => handleRestoreClient(client.id)}
                        className="p-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-colors flex items-center gap-1"
                        title="Restore Client"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteClient(client.id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors flex items-center gap-1"
                        title="Permanently Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {archivedClients.length === 0 && (
              <div className="text-center py-8 text-[#94A3B8]">
                No archived clients found
              </div>
            )}
          </div>
        </div>
      )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-6">
              Security Settings
            </h2>

            <div className="space-y-6">
              {/* Account Actions */}
              <div className="bg-[#181A20] rounded-lg p-6 border border-[#2D3142]">
                <h3 className="text-lg font-medium text-[#F1F5F9] mb-4">
                  Account Actions
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-[#F1F5F9]">Sign Out</h4>
                      <p className="text-sm text-[#94A3B8]">
                        Sign out from your current session
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>

                  <div className="border-t border-[#2D3142] pt-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-[#F1F5F9]">
                          Change Password
                        </h4>
                        <p className="text-sm text-[#94A3B8]">
                          Update your account password
                        </p>
                      </div>
                      <button
                        disabled
                        className="px-6 py-2 bg-[#94A3B8] text-[#23262F] rounded-lg opacity-60 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div className="bg-[#181A20] rounded-lg p-6 border border-[#2D3142]">
                <h3 className="text-lg font-medium text-[#F1F5F9] mb-4">
                  Session Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Current Session:</span>
                    <span className="text-[#F1F5F9]">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">User Agent:</span>
                    <span
                      className="text-[#F1F5F9] text-sm truncate max-w-xs"
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
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={showDeleteUserModal}
        onClose={() => {
          setShowDeleteUserModal(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        user={userToDelete}
      />
    </>
  );
}
