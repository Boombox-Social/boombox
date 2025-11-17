"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth, usePermission } from "../../hooks/useAuth";
import { UserRole } from "../../../generated/prisma";
import {
  AddUserModal,
  DeleteUserModal,
  EditUserModal,
} from "../../components/modals";
import { ProfileTab } from "./components/ProfileTab";
import { UsersTab } from "./components/UsersTab";
import { ArchivedClientsTab } from "./components/ArchivedClientsTab";
import { SecurityTab } from "./components/SecurityTab";

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

export default function SettingsPage() {
  const { authState, logout } = useAuth();
  const { isSuperAdmin } = usePermission();

  const archivedClients = [
    { id: 1, name: "Acme Corp", industry: "Technology", status: "Archived" },
    { id: 2, name: "Beta Solutions", industry: "Consulting", status: "Archived" },
    { id: 3, name: "Gamma Media", industry: "Marketing", status: "Archived" },
  ];

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editError, setEditError] = useState("");
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleRestoreClient = (clientId: number) => {
    alert(`Restore client with ID: ${clientId}`);
  };

  const handlePermanentDeleteClient = (clientId: number) => {
    alert(`Permanently delete client with ID: ${clientId}`);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setError("");
    try {
      const response = await fetch("/api/auth/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users || []);
      setHasLoadedUsers(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users" && isSuperAdmin && !hasLoadedUsers && !isLoadingUsers) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }
      const data = await response.json();
      setUsers((prev) => [...prev, data.user]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
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
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteUserModal(true);
  };

  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setShowEditUserModal(true);
    setEditError("");
  };

  const handleEditUser = async (userId: number, data: Partial<User>) => {
    setIsEditingUser(true);
    setEditError("");
    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }
      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updatedUser.user } : u))
      );
      setShowEditUserModal(false);
      setUserToEdit(null);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setIsEditingUser(false);
    }
  };

  const tabs: { key: SettingsTab; label: string; visible: boolean }[] = [
    { key: "profile", label: "Profile", visible: true },
    { key: "users", label: "User Management", visible: isSuperAdmin },
    { key: "archived", label: "Archived Clients", visible: isSuperAdmin },
    { key: "security", label: "Security", visible: true },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 
          className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight"
          style={{ color: "var(--card-foreground)" }}
        >
          Settings
        </h1>
        <p 
          className="text-sm sm:text-base"
          style={{ color: "var(--muted)" }}
        >
          Manage your account and application settings
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 sm:mb-8 overflow-x-auto">
        <div 
          className="flex space-x-1 rounded-lg p-1 min-w-max"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap"
              style={{
                background: activeTab === tab.key ? "var(--primary)" : "transparent",
                color: activeTab === tab.key ? "var(--primary-foreground)" : "var(--muted)",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = "var(--secondary)";
                  e.currentTarget.style.color = "var(--card-foreground)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div 
          className="rounded-lg p-3 sm:p-4 mb-4 sm:mb-6"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <p 
            className="text-sm sm:text-base"
            style={{ color: "var(--danger)" }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Tab Content */}
      <div 
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        {activeTab === "profile" && <ProfileTab user={authState.user} />}
        {activeTab === "users" && isSuperAdmin && (
          <UsersTab
            users={users}
            isLoading={isLoadingUsers}
            currentUserId={authState.user?.id}
            onRefresh={handleRefreshUsers}
            onAddUser={() => setShowAddUserModal(true)}
            onEditUser={handleEditClick}
            onDeleteUser={handleDeleteClick}
          />
        )}
        {activeTab === "archived" && isSuperAdmin && (
          <ArchivedClientsTab
            clients={archivedClients}
            onRestore={handleRestoreClient}
            onPermanentDelete={handlePermanentDeleteClient}
          />
        )}
        {activeTab === "security" && <SecurityTab onLogout={handleLogout} />}
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
      />
      <EditUserModal
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setUserToEdit(null);
        }}
        user={userToEdit}
        onSave={handleEditUser}
        isLoading={isEditingUser}
        error={editError}
      />
      <DeleteUserModal
        isOpen={showDeleteUserModal}
        onClose={() => {
          setShowDeleteUserModal(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        user={userToDelete}
      />
    </div>
  );
}