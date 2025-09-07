// components/modals/DeleteUserModal.tsx
"use client";
import React, { useState } from "react";
import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { UserRole } from "../../../generated/prisma"; // Import directly from Prisma
import { Modal } from "../ui";

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

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: number) => Promise<void>;
  user: User | null;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
}: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleConfirm = async () => {
    if (!user) return;

    setIsDeleting(true);
    setError("");

    try {
      await onConfirm(user.id);
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
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
        return colors.border;
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete User">
      <div style={{ width: "auto", minWidth: "400px" }}>
        {/* Warning Message */}
        <div
          style={{
            background: `${colors.danger}20`,
            border: `1px solid ${colors.danger}40`,
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <ExclamationTriangleIcon
            style={{
              width: 20,
              height: 20,
              color: colors.danger,
              flexShrink: 0,
              marginTop: 2,
            }}
          />
          <div>
            <h3
              style={{
                color: colors.danger,
                fontSize: 16,
                fontWeight: 600,
                margin: 0,
                marginBottom: 8,
              }}
            >
              Permanent User Deletion
            </h3>
            <p
              style={{
                color: colors.text,
                fontSize: 14,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              You are about to permanently delete <strong>{user.name}</strong>'s
              account. This action cannot be undone and will:
            </p>
            <ul
              style={{
                color: colors.text,
                fontSize: 13,
                margin: "8px 0 0 0",
                paddingLeft: 16,
                lineHeight: 1.4,
              }}
            >
              <li>Remove all user access to the system</li>
              <li>Unassign them from any clients</li>
              <li>Delete their profile and settings</li>
            </ul>
          </div>
        </div>

        {/* User Summary */}
        <div
          style={{
            background: colors.bg,
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h4
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
              marginBottom: 16,
            }}
          >
            User Details:
          </h4>

          {/* User Avatar and Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: colors.text,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div
                style={{ color: colors.text, fontSize: 16, fontWeight: 600 }}
              >
                {user.name}
              </div>
              <div style={{ color: colors.muted, fontSize: 14 }}>
                {user.email}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    background: getRoleBadgeColor(user.role),
                    color: "white",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 12,
                  }}
                >
                  {user.role}
                </span>
                <span
                  style={{
                    background: user.isActive
                      ? `${colors.success}20`
                      : `${colors.danger}20`,
                    color: user.isActive ? colors.success : colors.danger,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 12,
                  }}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: colors.muted, fontSize: 13 }}>
                Last Login:
              </span>
              <span style={{ color: colors.text, fontSize: 13 }}>
                {formatDate(user.lastLogin)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: colors.muted, fontSize: 13 }}>
                Created:
              </span>
              <span style={{ color: colors.text, fontSize: 13 }}>
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              background: `${colors.danger}20`,
              border: `1px solid ${colors.danger}40`,
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
              color: colors.danger,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 20,
          }}
        >
          <button
            onClick={handleClose}
            disabled={isDeleting}
            style={{
              background: colors.border,
              color: colors.text,
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: isDeleting ? "not-allowed" : "pointer",
              opacity: isDeleting ? 0.6 : 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.background = colors.hover;
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.background = colors.border;
              }
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            style={{
              background: isDeleting ? colors.muted : colors.danger,
              color: colors.text,
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: isDeleting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: isDeleting ? 0.6 : 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.background = "#DC2626";
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.background = colors.danger;
              }
            }}
          >
            {isDeleting ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid white",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <TrashIcon style={{ width: 16, height: 16 }} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
}
