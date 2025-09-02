import React from "react";
import { COLORS, UI_CONFIG } from "../../constants";

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
}: FormFieldProps) {
  const baseStyles: React.CSSProperties = {
    width: "100%",
    background: COLORS.bg,
    color: COLORS.text,
    border: `1px solid ${error ? "#EF4444" : COLORS.border}`,
    borderRadius: UI_CONFIG.BORDER_RADIUS.MEDIUM,
    padding: "12px 16px",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    ...style,
  };

  const focusStyles = {
    borderColor: error ? "#EF4444" : COLORS.accent,
    boxShadow: error
      ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
      : `0 0 0 3px rgba(37, 99, 235, 0.1)`,
  };

  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[#F1F5F9]">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <InputComponent
        type={multiline ? undefined : "text"}
        placeholder={placeholder}
        value={value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => onChange(e.target.value)}
        required={required}
        rows={multiline ? rows : undefined}
        style={baseStyles}
        onFocus={(
          e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          Object.assign(e.target.style, focusStyles);
        }}
        onBlur={(
          e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          e.target.style.borderColor = error ? "#EF4444" : COLORS.border;
          e.target.style.boxShadow = "none";
        }}
        className="resize-none"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
