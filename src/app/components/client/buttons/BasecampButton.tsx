import React, { useEffect, useState } from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface BasecampButtonProps {
  clientId: number;
}

export function BasecampButton({ clientId }: BasecampButtonProps) {
  const [basecampLink, setBasecampLink] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    const fetchLink = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/clients/${clientId}/basecamp-link`);
        const data = await res.json();
        setBasecampLink(data.basecampLink || "");
      } catch (_err) {
        setError("Failed to load Basecamp link.");
      }
      setLoading(false);
    };
    fetchLink();
  }, [clientId]);

  const handleSave = async () => {
    if (!basecampLink) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${clientId}/basecamp-link`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basecampLink }),
      });
      if (!res.ok) throw new Error("Failed to save link");
      setEditing(false);
    } catch (_err) {
      setError("Failed to save Basecamp link.");
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

  return (
    <div className="flex justify-center gap-2 mt-5">
      {editing || !basecampLink ? (
        <>
          <input
            type="text"
            value={basecampLink}
            onChange={(e) => setBasecampLink(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#2D3142] text-base w-[180px] max-w-[220px] focus:outline-none"
            autoFocus
            placeholder="Enter Basecamp link"
          />
          <button
            className="bg-[#2563eb] text-[#F1F5F9] rounded-lg px-2 py-2 cursor-pointer transition-colors min-w-[40px] flex items-center justify-center"
            onClick={handleSave}
            title="Save Basecamp Link"
            disabled={!basecampLink || saving}
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircleIcon className="w-4 h-4 text-[#F1F5F9]" />
            )}
          </button>
          {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
        </>
      ) : (
        <>
          <button
            className="bg-[#2563eb] text-[#F1F5F9] rounded-lg px-4 py-2 cursor-pointer transition-colors w-full max-w-[220px] min-w-[80px] block"
            onClick={() => window.open(basecampLink, "_blank")}
          >
            Go to Basecamp
          </button>
          <button
            className="bg-[#2D3142] text-[#F1F5F9] rounded-lg px-2 py-2 cursor-pointer transition-colors min-w-[40px] flex items-center justify-center"
            onClick={() => setEditing(true)}
            title="Edit Basecamp Link"
          >
            <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
          </button>
        </>
      )}
    </div>
  );
}
