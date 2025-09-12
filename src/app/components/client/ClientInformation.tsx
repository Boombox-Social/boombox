"use client";
import React, { useState } from "react";
import { Client } from "../../types";
import { Modal } from "../ui/Modal";
import { ClientInfoModal } from "../modals/ClientInfoModal";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

const colors = {
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  border: "#2D3142",
  hover: "#1E40AF",
};

interface ClientInformationProps {
  client: Client;
}

export function ClientInformation({ client }: ClientInformationProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [aiLink, setAiLink] = useState(client.aiLink || "");
  const [editingAiLink, setEditingAiLink] = useState(false);

  // Dummy overview summary function
  const getOverview = () =>
    `Business: ${client.name}\nIndustry: ${client.industry}\nAddress: ${client.address}\nSlogan: ${client.slogan}`;

  return (
    <div className="bg-[#23262F] rounded-2xl p-6 min-w-0 min-h-0 overflow-y-auto relative">
      <div className="font-extrabold text-2xl text-[#F1F5F9]">
        Business Information
      </div>
      <button
        className="mt-5 bg-[#2563eb] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors w-full max-w-full block hover:bg-[#1E40AF] focus:outline-none"
        onClick={() => setShowInfoModal(true)}
      >
        Open Details
      </button>
      <div className="flex items-center gap-2 mt-4 justify-center">
      {editingAiLink ? (
        <>
          <input
            type="text"
            value={aiLink}
            onChange={e => setAiLink(e.target.value)}
            className="px-5 py-2 rounded-lg border border-[#2D3142] text-base w-full max-w-full min-w-[80px] focus:outline-none"
            autoFocus
            placeholder="Enter Ai link"
          />
          <button
            className="bg-[#2563eb] text-[#F1F5F9] border border-[#2D3142] rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors flex items-center min-w-[40px] justify-center"
            onClick={() => setEditingAiLink(false)}
            title="Save Ai Link"
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
            View Ai Strategy
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
      <button
        className="mt-4 bg-[#2D3142] text-[#F1F5F9] border-none rounded-lg px-5 py-2 text-lg cursor-pointer transition-colors w-full max-w-full min-w-[80px] block hover:bg-[#2563eb] focus:outline-none"
        onClick={() => alert(getOverview())}
      >
        Overview
      </button>

      {/* Modal for Client Information */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Business Information"
        maxWidth="48em"
      >
        <div style={{ padding: 16 }}>
          <ClientInfoModal client={client} />
        </div>
      </Modal>
    </div>
  );
}