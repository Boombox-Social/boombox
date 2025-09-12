import React from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface OverviewButtonProps {
  overviewLink: string;
  editingOverview: boolean;
  setOverviewLink: (val: string) => void;
  setEditingOverview: (val: boolean) => void;
}

export function OverviewButton({
  overviewLink,
  editingOverview,
  setOverviewLink,
  setEditingOverview,
}: OverviewButtonProps) {
  return (
    <div className="flex items-center gap-2 mt-4 justify-center">
      {editingOverview ? (
        <>
          <input
            type="text"
            value={overviewLink}
            onChange={(e) => setOverviewLink(e.target.value)}
            className="px-5 py-2 rounded-lg border border-[#2D3142] text-base w-full max-w-full min-w-[80px] focus:outline-none"
            autoFocus
            placeholder="Enter Overview link"
          />
          <button
            className="bg-[#2563eb] text-[#F1F5F9] border border-[#2D3142] rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors flex items-center min-w-[40px] justify-center"
            onClick={() => setEditingOverview(false)}
            title="Save Overview Link"
          >
            <CheckCircleIcon className="w-4 h-4 text-[#F1F5F9]" />
          </button>
        </>
      ) : (
        <>
          <button
            className="bg-[#1E40AF] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors w-full max-w-full min-w-[80px] block hover:bg-[#2563eb] focus:outline-none"
            onClick={() => {
              if (overviewLink) window.open(overviewLink, "_blank");
            }}
          >
            Overview
          </button>
          <button
            className="bg-[#2D3142] text-[#F1F5F9] border-none rounded-lg px-2 py-2 text-lg cursor-pointer transition-colors min-w-[40px] flex items-center justify-center"
            onClick={() => setEditingOverview(true)}
            title="Edit Overview Link"
          >
            <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
          </button>
        </>
      )}
    </div>
  );
}
