// components/sidebar/SidebarFooter.tsx
import React from "react";
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
  return (
    <div
      style={{
        padding: collapsed ? 8 : 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
      }}
    >
      <ActionButton
        onClick={onAddClientClick}
        variant="primary"
        collapsed={collapsed}
        icon={<PlusIcon width={20} />}
        text="+ ADD CLIENT"
      />
      <ActionButton
        onClick={() => console.log("Settings clicked")}
        variant="secondary"
        collapsed={collapsed}
        icon={<Cog6ToothIcon width={20} />}
        text="SETTINGS"
      />
    </div>
  );
}
