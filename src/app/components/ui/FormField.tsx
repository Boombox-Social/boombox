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
  style?: React.CSSProperties;
  type?: string;
  autoComplete?: string;
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
  style,
  type = "text",
  autoComplete,
}: FormFieldProps) {
  const baseStyles: React.CSSProperties = {
    width: "100%",
    background: "var(--background)",
    color: "var(--card-foreground)",
    border: `2px solid ${error ? "var(--danger)" : "var(--border)"}`,
    borderRadius: 6,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
    ...style,
  };

  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          className="block text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          {label}
          {required && (
            <span style={{ color: "var(--danger)" }} className="ml-1">
              *
            </span>
          )}
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
        autoComplete={autoComplete}
        style={baseStyles}
        onFocus={(
          e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          e.target.style.borderColor = error ? "var(--danger)" : "var(--primary)";
          e.target.style.boxShadow = error
            ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
            : "0 0 0 3px rgba(37, 99, 235, 0.1)";
        }}
        onBlur={(
          e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          e.target.style.borderColor = error ? "var(--danger)" : "var(--border)";
          e.target.style.boxShadow = "none";
        }}
        className={multiline ? "resize-none" : ""}
      />

      {error && (
        <div 
          className="flex items-start gap-2 text-sm mt-1"
          style={{ color: "var(--danger)" }}
        >
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}