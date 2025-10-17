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
      <div className="text-muted-foreground text-sm italic text-center p-4">
        You don't have permission to assign users to clients
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-red-500 text-sm text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        Error: {error}
      </div>
    );
  }

  // Show loading state
  if (availableUsers.length === 0 && !error) {
    return (
      <div className="text-muted-foreground text-sm text-center p-4">
        Loading SMM users...
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-foreground text-sm font-semibold mb-3">
        Assign SMMs ({selectedUserIds.length} selected)
      </h4>

      <div className="flex flex-col gap-2">
        {availableUsers.map((user) => {
          const isSelected = selectedUserIds.includes(user.id);

          return (
            <label
              key={user.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg border
                transition-all duration-200
                ${isSelected ? "bg-primary/10 border-primary" : "bg-card border-border"}
                ${canEdit ? "cursor-pointer" : "cursor-default"}
                ${isLoading ? "opacity-70" : ""}
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleUserToggle(user.id)}
                disabled={!canEdit || isLoading}
                className="w-4 h-4 accent-primary"
              />

              {/* User Avatar */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm overflow-hidden
                ${user.avatar ? "" : "bg-primary text-primary-foreground"}
              `}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="text-foreground text-sm font-medium truncate">
                  {user.name}
                </div>
                <div className="text-muted-foreground text-xs truncate">
                  {user.email}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </div>
              )}
            </label>
          );
        })}

        {availableUsers.length === 0 && !error && (
          <div className=" text-sm text-center p-4 italic">
            No SMM users available for assignment
          </div>
        )}
      </div>
    </div>
  );
}