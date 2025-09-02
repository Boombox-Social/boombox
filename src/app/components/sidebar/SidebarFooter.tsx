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
      className={`flex flex-col gap-2 items-center ${
        collapsed ? "p-2" : "p-5"
      }`}
    >
      <ActionButton
        onClick={onAddClientClick}
        variant="primary"
        collapsed={collapsed}
        icon={<PlusIcon width={20} />}
        text="+ ADD CLIENT"
      />
      <ActionButton
        onClick={handleSettingsClick}
        variant={isOnSettings ? "primary" : "secondary"} // Highlight when on settings
        collapsed={collapsed}
        icon={<Cog6ToothIcon width={20} />}
        text="SETTINGS"
      />
    </div>
  );
}
