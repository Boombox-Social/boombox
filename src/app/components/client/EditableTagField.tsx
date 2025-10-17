"use client";
import React, { useState } from "react";

interface EditableTagFieldProps {
  label: string;
  value: string[];
  fallback?: string[] | null;
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

  return (
    <div style={{ gridColumn: gridColumn || "auto" }}>
      <div className="font-bold mb-1.5 text-foreground text-sm">
        {label}
      </div>

      {editing ? (
        <div>
          {/* Current Items */}
          {value.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {value.map((item, index) => (
                <div
                  key={index}
                  className="bg-primary text-primary-foreground px-2 py-1 rounded flex items-center gap-1.5 text-xs"
                >
                  {isLink ? (
                    <a
                      href={item}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-foreground no-underline hover:underline"
                    >
                      {item}
                    </a>
                  ) : (
                    <span>{item}</span>
                  )}
                  <button
                    className="bg-transparent border-none text-primary-foreground cursor-pointer text-xs p-0 hover:opacity-80 transition-opacity"
                    onClick={() => removeItem(index)}
                    aria-label={`Remove ${item}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Item */}
          <div className="flex gap-2">
            <input
              className="
                flex-1 bg-background text-foreground
                border border-border rounded-md
                px-3 py-2 text-sm
                outline-none
                focus:ring-2 focus:ring-primary focus:border-transparent
                transition-all
                placeholder:text-muted-foreground
              "
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              placeholder={`Add ${label.toLowerCase()} (comma-separated)`}
            />
            <button
              className="
                bg-primary text-primary-foreground
                border-none rounded-md
                px-4 py-2 text-sm
                cursor-pointer
                hover:opacity-90
                transition-opacity
              "
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-[40px] flex flex-wrap gap-2 items-start px-3 py-2 border border-transparent rounded-md">
          {displayValue.length > 0 ? (
            displayValue.map((item, index) => (
              <div
                key={index}
                className="bg-secondary text-foreground px-2 py-1 rounded text-xs"
              >
                {isLink ? (
                  <a
                    href={item}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary no-underline hover:underline"
                  >
                    {item}
                  </a>
                ) : (
                  <span>{item}</span>
                )}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground italic text-sm">
              No {label.toLowerCase()} provided
            </div>
          )}
        </div>
      )}
    </div>
  );
}