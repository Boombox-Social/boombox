"use client";
import React, { useEffect, useState } from "react";
import { UserRole } from "../../../generated/prisma";
import { Modal, FormField } from "../ui";

const colors = {
  bg: "#181A20",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  danger: "#EF4444",
  warning: "#F59E0B",
};

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (
    userId: number,
    data: Partial<User> & { password?: string }
  ) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export function EditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading,
  error,
}: EditUserModalProps) {
  const [form, setForm] = useState<Partial<User> & { password?: string }>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || UserRole.SMM,
    avatar: user?.avatar || "",
    isActive: user?.isActive ?? true,
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        isActive: user.isActive,
        password: "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (
    field: keyof (User & { password?: string }),
    value: any
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only send password if not blank
    const submitData = { ...form };
    if (!submitData.password) {
      delete submitData.password;
    }
    await onSave(user.id, submitData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <div style={{ width: "auto", minWidth: "320px" }}>
        {error && (
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
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Full Name"
            placeholder="Full Name"
            value={form.name as string}
            onChange={(v) => handleChange("name", v)}
            required
          />
          <FormField
            label="Email Address"
            placeholder="Email"
            value={form.email as string}
            onChange={(v) => handleChange("email", v)}
            required
            type="email"
          />
          <div>
            <label className="block text-sm font-medium text-[#F1F5F9] mb-2">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value as UserRole)}
              className="w-full px-4 py-3 rounded-lg border border-[#2D3142] bg-[#181A20] text-[#F1F5F9]"
            >
              <option value={UserRole.SMM}>SMM</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            </select>
          </div>
          <FormField
            label="Avatar URL"
            placeholder="https://example.com/avatar.jpg"
            value={form.avatar as string}
            onChange={(v) => handleChange("avatar", v)}
          />
          <div>
            <label className="block text-sm font-medium text-[#F1F5F9] mb-2">
              Status
            </label>
            <select
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) =>
                handleChange("isActive", e.target.value === "active")
              }
              className="w-full px-4 py-3 rounded-lg border border-[#2D3142] bg-[#181A20] text-[#F1F5F9]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <FormField
            label="Password"
            placeholder="Leave blank to keep current password"
            value={form.password || ""}
            onChange={(v) => handleChange("password", v)}
            type="password"
          />
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-[#2D3142] text-[#F1F5F9] rounded-lg font-medium hover:bg-[#374151] transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#2563eb] text-white rounded-lg font-medium hover:bg-[#1E40AF] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
