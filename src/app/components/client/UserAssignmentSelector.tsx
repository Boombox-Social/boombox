// components/client/UserAssignmentSelector.tsx
"use client";
import React, { useState, useEffect } from "react";

interface SMMUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

interface UserAssignmentSelectorProps {
  clientId?: number;
  initialAssignedUserIds?: number[];
  onChange: (userIds: number[]) => void;
  canEdit: boolean;
}

export function UserAssignmentSelector({
  clientId,
  initialAssignedUserIds = [],
  onChange,
  canEdit,
}: UserAssignmentSelectorProps) {
  const [availableUsers, setAvailableUsers] = useState<SMMUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(
    initialAssignedUserIds
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Load available SMM users
  useEffect(() => {
    const loadSMMUsers = async () => {
      try {
        setError("");
        console.log("Loading SMM users..."); // Debug log

        const response = await fetch("/api/users/smm");

        console.log("Response status:", response.status); // Debug log

        if (!response.ok) {
          if (response.status === 403) {
            setError("You don't have permission to assign users");
            return;
          }
          if (response.status === 404) {
            setError("SMM users endpoint not found. Please check API routes.");
            return;
          }
          throw new Error(`Failed to load users: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data); // Debug log

        if (data.success && data.users) {
          setAvailableUsers(data.users);
          console.log("SMM users loaded:", data.users.length); // Debug log
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error loading SMM users:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load users"
        );
      }
    };

    if (canEdit) {
      loadSMMUsers();
    }
  }, [canEdit]);

  const handleUserToggle = async (userId: number) => {
    if (!canEdit) return;

    const newSelectedIds = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId];

    setSelectedUserIds(newSelectedIds);
    onChange(newSelectedIds);

    // If we have a clientId, update the database immediately
    if (clientId) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/clients/${clientId}/assign`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: newSelectedIds }),
        });

        if (!response.ok) {
          throw new Error("Failed to update assignments");
        }
      } catch (error) {
        console.error("Error updating assignments:", error);
        // Revert on error
        setSelectedUserIds(selectedUserIds);
        onChange(selectedUserIds);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Don't render anything if user can't edit
  if (!canEdit) {
    return (
      <div
        style={{
          color: "#94A3B8",
          fontSize: 13,
          fontStyle: "italic",
          textAlign: "center",
          padding: 16,
        }}
      >
        You don't have permission to assign users to clients
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        style={{
          color: "#EF4444",
          fontSize: 13,
          textAlign: "center",
          padding: 16,
          background: "#EF444420",
          borderRadius: 8,
          border: "1px solid #EF444440",
        }}
      >
        Error: {error}
      </div>
    );
  }

  // Show loading state
  if (availableUsers.length === 0 && !error) {
    return (
      <div
        style={{
          color: "#94A3B8",
          fontSize: 13,
          textAlign: "center",
          padding: 16,
        }}
      >
        Loading SMM users...
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h4
        style={{
          color: "#F1F5F9",
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        Assign SMMs ({selectedUserIds.length} selected)
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {availableUsers.map((user) => {
          const isSelected = selectedUserIds.includes(user.id);

          return (
            <label
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 12,
                borderRadius: 8,
                background: isSelected ? "#2563eb20" : "#23262F",
                border: `1px solid ${isSelected ? "#2563eb" : "#2D3142"}`,
                cursor: canEdit ? "pointer" : "default",
                opacity: isLoading ? 0.7 : 1,
                transition: "all 0.2s ease",
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleUserToggle(user.id)}
                disabled={!canEdit || isLoading}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: "#2563eb",
                }}
              />

              {/* User Avatar */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: user.avatar ? "transparent" : "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#F1F5F9",
                  overflow: "hidden",
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: 32, height: 32, borderRadius: "50%" }}
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* User Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "#F1F5F9",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                  }}
                >
                  {user.email}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </div>
              )}
            </label>
          );
        })}

        {availableUsers.length === 0 && !error && (
          <div
            style={{
              color: "#94A3B8",
              fontSize: 13,
              textAlign: "center",
              padding: 16,
              fontStyle: "italic",
            }}
          >
            No SMM users available for assignment
          </div>
        )}
      </div>
    </div>
  );
}
