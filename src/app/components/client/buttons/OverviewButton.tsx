import React from "react";

interface OverviewButtonProps {
  onClick: () => void;
}

export function OverviewButton({ onClick }: OverviewButtonProps) {
  return (
    <button
      className="mt-4 bg-[#2D3142] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors w-full max-w-full min-w-[80px] block hover:bg-[#2563eb] focus:outline-none"
      onClick={onClick}
    >
      Overview
    </button>
  );
}
