"use client";
import React, { useState } from "react";

interface EditableFieldProps {
  label: string;
  value: string;
  fallback?: string | null;
  editing: boolean;
  onChange: (value: string) => void;
  multiline?: boolean;
}

export function EditableField({
  label,
  value,
  fallback,
  editing,
  onChange,
  multiline = false,
}: EditableFieldProps) {
  // FIXED: Handle undefined/null values properly
  const safeValue = value ?? fallback ?? "";
  const [localValue, setLocalValue] = useState<string>(safeValue);

  // Update localValue when value prop changes
  React.useEffect(() => {
    const updatedValue = value ?? fallback ?? "";
    setLocalValue(updatedValue);
  }, [value, fallback]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const InputComponent = multiline ? "textarea" : "input";

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
        <InputComponent
          value={localValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
            handleChange(e.target.value)
          }
          rows={multiline ? 4 : undefined}
          className={`w-full px-3 py-2 rounded-md text-sm outline-none transition-all ${
            multiline ? "resize-none" : ""
          }`}
          style={{
            border: "2px solid var(--border)",
            background: "var(--card)",
            color: "var(--card-foreground)",
          }}
          onFocus={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      ) : (
        <p 
          className="text-sm"
          style={{ color: localValue ? "var(--card-foreground)" : "var(--muted)" }}
        >
          {localValue || `No ${label.toLowerCase()} set`}
        </p>
      )}
    </div>
  );
}