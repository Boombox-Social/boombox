import React from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface ViewAiStrategyButtonProps {
  aiLink: string;
  editingAiLink: boolean;
  setAiLink: (val: string) => void;
  setEditingAiLink: (val: boolean) => void;
}

export function ViewAiStrategyButton({
  aiLink,
  editingAiLink,
  setAiLink,
  setEditingAiLink,
}: ViewAiStrategyButtonProps) {
  const shouldShowInput = editingAiLink || !aiLink;

  return (
    <div className="flex justify-center gap-2 mt-5">
      {shouldShowInput ? (
        <>
          <input
            type="text"
            value={aiLink}
            onChange={(e) => setAiLink(e.target.value)}
            className="px-5 py-2 rounded-lg border border-[#2D3142] text-base w-full max-w-full min-w-[80px] focus:outline-none"
            autoFocus
            placeholder="Enter the AI Strategy link"
          />
          <button
            className="bg-[#2563eb] text-[#F1F5F9] border border-[#2D3142] rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors flex items-center min-w-[40px] justify-center"
            onClick={() => setEditingAiLink(false)}
            title="Save Ai Link"
            disabled={!aiLink}
          >
            <CheckCircleIcon className="w-4 h-4 text-[#F1F5F9]" />
          </button>
        </>
      ) : (
        <>
          <button
            className="bg-[#1E40AF] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors w-full max-w-full min-w-[80px] block hover:bg-[#2563eb] focus:outline-none"
            onClick={() => {
              if (aiLink) window.open(aiLink, "_blank");
            }}
          >
            View AI Strategy
          </button>
          <button
            className="bg-[#2D3142] text-[#F1F5F9] border-none rounded-lg px-2 py-2 text-lg cursor-pointer transition-colors min-w-[40px] flex items-center justify-center"
            onClick={() => setEditingAiLink(true)}
            title="Edit Ai Link"
          >
            <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
          </button>
        </>
      )}
    </div>
  );
}
