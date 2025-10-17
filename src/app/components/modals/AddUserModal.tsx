"use client";
import React, { useState } from "react";
import { UserIcon, CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { UserRole } from "../../../generated/prisma";
import { Modal, FormField } from "../ui";

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
      description: "Can view and manage assigned clients",
      colorClass: "text-primary bg-primary/20",
    },
    {
      value: UserRole.ADMIN,
      label: "Admin",
      description: "Can manage all clients and most settings",
      colorClass: "text-yellow-500 bg-yellow-500/20",
    },
    {
      value: UserRole.SUPER_ADMIN,
      label: "Super Admin",
      description: "Full system access and user management",
      colorClass: "text-red-500 bg-red-500/20",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New User">
      <div className="w-auto min-w-[300px]">
        {/* Error Display */}
        {errors.submit && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-5 text-red-500 text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            {/* Avatar Preview */}
            <div className="flex justify-center mb-2.5">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-[32px] font-bold text-primary-foreground border-2 border-border">
                {formData.name ? (
                  formData.name.charAt(0).toUpperCase()
                ) : (
                  <UserIcon className="w-10 h-10" />
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
              <label className="block text-sm font-semibold text-foreground mb-2">
                User Role *
              </label>
              <div className="flex flex-col gap-2">
                {roleOptions.map((option) => {
                  const isSelected = formData.role === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`
                        flex items-center gap-2.5 p-3 rounded-lg border border-border
                        cursor-pointer transition-all
                        ${isSelected ? option.colorClass : 'bg-background hover:bg-secondary'}
                      `}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={isSelected}
                        onChange={(e) => updateFormField("role")(e.target.value)}
                        className="accent-primary w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="text-foreground text-sm font-medium">
                          {option.label}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
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
            <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-border">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="bg-secondary text-foreground border-none rounded-lg px-6 py-3 text-sm font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 text-white border-none rounded-lg px-6 py-3 text-sm font-semibold cursor-pointer disabled:cursor-not-allowed disabled:bg-muted-foreground flex items-center gap-2 hover:bg-green-600 transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-4 h-4" />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}