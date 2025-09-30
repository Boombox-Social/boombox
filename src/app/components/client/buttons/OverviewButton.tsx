import React, { useEffect, useState } from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface OverviewButtonProps {
  clientId: number;
}

export function OverviewButton({ clientId }: OverviewButtonProps) {
  const [overviewLink, setOverviewLink] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the link on mount
  useEffect(() => {
    if (!clientId) return;
    const fetchLink = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/clients/${clientId}/overview-link`);
        const data = await res.json();
        setOverviewLink(data.businessSummaryLink || "");
      } catch (_err) {
        setError("Failed to load overview link.");
      }
      setLoading(false);
    };
    fetchLink();
  }, [clientId]);

  // Save the link
  const handleSave = async () => {
    if (!overviewLink) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${clientId}/overview-link`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessSummaryLink: overviewLink }),
      });
      if (!res.ok) throw new Error("Failed to save link");
      setEditing(false);
    } catch (_err) {
      setError("Failed to save overview link.");
    }
    setSaving(false);
  };

  if (!clientId) return null;

  if (loading) {
    return (
      <div className="flex justify-center gap-2 mt-5 text-[#94A3B8]">
        Loading...
      </div>
    );
  }

  // Always show input and save button if there is no link or editing
  if (!overviewLink || editing) {
    return (
      <div className="flex justify-center gap-2 mt-5">
        <input
          type="url"
          value={overviewLink}
          onChange={(e) => setOverviewLink(e.target.value)}
          className="px-5 py-2 rounded-lg border border-[#2D3142] text-base w-full max-w-full min-w-[80px] focus:outline-none"
          autoFocus
          placeholder="Enter Overview link"
        />
        <button
          className="bg-[#2563eb] text-[#F1F5F9] border border-[#2D3142] rounded-lg px-2 py-2 text-lg cursor-pointer transition-colors flex items-center min-w-[40px] justify-center"
          onClick={handleSave}
          title="Save Overview Link"
          disabled={!overviewLink || saving}
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

  // If there is a link, show the link and edit button
  return (
    <div className="flex justify-center gap-2 mt-5">
      <a
        href={overviewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1E40AF] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors w-full max-w-full min-w-[80px] block hover:bg-[#2563eb] focus:outline-none text-center"
        style={{ textDecoration: "none" }}
      >
        Business Overview
      </a>
      <button
        className="bg-[#2D3142] text-[#F1F5F9] rounded-lg px-2 py-2 cursor-pointer transition-colors min-w-[40px] flex items-center justify-center hover:bg-[#3c4152] focus:outline-none"
        onClick={() => setEditing(true)}
        title="Edit Overview Link"
      >
        <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
      </button>
    </div>
  );
}
