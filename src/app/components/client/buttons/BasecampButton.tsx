import React, { useEffect, useState, useRef } from "react";
import { PencilSquareIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface BasecampProps {
  clientId: number;
}

export function BasecampButton({ clientId }: BasecampProps) {
  const [basecampLink, setBasecampLink] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clientId) return;
    const fetchLink = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/clients/${clientId}/basecamp-link`);
        const data = await res.json();
        const link = data.basecampLink || "";
        setBasecampLink(link);
        setInputValue(link);
        if (!link) {
          setEditing(true);
        }
      } catch (_err) {
        setError("Failed to load Basecamp link.");
      }
      setLoading(false);
    };
    fetchLink();
  }, [clientId]);

  // Prevent clicks outside and scrolling while editing
  useEffect(() => {
    if (!editing) return;

    document.body.style.overflow = 'hidden';

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [editing, basecampLink]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${clientId}/basecamp-link`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basecampLink: inputValue.trim() }),
      });
      if (!res.ok) throw new Error("Failed to save link");
      setBasecampLink(inputValue.trim());
      setEditing(false);
    } catch (_err) {
      setError("Failed to save Basecamp link.");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setInputValue(basecampLink);
    setEditing(false);
    setError(null);
  };

  const hasChanges = inputValue.trim() !== basecampLink && inputValue.trim() !== "";

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
    <>
      {/* Modal Overlay - Blocks all interactions outside the input */}
      {editing && (
        <div
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      )}

      <div 
        className={`flex flex-col gap-2 ${editing ? 'relative z-50' : ''}`}
        ref={containerRef}
      >
        {editing ? (
          <>
            <div className="flex gap-2">
              <input
                type="url"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md text-sm outline-none transition-all"
                style={{
                  border: "2px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--card-foreground)",
                }}
                placeholder="Enter Basecamp link"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && hasChanges) {
                    handleSave();
                  } else if (e.key === "Escape") {
                    handleCancel();
                  }
                }}
                autoFocus
              />
              {hasChanges ? (
                <button
                  className="px-3 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--success)",
                    color: "#ffffff",
                  }}
                  onClick={handleSave}
                  title="Save Basecamp Link (Enter)"
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
              ) : (
                <button
                  className="px-3 py-2 rounded-md transition-all duration-200"
                  style={{
                    background: "var(--danger)",
                    color: "#ffffff",
                  }}
                  onClick={handleCancel}
                  title="Cancel (Escape)"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#DC2626";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--danger)";
                  }}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
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
                if (basecampLink) window.open(basecampLink, "_blank");
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
              View Basecamp
            </button>
            <button
              className="px-3 py-2 rounded-md transition-all duration-200"
              style={{
                background: "var(--secondary)",
                border: "1px solid var(--border)",
              }}
              onClick={() => setEditing(true)}
              title="Edit Basecamp Link"
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
    </>
  );
}