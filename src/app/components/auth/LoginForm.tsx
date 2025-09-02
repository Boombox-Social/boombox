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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <label
          className="block text-sm font-semibold text-[#F1F5F9] mb-2"
          htmlFor="email"
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
          className="w-full px-4 py-3 rounded-lg border border-[#2D3142] bg-[#181A20] text-[#F1F5F9] text-[15px] outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
        />
      </div>

      <div>
        <label
          className="block text-sm font-semibold text-[#F1F5F9] mb-2"
          htmlFor="password"
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
          className="w-full px-4 py-3 rounded-lg border border-[#2D3142] bg-[#181A20] text-[#F1F5F9] text-[15px] outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-[#94A3B8] cursor-pointer">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => updateFormField("rememberMe")(e.target.checked)}
            className="accent-[#2563eb]"
          />
          Remember me
        </label>
        <a
          href="/auth/forgot-password"
          className="text-[#2563eb] no-underline font-medium hover:underline"
        >
          Forgot password?
        </a>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#2563eb] text-[#F1F5F9] border-none rounded-lg px-6 py-[14px] font-semibold cursor-pointer text-base disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#1E40AF] transition-colors"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export type { LoginFormData };
