"use client";
import React, { useState } from "react";
import { UserIcon, CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { UserRole } from "../../types";
import { Modal, FormField } from "../ui";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
};

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => Promise<void>;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
}

export function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    role: UserRole.SMM,
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      // Wrap console with production check
      if (process.env.NODE_ENV !== "production") {
        console.error("Error creating user:", error);
      }
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create user",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormField = (field: keyof CreateUserData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: UserRole.SMM,
      avatar: "",
    });
    setErrors({});
    onClose();
  };

  const roleOptions = [
    {
      value: UserRole.SMM,
      label: "SMM (Social Media Manager)",
      color: colors.accent,
    },
    { value: UserRole.ADMIN, label: "Admin", color: colors.warning },
    { value: UserRole.SUPER_ADMIN, label: "Super Admin", color: colors.danger },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New User">
      <div style={{ width: "auto", minWidth: "300px" }}>
        {/* Error Display */}
        {errors.submit && (
          <div
            style={{
              background: `${colors.danger}20`,
              border: `1px solid ${colors.danger}40`,
              borderRadius: 8,
              padding: 16,
              marginBottom: 20,
              color: colors.danger,
              fontSize: 14,
            }}
          >
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Avatar Preview */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: colors.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: "bold",
                  color: colors.text,
                  border: `2px solid ${colors.border}`,
                }}
              >
                {formData.name ? (
                  formData.name.charAt(0).toUpperCase()
                ) : (
                  <UserIcon style={{ width: 40, height: 40 }} />
                )}
              </div>
            </div>

            {/* Form Fields */}
            <FormField
              label="Full Name *"
              placeholder="Enter user's full name"
              value={formData.name}
              onChange={updateFormField("name")}
              error={errors.name}
            />

            <FormField
              label="Email Address *"
              placeholder="user@company.com"
              value={formData.email}
              onChange={updateFormField("email")}
              error={errors.email}
              type="email"
            />

            <FormField
              label="Password *"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={updateFormField("password")}
              error={errors.password}
              type="password"
            />

            {/* Role Selection */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                User Role *
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {roleOptions.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 12,
                      borderRadius: 8,
                      border: `1px solid ${colors.border}`,
                      background:
                        formData.role === option.value
                          ? `${option.color}20`
                          : colors.bg,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={(e) => updateFormField("role")(e.target.value)}
                      style={{
                        accentColor: option.color,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          color: colors.text,
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {option.label}
                      </div>
                      <div style={{ color: colors.muted, fontSize: 12 }}>
                        {option.value === UserRole.SMM &&
                          "Can view and manage assigned clients"}
                        {option.value === UserRole.ADMIN &&
                          "Can manage all clients and most settings"}
                        {option.value === UserRole.SUPER_ADMIN &&
                          "Full system access and user management"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Avatar URL (Optional) */}
            <FormField
              label="Avatar URL (Optional)"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatar || ""}
              onChange={updateFormField("avatar")}
              error={errors.avatar}
            />

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 20,
                paddingTop: 20,
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                style={{
                  background: colors.border,
                  color: colors.text,
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  transition: "background 0.2s",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: isLoading ? colors.muted : colors.success,
                  color: colors.text,
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background 0.2s",
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid white",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon style={{ width: 16, height: 16 }} />
                    Create User
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Add spinning animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Modal>
  );
}
