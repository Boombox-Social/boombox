import React from "react";

interface OpenDetailsButtonProps {
  onClick: () => void;
}

export function OpenDetailsButton({ onClick }: OpenDetailsButtonProps) {
  return (
    <button
      className="w-full max-w-xs mx-auto mt-4 bg-[#2563eb] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors block hover:bg-[#1E40AF] focus:outline-none"
      onClick={onClick}
    >
      Open Details
    </button>
  );
}