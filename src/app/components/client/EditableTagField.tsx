// File Structure: src/app/components/client/EditableTagField.tsx - Editable tag field component for arrays
"use client";
import React, { useState } from "react";

const colors = {
  bg: "#181A20",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  accent: "#2563eb",
};

interface EditableTagFieldProps {
  label: string;
  value: string[];
  fallback?: string[] | null; // FIXED: Allow null values
  editing: boolean;
  onChange: (value: string[]) => void;
  isLink?: boolean;
  gridColumn?: string;
}

export function EditableTagField({
  label,
  value,
  fallback,
  editing,
  onChange,
  isLink = false,
  gridColumn,
}: EditableTagFieldProps) {
  const [inputValue, setInputValue] = useState("");
  // FIXED: Handle null values properly
  const displayValue = value.length > 0 ? value : fallback || [];

  const addItem = () => {
    if (inputValue.trim()) {
      const newItems = inputValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      onChange([...value, ...newItems]);
      setInputValue("");
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const fieldStyle = {
    gridColumn: gridColumn || "auto",
  };

  return (
    <div style={fieldStyle}>
      <div
        style={{
          fontWeight: 700,
          marginBottom: 6,
          color: colors.text,
          fontSize: 14,
        }}
      >
        {label}
      </div>

      {editing ? (
        <div>
          {/* Current Items */}
          {value.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {value.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: colors.accent,
                    color: colors.text,
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {isLink ? (
                    <a
                      href={item}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: colors.text,
                        textDecoration: "none",
                      }}
                    >
                      {item}
                    </a>
                  ) : (
                    item
                  )}
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: colors.text,
                      cursor: "pointer",
                      fontSize: 12,
                      padding: 0,
                    }}
                    onClick={() => removeItem(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Item */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{
                flex: 1,
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                padding: "8px 12px",
                fontSize: 14,
                outline: "none",
              }}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              placeholder={`Add ${label.toLowerCase()} (comma-separated)`}
            />
            <button
              style={{
                background: colors.accent,
                color: colors.text,
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: 14,
                cursor: "pointer",
              }}
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            minHeight: 40,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "flex-start",
            padding: "8px 12px",
            border: `1px solid transparent`,
            borderRadius: 6,
          }}
        >
          {displayValue.length > 0 ? (
            displayValue.map((item, index) => (
              <div
                key={index}
                style={{
                  background: colors.border,
                  color: colors.text,
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                {isLink ? (
                  <a
                    href={item}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: colors.accent,
                      textDecoration: "none",
                    }}
                  >
                    {item}
                  </a>
                ) : (
                  item
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                color: colors.muted,
                fontStyle: "italic",
                fontSize: 14,
              }}
            >
              No {label.toLowerCase()} provided
            </div>
          )}
        </div>
      )}
    </div>
  );
}
