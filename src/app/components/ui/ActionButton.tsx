import React from "react";
import { ActionButtonProps } from "../../types";

export function ActionButton({
  onClick,
  variant,
  collapsed,
  icon,
  text,
}: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      className={`
        rounded-lg flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer
        transition-all duration-200
        ${collapsed ? 'p-2 min-w-[48px]' : 'px-4 py-2'}
        min-h-[40px] w-full
        ${
          isPrimary
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-card text-foreground border border-border hover:bg-secondary'
        }
      `}
      aria-label={collapsed ? text : undefined}
    >
      {collapsed ? icon : text}
    </button>
  );
}