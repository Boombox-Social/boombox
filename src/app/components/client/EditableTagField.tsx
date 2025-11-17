"use client";
import React, { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface EditableTagFieldProps {
  label: string;
  value: string[];
  fallback?: string[] | null;
  editing: boolean;
  onChange: (value: string[]) => void;
  isLink?: boolean;
}

export function EditableTagField({
  label,
  value,
  fallback,
  editing,
  onChange,
  isLink = false,
}: EditableTagFieldProps) {
  // FIXED: Handle undefined/null values properly
  const safeValue = Array.isArray(value) ? value : (Array.isArray(fallback) ? fallback : []);
  const [localValues, setLocalValues] = useState<string[]>(safeValue);
  const [newTag, setNewTag] = useState("");

  // Update localValues when value prop changes
  React.useEffect(() => {
    const updatedValue = Array.isArray(value) ? value : (Array.isArray(fallback) ? fallback : []);
    setLocalValues(updatedValue);
  }, [value, fallback]);

  const handleAddTag = () => {
    if (newTag.trim() && !localValues.includes(newTag.trim())) {
      const updatedValues = [...localValues, newTag.trim()];
      setLocalValues(updatedValues);
      onChange(updatedValues);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedValues = localValues.filter((tag) => tag !== tagToRemove);
    setLocalValues(updatedValues);
    onChange(updatedValues);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div 
      className="p-4 rounded-md transition-all duration-200"
      style={{
        background: "var(--background)",
        border: "1px solid var(--border)",
      }}
    >
      <label 
        className="block text-xs font-semibold uppercase tracking-wide mb-3"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>

      {editing ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Add ${isLink ? "link" : "tag"}...`}
              className="flex-1 px-3 py-2 rounded-md text-sm outline-none transition-all"
              style={{
                border: "2px solid var(--border)",
                background: "var(--card)",
                color: "var(--card-foreground)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              onClick={handleAddTag}
              type="button"
              className="px-3 py-2 rounded-md transition-all duration-200"
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
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {localValues.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium"
                style={{
                  background: "var(--secondary)",
                  color: "var(--card-foreground)",
                }}
              >
                {isLink ? (
                  <a
                    href={tag}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--primary)" }}
                  >
                    {tag}
                  </a>
                ) : (
                  tag
                )}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  type="button"
                  className="hover:opacity-70 transition-opacity"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {localValues.length > 0 ? (
            localValues.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1.5 rounded-md text-sm font-medium"
                style={{
                  background: "var(--secondary)",
                  color: "var(--card-foreground)",
                }}
              >
                {isLink ? (
                  <a
                    href={tag}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--primary)" }}
                  >
                    {tag}
                  </a>
                ) : (
                  tag
                )}
              </span>
            ))
          ) : (
            <span 
              className="text-sm italic"
              style={{ color: "var(--muted)" }}
            >
              No {label.toLowerCase()} added
            </span>
          )}
        </div>
      )}
    </div>
  );
}