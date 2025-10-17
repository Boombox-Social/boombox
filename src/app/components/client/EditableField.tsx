"use client";
import React from "react";

interface EditableFieldProps {
  label: string;
  value: string;
  fallback?: string | null;
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
  const displayValue = value || fallback || "";

  return (
    <div style={{ gridColumn: gridColumn || "auto" }}>
      <div className="font-bold mb-1.5 text-foreground text-sm">
        {label}
      </div>

      {editing ? (
        multiline ? (
          <textarea
            className="
              w-full bg-background text-foreground
              border border-border rounded-md
              px-3 py-2 text-sm min-h-[60px]
              resize-y outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all
            "
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <input
            className="
              w-full bg-background text-foreground
              border border-border rounded-md
              px-3 py-2 text-sm
              outline-none
              focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all
            "
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )
      ) : (
        <div
          className={`
            text-sm px-3 py-2 rounded-md
            border border-transparent
            whitespace-normal break-words
            ${multiline ? 'min-h-[60px]' : ''}
            ${displayValue ? 'text-foreground' : 'text-muted-foreground italic'}
          `}
        >
          {displayValue || `No ${label.toLowerCase()} provided`}
        </div>
      )}
    </div>
  );
}