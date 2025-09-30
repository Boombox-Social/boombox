import React, { useEffect, useState } from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface ViewAiStrategyButtonProps {
  clientId: number;
}

export function ViewAiStrategyButton({ clientId }: ViewAiStrategyButtonProps) {
  const [aiLink, setAiLink] = useState("");
  const [editingAiLink, setEditingAiLink] = useState(false);
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
        const res = await fetch(`/api/clients/${clientId}/ai-strategy-link`);
        const data = await res.json();
        setAiLink(data.strategyAiLink || "");
      } catch (_err) {
        setError("Failed to load AI Strategy link.");
      }
      setLoading(false);
    };
    fetchLink();
  }, [clientId]);

  // Save the link
  const handleSave = async () => {
    if (!aiLink) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${clientId}/ai-strategy-link`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategyAiLink: aiLink }),
      });
      if (!res.ok) throw new Error("Failed to save link");
      setEditingAiLink(false);
    } catch (_err) {
      setError("Failed to save AI Strategy link.");
    }
    setSaving(false);
  };

  const shouldShowInput = editingAiLink || !aiLink;

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
      {shouldShowInput ? (
        <>
          <input
            type="text"
            value={aiLink}
            onChange={(e) => setAiLink(e.target.value)}
            className="px-5 py-2 rounded-lg border border-[#2D3142] text-base w-full max-w-full min-w-[80px] focus:outline-none"
            autoFocus
            placeholder="Enter the AI Strategy link"
          />
          <button
            className="bg-[#2563eb] text-[#F1F5F9] border border-[#2D3142] rounded-lg px-2 py-2 text-lg cursor-pointer transition-colors flex items-center min-w-[40px] justify-center"
            onClick={handleSave}
            title="Save Ai Link"
            disabled={!aiLink || saving}
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
            className="bg-[#1E40AF] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors w-full max-w-full min-w-[80px] block hover:bg-[#2563eb] focus:outline-none"
            onClick={() => {
              if (aiLink) window.open(aiLink, "_blank");
            }}
          >
            View AI Strategy
          </button>
          <button
            className="bg-[#2D3142] text-[#F1F5F9] border-none rounded-lg px-2 py-2 text-lg cursor-pointer transition-colors min-w-[40px] flex items-center justify-center"
            onClick={() => setEditingAiLink(true)}
            title="Edit Ai Link"
          >
            <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
          </button>
        </>
      )}
    </div>
  );
}
