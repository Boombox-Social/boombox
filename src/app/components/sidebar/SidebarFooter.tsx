"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { PlusIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { ActionButton } from "../ui";

interface SidebarFooterProps {
  collapsed: boolean;
  onAddClientClick: () => void;
}

export function SidebarFooter({
  collapsed,
  onAddClientClick,
}: SidebarFooterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSettingsClick = () => {
    router.push("/dashboard/settings");
  };

  const isOnSettings = pathname === "/dashboard/settings";

  return (
    <div
      className={`flex flex-col gap-2 ${
        collapsed ? "p-2" : "p-4"
      }`}
      style={{
        borderTop: "1px solid var(--border)",
        paddingTop: "12px",
        paddingBottom: "12px",
      }}
    >
      <ActionButton
        onClick={onAddClientClick}
        variant="primary"
        collapsed={collapsed}
        icon={<PlusIcon width={18} />}
        text="Add Client"
      />
      <ActionButton
        onClick={handleSettingsClick}
        variant={isOnSettings ? "primary" : "secondary"}
        collapsed={collapsed}
        icon={<Cog6ToothIcon width={18} />}
        text="Settings"
      />
    </div>
  );
}