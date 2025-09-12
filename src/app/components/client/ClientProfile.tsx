// components/client/ClientProfile.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  TrashIcon, 
  UserIcon, 
  UsersIcon, 
  PencilSquareIcon 
} from "@heroicons/react/24/solid";
import { UserRole } from "../../../generated/prisma";
import { useAuth } from "../../hooks/useAuth";
import { useClientManagement } from "../../hooks";
import { Modal } from "../ui/Modal";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Client } from "../../types/client.types";

interface ClientProfileProps {
  client: Client;
}

// Dummy assigned SMM data for UI (replace with real data later)
const assignedSMMs = [
  {
    id: 1,
    name: "John Doe",
    avatar: null,
    email: "john@example.com"
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: null,
    email: "jane@example.com"
  }
];


export function ClientProfile({ client }: ClientProfileProps) {
  const { authState } = useAuth();
  const { deleteClient } = useClientManagement();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [showAssignModal, setShowAssignModal] = useState(false);

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
      <div className="bg-[#23262F] rounded-xl border border-[#2D3142] p-6 relative">
        {/* Delete Button */}
        {isSuperAdmin && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        )}

        <div className="flex items-start gap-6">
          {/* Client Logo/Avatar */}
          <div className="flex-shrink-0">
            {client.logo ? (
              <img
                src={client.logo}
                alt="Logo"
                className="w-16 h-16 rounded-full object-cover bg-[#94A3B8]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-2xl font-bold">
                {client.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#F1F5F9] break-words">
              {client.name}
            </h2>
            <p className="text-[#94A3B8] text-sm break-words mt-1">
              {client.address}
            </p>
            <p className="text-[#94A3B8] text-sm mt-2">
              Industry: {client.industry}
            </p>

             {/* Assigned SMMs Section with Edit Button */}
            <div className="mt-4 p-3 bg-[#181A20] rounded-lg border border-[#2D3142]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-[#2563eb]" />
                  <span className="text-[#94A3B8] text-xs font-medium">
                    Assigned Social Media Managers
                  </span>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="p-1 hover:bg-[#2D3142] rounded-md transition-colors"
                    title="Edit Assignments"
                  >
                    <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {assignedSMMs.map((smm) => (
                  <div
                    key={smm.id}
                    className="flex items-center gap-2 px-2 py-1 bg-[#23262F] rounded-full border border-[#2D3142] hover:border-[#2563eb] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                      {smm.avatar ? (
                        <img
                          src={smm.avatar}
                          alt={smm.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <UserIcon className="w-3 h-3 text-[#2563eb]" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-[#F1F5F9] truncate max-w-[120px]">
                      {smm.name}
                    </span>
                  </div>
                ))}
                {assignedSMMs.length === 0 && (
                  <p className="text-[#94A3B8] text-xs italic">
                    No SMMs assigned
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Delete Modal - Update with Tailwind */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Client"
      >
        <div className="py-5">
          {/* Warning Message */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-5 flex items-start gap-3">
            <TrashIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-500 text-base font-semibold mb-2">
                Permanent Client Deletion
              </h3>
              <p className="text-[#F1F5F9] text-sm leading-relaxed">
                You are about to permanently delete{" "}
                <strong>{client.name}</strong>. This action cannot be undone and
                will remove all client data.
              </p>
            </div>
          </div>

          {/* Error Display */}
          {deleteError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-5 text-red-500 text-sm">
              {deleteError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className="px-6 py-3 bg-[#2D3142] text-[#F1F5F9] rounded-lg font-medium hover:bg-[#374151] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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

      {/* Assign SMM Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Social Media Managers"
      >
        <div className="py-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#F1F5F9] mb-2">
              Select SMMs to assign (dummy data)
            </label>
            <ul>
              {assignedSMMs.map((smm) => (
                <li key={smm.id} className="flex items-center gap-2 mb-2">
                  <UserIcon className="w-4 h-4 text-[#2563eb]" />
                  <span className="text-[#F1F5F9]">{smm.name}</span>
                  <span className="text-[#94A3B8] text-xs">{smm.email}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-6 py-2 bg-[#2D3142] text-[#F1F5F9] rounded-lg font-medium hover:bg-[#374151] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-6 py-2 bg-[#2563eb] text-white rounded-lg font-medium hover:bg-[#1E40AF] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}