"use client";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LoginFormData } from "../../types/auth.types";

interface LoginFormProps {
  onSubmit?: (formData: LoginFormData) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const updateFormField =
    (field: keyof LoginFormData) => (value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (error) setError("");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await login(formData);
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <label
          className="block text-xs font-semibold mb-1 uppercase tracking-wide"
          htmlFor="email"
          style={{ color: "var(--muted)" }}
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => updateFormField("email")(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-md text-sm outline-none transition-all"
          style={{
            border: "2px solid var(--border)",
            background: "var(--background)",
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
      </div>

      <div>
        <label
          className="block text-xs font-semibold mb-1 uppercase tracking-wide"
          htmlFor="password"
          style={{ color: "var(--muted)" }}
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => updateFormField("password")(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-md text-sm outline-none transition-all"
          style={{
            border: "2px solid var(--border)",
            background: "var(--background)",
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
      </div>

      <div className="flex items-center justify-between text-xs">
        <label 
          className="flex items-center gap-2 cursor-pointer select-none"
          style={{ color: "var(--card-foreground)" }}
        >
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => updateFormField("rememberMe")(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{ 
              accentColor: "var(--primary)",
              border: "2px solid var(--border)"
            }}
          />
          <span className="text-sm">Keep me signed in</span>
        </label>
      </div>

      {error && (
        <div 
          className="rounded-md px-3 py-2.5 text-sm flex items-start gap-2"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "var(--danger)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <svg 
            className="w-5 h-5 flex-shrink-0 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="border-none rounded-md px-4 py-3 font-semibold cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-1"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = "#1E40AF";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(37, 99, 235, 0.15)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--primary)";
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg 
              className="animate-spin h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>

    </form>
  );
}

export type { LoginFormData };