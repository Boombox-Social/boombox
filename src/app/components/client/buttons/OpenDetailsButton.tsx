import React from "react";

interface OpenDetailsButtonProps {
  onClick: () => void;
}

export function OpenDetailsButton({ onClick }: OpenDetailsButtonProps) {
  return (
    <button
      className="mt-5 bg-[#2563eb] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors w-full max-w-full block hover:bg-[#1E40AF] focus:outline-none"
      onClick={onClick}
    >
      Open Details
    </button>
  );
}