// File Structure: src/app/components/client/EditableField.tsx - Editable text field component for client information
"use client";
import React from "react";

const colors = {
  bg: "#181A20",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
};

interface EditableFieldProps {
  label: string;
  value: string;
  fallback?: string | null; // FIXED: Allow null values
  editing: boolean;
  onChange: (value: string) => void;
  multiline?: boolean;
  gridColumn?: string;
}

export function EditableField({
  label,
  value,
  fallback,
  editing,
  onChange,
  multiline = false,
  gridColumn,
}: EditableFieldProps) {
  // FIXED: Handle null values properly
  const displayValue = value || fallback || "";

  const fieldStyle = {
    gridColumn: gridColumn || "auto",
  };

  const inputStyle = {
    width: "100%",
    background: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 14,
    minHeight: multiline ? "60px" : "auto",
    resize: multiline ? ("vertical" as const) : ("none" as const),
    outline: "none",
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
        multiline ? (
          <textarea
            style={inputStyle}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <input
            style={inputStyle}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )
      ) : (
        <div
          style={{
            color: displayValue ? colors.text : colors.muted,
            fontSize: 14,
            fontStyle: displayValue ? "normal" : "italic",
            padding: "8px 12px",
            minHeight: multiline ? "60px" : "auto",
            border: `1px solid transparent`,
            borderRadius: 6,
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {displayValue || `No ${label.toLowerCase()} provided`}
        </div>
      )}
    </div>
  );
}
