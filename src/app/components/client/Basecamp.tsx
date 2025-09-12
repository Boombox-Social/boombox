"use client";
import React, { useState } from "react";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface BasecampProps {
  link?: string;
}

export function Basecamp({ link }: BasecampProps) {
  const [editing, setEditing] = useState(false);
  const [basecampLink, setBasecampLink] = useState(link || "");
  return (
  <>
    <div className="bg-[#23262F] rounded-2xl p-6 min-w-0 min-h-0 overflow-auto relative">
      <div className="font-extrabold text-2xl text-[#F1F5F9] text-center">
        Basecamp
      </div>
      <div className="flex justify-center gap-2 mt-5">
        {editing ? (
          <>
            <input
              type="text"
              value={basecampLink}
              onChange={e => setBasecampLink(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#2D3142] text-base w-[180px] max-w-[220px] focus:outline-none"
              autoFocus
              placeholder="Enter Basecamp link"
            />
            <button
              className="bg-[#2563eb] text-[#F1F5F9] rounded-lg px-2 py-2 cursor-pointer transition-colors min-w-[40px] flex items-center justify-center"
              onClick={() => setEditing(false)}
              title="Save Basecamp Link"
            >
              <CheckCircleIcon className="w-4 h-4 text-[#F1F5F9]" />
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-[#2563eb] text-[#F1F5F9] rounded-lg px-4 py-2 cursor-pointer transition-colors w-full max-w-[220px] min-w-[80px] block"
              onClick={() => window.open(basecampLink || "https://placeholder-link.com", "_blank")}
            >
              Go to Basecamp
            </button>
            <button
              className="bg-[#2D3142] text-[#F1F5F9] rounded-lg px-2 py-2 cursor-pointer transition-colors min-w-[40px] flex items-center justify-center"
              onClick={() => setEditing(true)}
              title="Edit Basecamp Link"
            >
              <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
            </button>
          </>
        )}
      </div>
    </div>
    </>
  );
}