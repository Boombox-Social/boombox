// components/client/ClientProfile.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Client } from "../../types";
import { UserRole } from "../../../generated/prisma"; // Import directly from Prisma
import { useAuth } from "../../hooks/useAuth";
import { useClientManagement } from "../../hooks";
import { Modal } from "../ui/Modal";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF",
  danger: "#EF4444",
  dangerHover: "#DC2626",
};

interface ClientProfileProps {
  client: Client;
}

export function ClientProfile({ client }: ClientProfileProps) {
  const { authState } = useAuth();
  const { deleteClient } = useClientManagement();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");

  // Check if current user is Super Admin
  const isSuperAdmin = authState.user?.role === UserRole.SUPER_ADMIN;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!client.id) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteClient(client.id);

      // Close modal first
      setShowDeleteModal(false);

      // Navigate back to dashboard after successful deletion
      router.push("/dashboard");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error deleting client:", error);
      }
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete client. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteError("");
  };

  return (
    <>
      <div
        style={{
          background: colors.card,
          borderRadius: 16,
          padding: 24,
          position: "relative",
          marginBottom: 24,
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* Delete Button (Super Admin Only) */}
        {isSuperAdmin && (
          <button
            onClick={handleDeleteClick}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: colors.danger,
              color: colors.text,
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.dangerHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.danger;
            }}
            title="Delete Client (Super Admin Only)"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        )}

        {/* Client Logo/Avatar */}
        <div
          style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}
        >
          {client.logo ? (
            <img
              src={client.logo}
              alt="Logo"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                background: colors.muted,
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.text,
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {client.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Client Information */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              wordBreak: "break-word",
              color: colors.text,
            }}
          >
            {client.name}
          </div>
          <div
            style={{
              color: colors.muted,
              fontSize: 15,
              wordBreak: "break-word",
            }}
          >
            {client.address}
          </div>
          <div
            style={{
              color: colors.muted,
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Industry: {client.industry}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Client"
      >
        <div style={{ padding: "20px 0" }}>
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
            <TrashIcon
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
                Permanent Client Deletion
              </h3>
              <p
                style={{
                  color: colors.text,
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                You are about to permanently delete{" "}
                <strong>{client.name}</strong>. This action cannot be undone and
                will remove all client data, including business information,
                strategies, and prompt templates.
              </p>
            </div>
          </div>

          {/* Client Summary */}
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
              Client Details:
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: colors.muted, fontSize: 13 }}>Name:</span>
                <span style={{ color: colors.text, fontSize: 13 }}>
                  {client.name}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: colors.muted, fontSize: 13 }}>
                  Industry:
                </span>
                <span style={{ color: colors.text, fontSize: 13 }}>
                  {client.industry}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: colors.muted, fontSize: 13 }}>
                  Address:
                </span>
                <span style={{ color: colors.text, fontSize: 13 }}>
                  {client.address}
                </span>
              </div>
              {client.createdAt && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: colors.muted, fontSize: 13 }}>
                    Created:
                  </span>
                  <span style={{ color: colors.text, fontSize: 13 }}>
                    {new Date(client.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {deleteError && (
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
              {deleteError}
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 24,
            }}
          >
            <button
              onClick={handleDeleteCancel}
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
              onClick={handleDeleteConfirm}
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
                  e.currentTarget.style.background = colors.dangerHover;
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
                  <LoadingSpinner size="small" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete Permanently</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
