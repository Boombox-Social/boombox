"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { ClientItemProps } from "../../types";

export function ClientItem({
  client,
  isSelected,
  collapsed,
  onClick: _onClick,
}: ClientItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/client/${client.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center rounded-lg border-none cursor-pointer transition-all duration-200
        ${collapsed ? "gap-0 p-2 justify-center" : "gap-3 p-3 justify-start"}
        ${isSelected 
          ? "bg-[#2563eb] text-[#F1F5F9]" 
          : "bg-transparent text-[#94A3B8] hover:bg-[#2D3142] hover:text-[#F1F5F9]"
        }
      `}
    >
      {/* Client Avatar */}
      <div className="flex-shrink-0 w-8 h-8">
        {client.logo ? (
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-[#F1F5F9]" />
          </div>
        )}
      </div>

      {/* Client Name */}
      {!collapsed && (
        <div
          className={`
            flex-1 text-left text-sm whitespace-nowrap overflow-hidden text-ellipsis
            ${isSelected ? "font-semibold" : "font-medium"}
          `}
        >
          {client.name}
        </div>
      )}
    </button>
  );
}