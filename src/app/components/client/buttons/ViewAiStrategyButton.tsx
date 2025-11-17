import React, { useEffect, useState } from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface ViewAiStrategyButtonProps {
  clientId: number;
}

export function ViewAiStrategyButton({ clientId }: ViewAiStrategyButtonProps) {
  const [aiLink, setAiLink] = useState("");
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
        const res = await fetch(`/api/clients/${clientId}/ai-strategy-link`);
        const data = await res.json();
        const link = data.strategyAiLink || "";
        setAiLink(link);
        if (!link) {
          setEditing(true);
        }
      } catch (_err) {
        setError("Failed to load AI Strategy link.");
      }
      setLoading(false);
    };
    fetchLink();
  }, [clientId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${clientId}/ai-strategy-link`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategyAiLink: aiLink.trim() }),
      });
      if (!res.ok) throw new Error("Failed to save link");
      setEditing(false);
    } catch (_err) {
      setError("Failed to save AI Strategy link.");
    }
    setSaving(false);
  };

  if (!clientId) return null;

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center gap-2 py-3"
        style={{ color: "var(--muted)" }}
      >
        <div 
          className="w-4 h-4 rounded-full animate-spin"
          style={{
            border: "2px solid var(--border)",
            borderTopColor: "var(--primary)",
          }}
        />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {editing ? (
        <>
          <div className="flex gap-2">
            <input
              type="url"
              value={aiLink}
              onChange={(e) => setAiLink(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md text-sm outline-none transition-all"
              style={{
                border: "2px solid var(--border)",
                background: "var(--background)",
                color: "var(--card-foreground)",
              }}
              placeholder="Enter AI Strategy link"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && aiLink.trim()) {
                  handleSave();
                }
              }}
            />
            <button
              className="px-3 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--success)",
                color: "#ffffff",
              }}
              onClick={handleSave}
              title="Save AI Strategy Link"
              disabled={saving}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.background = "#059669";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--success)";
              }}
            >
              {saving ? (
                <div 
                  className="w-4 h-4 rounded-full animate-spin"
                  style={{
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTopColor: "#ffffff",
                  }}
                />
              ) : (
                <CheckCircleIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          {aiLink && (
            <button
              onClick={() => setEditing(false)}
              className="text-xs transition-colors self-start"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--card-foreground)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              Cancel
            </button>
          )}
        </>
      ) : (
        <div className="flex gap-2">
          <button
            className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            onClick={() => {
              if (aiLink) window.open(aiLink, "_blank");
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1E40AF";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--primary)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            View AI Strategy
          </button>
          <button
            className="px-3 py-2 rounded-md transition-all duration-200"
            style={{
              background: "var(--secondary)",
              border: "1px solid var(--border)",
            }}
            onClick={() => setEditing(true)}
            title="Edit AI Strategy Link"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--background)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--secondary)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <PencilSquareIcon 
              className="w-4 h-4" 
              style={{ color: "var(--primary)" }}
            />
          </button>
        </div>
      )}
      {error && (
        <div 
          className="text-xs p-2 rounded-md"
          style={{
            color: "var(--danger)",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}