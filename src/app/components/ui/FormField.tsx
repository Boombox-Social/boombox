"use client";
import React from "react";

interface FormFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  type?: string;
}

export function FormField({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  multiline = false,
  rows = 4,
  className = "",
  type = "text",
}: FormFieldProps) {
  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <InputComponent
        type={multiline ? undefined : type}
        placeholder={placeholder}
        value={value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => onChange(e.target.value)}
        required={required}
        rows={multiline ? rows : undefined}
        className={`
          w-full
          bg-background
          text-foreground
          placeholder:text-muted-foreground
          border rounded-lg
          px-4 py-3
          text-sm
          outline-none
          transition-all duration-200
          resize-none
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          }
          hover:border-muted-foreground
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      />

      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}