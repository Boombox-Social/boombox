"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrashIcon,
  UserIcon,
  UsersIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/solid";
import { UserRole } from "../../../generated/prisma";
import { useAuth } from "../../hooks/useAuth";
import { useClientManagement } from "../../hooks";
import { Modal } from "../ui/Modal";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Client } from "../../types/client.types";
import { UserAssignmentSelector } from "./UserAssignmentSelector";

interface ClientProfileProps {
  client: Client;
}

interface AssignedSMM {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export function ClientProfile({ client }: ClientProfileProps) {
  const { authState } = useAuth();
  const { deleteClient, archiveClient, loadClients } = useClientManagement();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Archive modal state
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string>("");

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(
    client.assignedUserIds || []
  );
  const [assignedSMMs, setAssignedSMMs] = useState<AssignedSMM[]>([]);
  const [loadingSMMs, setLoadingSMMs] = useState(true);

  const isSuperAdmin = authState.user?.role === UserRole.SUPER_ADMIN;

  const handleArchiveClick = () => {
    setShowArchiveModal(true);
    setArchiveError("");
  };

  useEffect(() => {
    const fetchAssignedSMMs = async () => {
      setLoadingSMMs(true);
      try {
        const res = await fetch(`/api/clients/${client.id}/assigned-users`);
        const data = await res.json();
        setAssignedSMMs(data.users || []);
      } catch (_err) {
        setAssignedSMMs([]);
      }
      setLoadingSMMs(false);
    };
    if (client.id) fetchAssignedSMMs();
  }, [client.id]);

  const handleArchiveConfirm = async () => {
    if (typeof client.id !== "number") return;
    setIsArchiving(true);
    setArchiveError("");
    try {
      await archiveClient(client.id);
      console.log("loading new client list...");
      await loadClients();
      setShowArchiveModal(false);
      router.push("/dashboard");
    } catch (error) {
      setArchiveError(
        error instanceof Error
          ? error.message
          : "Failed to archive client. Please try again."
      );
    } finally {
      setIsArchiving(false);
    }
  };

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
      setShowDeleteModal(false);
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

  const handleAssignSave = async () => {
    await fetch(`/api/clients/${client.id}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: selectedUserIds }),
    });
    setShowAssignModal(false);
    // Refresh assigned SMMs
    const res = await fetch(`/api/clients/${client.id}/assigned-users`);
    const data = await res.json();
    setAssignedSMMs(data.users || []);
  };

  return (
    <>
      <div 
        className="rounded-lg p-4 sm:p-6 relative overflow-hidden"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        {isSuperAdmin && (
          <div className="absolute top-5 right-5 gap-2 hidden md:flex">
            <button
              onClick={handleArchiveClick}
              disabled={isArchiving}
              className="text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--warning)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                if (!isArchiving) e.currentTarget.style.background = "#D97706";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--warning)";
              }}
              title="Archive"
            >
              <ArchiveBoxIcon className="w-4 h-4" />
              Archive
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-2 transition-all duration-200"
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
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}

        <div className="flex items-start gap-4 sm:gap-6">
          {/* Client Logo/Avatar */}
          <div className="flex-shrink-0">
            {client.logo ? (
              <img
                src={client.logo}
                alt="Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                style={{
                  border: "2px solid var(--border)",
                }}
              />
            ) : (
              <div 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                {client.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <h2 
              className="text-lg sm:text-xl font-bold break-words md:pr-44 sm:pr-14 tracking-tight"
              style={{ color: "var(--card-foreground)" }}
            >
              {client.name}
            </h2>
            <p 
              className="text-xs sm:text-sm break-words mt-1 sm:pr-14"
              style={{ color: "var(--muted)" }}
            >
              {client.address}
            </p>
            <p 
              className="text-xs sm:text-sm mt-2"
              style={{ color: "var(--muted)" }}
            >
              Industry: {client.industry}
            </p>

            {/* Mobile: Archive & Delete Buttons (below Industry) */}
            {isSuperAdmin && (
              <div className="flex flex-row gap-2 mt-4 md:hidden">
                <button
                  onClick={handleArchiveClick}
                  disabled={isArchiving}
                  className="flex-1 text-xs font-semibold px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--warning)",
                    color: "#ffffff",
                  }}
                  title="Archive"
                >
                  <ArchiveBoxIcon className="w-4 h-4" />
                  {isArchiving ? "Archiving..." : "Archive"}
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 text-xs font-semibold px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: "var(--danger)",
                    color: "#ffffff",
                  }}
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}

            {/* Assigned Social Media Managers Section */}
            <div 
              className="mt-4 rounded-lg p-4"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <UsersIcon 
                    className="w-5 h-5" 
                    style={{ color: "var(--primary)" }}
                  />
                  <h3 
                    className="text-sm font-semibold"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Assigned Social Media Managers
                  </h3>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="transition-colors"
                    style={{ color: "var(--primary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#1E40AF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--primary)";
                    }}
                    title="Edit Assignments"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {loadingSMMs ? (
                  <span 
                    className="text-xs italic"
                    style={{ color: "var(--muted)" }}
                  >
                    Loading...
                  </span>
                ) : assignedSMMs.length > 0 ? (
                  assignedSMMs.map((smm) => (
                    <div
                      key={smm.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200"
                      style={{
                        background: "var(--secondary)",
                        border: "1px solid var(--border)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: "rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        {smm.avatar ? (
                          <img
                            src={smm.avatar}
                            alt={smm.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <UserIcon 
                            className="w-3 h-3" 
                            style={{ color: "var(--primary)" }}
                          />
                        )}
                      </div>
                      <span 
                        className="text-xs font-medium truncate max-w-[120px]"
                        style={{ color: "var(--card-foreground)" }}
                      >
                        {smm.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <p 
                    className="text-xs italic"
                    style={{ color: "var(--muted)" }}
                  >
                    No SMMs assigned
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Client"
      >
        <div className="py-5">
          {/* Warning Message */}
          <div 
            className="rounded-lg p-4 mb-5 flex items-start gap-3"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <TrashIcon 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              style={{ color: "var(--danger)" }}
            />
            <div>
              <h3 
                className="text-base font-semibold mb-2"
                style={{ color: "var(--danger)" }}
              >
                Permanent Client Deletion
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: "var(--card-foreground)" }}
              >
                You are about to permanently delete{" "}
                <strong>{client.name}</strong>. This action cannot be undone and
                will remove all client data.
              </p>
            </div>
          </div>

          {/* Error Display */}
          {deleteError && (
            <div 
              className="rounded-lg p-3 mb-5 text-sm"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "var(--danger)",
              }}
            >
              {deleteError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--secondary)",
                color: "var(--card-foreground)",
                border: "2px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) e.currentTarget.style.background = "var(--background)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                background: "var(--danger)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) e.currentTarget.style.background = "#DC2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--danger)";
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

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        title="Archive Client"
        maxWidth="28em"
      >
        <div className="p-4">
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--card-foreground)" }}
          >
            Confirm Archive
          </h3>
          <p 
            className="mb-4"
            style={{ color: "var(--muted)" }}
          >
            Are you sure you want to archive <strong>{client.name}</strong>?
            This will move the client to the archive and remove it from the
            active list.
          </p>
          {archiveError && (
            <div 
              className="rounded-lg p-3 mb-2 text-sm"
              style={{
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "var(--warning)",
              }}
            >
              {archiveError}
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowArchiveModal(false)}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
              disabled={isArchiving}
              type="button"
              style={{
                background: "var(--secondary)",
                color: "var(--card-foreground)",
                border: "2px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                if (!isArchiving) e.currentTarget.style.background = "var(--background)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleArchiveConfirm}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isArchiving}
              type="button"
              style={{
                background: "var(--warning)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                if (!isArchiving) e.currentTarget.style.background = "#D97706";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--warning)";
              }}
            >
              {isArchiving ? (
                <>
                  <span 
                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                  />
                  Archiving...
                </>
              ) : (
                <>
                  <ArchiveBoxIcon className="w-5 h-5" />
                  Archive
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign SMM Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Social Media Managers"
      >
        <div className="py-5">
          <div className="mb-4">
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--card-foreground)" }}
            >
              Select SMMs to assign
            </label>
            <UserAssignmentSelector
              clientId={client.id}
              initialAssignedUserIds={selectedUserIds}
              onChange={setSelectedUserIds}
              canEdit={isSuperAdmin}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                background: "var(--secondary)",
                color: "var(--card-foreground)",
                border: "2px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--background)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
              }}
            >
              Close
            </button>
            <button
              onClick={handleAssignSave}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
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
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}