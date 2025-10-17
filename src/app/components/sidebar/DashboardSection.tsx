"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface DashboardSectionProps {
  collapsed: boolean;
}

export function DashboardSection({ collapsed }: DashboardSectionProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/dashboard/settings", label: "Settings", icon: Cog6ToothIcon },
  ];

  return (
    <div className="p-2 space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
              ${collapsed ? 'justify-center' : ''}
              ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              }
            `}
            title={collapsed ? link.label : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">{link.label}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}