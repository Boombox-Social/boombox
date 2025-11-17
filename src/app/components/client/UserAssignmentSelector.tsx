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

  useEffect(() => {
    const loadSMMUsers = async () => {
      try {
        setError("");
        const response = await fetch("/api/users/smm");

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
        if (data.success && data.users) {
          setAvailableUsers(data.users);
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
        setSelectedUserIds(selectedUserIds);
        onChange(selectedUserIds);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!canEdit) {
    return (
      <div
        className="text-center p-4 rounded-md italic text-sm"
        style={{
          color: "var(--muted)",
          background: "var(--secondary)",
        }}
      >
        You don't have permission to assign users to clients
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="text-center p-4 rounded-md text-sm"
        style={{
          color: "var(--danger)",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (availableUsers.length === 0 && !error) {
    return (
      <div
        className="text-center p-4 text-sm"
        style={{ color: "var(--muted)" }}
      >
        Loading SMM users...
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4
        className="text-sm font-semibold mb-3 uppercase tracking-wide"
        style={{ color: "var(--muted)" }}
      >
        Assign SMMs ({selectedUserIds.length} selected)
      </h4>

      <div className="flex flex-col gap-2">
        {availableUsers.map((user) => {
          const isSelected = selectedUserIds.includes(user.id);

          return (
            <label
              key={user.id}
              className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200"
              style={{
                background: isSelected ? "rgba(37, 99, 235, 0.1)" : "var(--background)",
                border: `2px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleUserToggle(user.id)}
                disabled={!canEdit || isLoading}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: "var(--primary)" }}
              />

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold overflow-hidden"
                style={{
                  background: user.avatar ? "transparent" : "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1">
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--card-foreground)" }}
                >
                  {user.name}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  {user.email}
                </div>
              </div>

              {isSelected && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
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
            className="text-center p-4 text-sm italic"
            style={{ color: "var(--muted)" }}
          >
            No SMM users available for assignment
          </div>
        )}
      </div>
    </div>
  );
}