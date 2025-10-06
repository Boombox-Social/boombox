import React, { useEffect, useState } from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface DriveButtonProps {
  clientId: number;
  initialDriveLink?: string | null;
}

export function DriveButton({ clientId, initialDriveLink }: DriveButtonProps) {
  const [driveLink, setDriveLink] = useState(initialDriveLink || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when prop changes
  useEffect(() => {
    setDriveLink(initialDriveLink || "");
  }, [initialDriveLink]);

  // Save the link
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smmDriveLink: driveLink }),
      });
      if (!res.ok) throw new Error("Failed to save link");
      setEditing(false);
    } catch (_err) {
      setError("Failed to save drive link.");
    }
    setSaving(false);
  };

  // Helper to extract display text
  const getDisplayText = (url: string) => {
    try {
      const cleanUrl = url.replace(/\/$/, "");
      return cleanUrl.split("/").pop() || url;
    } catch {
      return url;
    }
  };

  if (!clientId) return null;

  if (loading) {
    return (
      <div className="flex justify-center gap-2 mt-5 text-[#94A3B8]">
        Loading...
      </div>
    );
  }

  // Show input if editing or no link
  if (!driveLink || editing) {
    return (
      <div className="flex justify-center gap-2 mt-5">
        <input
          type="url"
          value={driveLink}
          onChange={(e) => setDriveLink(e.target.value)}
          className="px-5 py-2 rounded-lg border border-[#2D3142] text-base w-full max-w-full min-w-[80px] focus:outline-none"
          autoFocus
          placeholder="Enter Google Drive link"
        />
        <button
          className="bg-[#2563eb] text-[#F1F5F9] border border-[#2D3142] rounded-lg px-2 py-2 text-lg cursor-pointer transition-colors flex items-center min-w-[40px] justify-center"
          onClick={handleSave}
          title="Save Drive Link"
          disabled={saving}
        >
          {saving ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckCircleIcon className="w-4 h-4 text-[#F1F5F9]" />
          )}
        </button>
        {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
      </div>
    );
  }

  // Show link with edit button
  return (
    <div className="flex justify-center gap-2 mt-5">
      <a
        href={driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#2563eb] text-[#F1F5F9] border-none rounded-lg px-5 py-2 cursor-pointer transition-colors w-full max-w-full min-w-[80px] block hover:bg-[#2E7D32] focus:outline-none text-center"
        style={{ textDecoration: "none" }}
      >
        Client Drive Link
      </a>
      <button
        className="bg-[#2D3142] text-[#F1F5F9] rounded-lg px-2 py-2 cursor-pointer transition-colors min-w-[40px] flex items-center justify-center hover:bg-[#3c4152] focus:outline-none"
        onClick={() => setEditing(true)}
        title="Edit Drive Link"
      >
        <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
      </button>
    </div>
  );
}
