"use client";
import React, { useState } from "react";
import { Client } from "../../types";
import { Modal } from "../ui/Modal";
import { ClientInfoModal } from "../modals/ClientInfoModal";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

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
    <div
      style={{
        background: colors.card,
        borderRadius: 16,
        padding: 24,
        minWidth: 0,
        minHeight: 0,
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 24, color: colors.text }}>
        Business Information
      </div>
      <button
        style={{
          marginTop: 20,
          background: colors.accent,
          color: colors.text,
          border: "none",
          borderRadius: 8,
          padding: "10px 18px",
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.2s",
          width: "100%",
          maxWidth: "100%",
          display: "block",
        }}
        onClick={() => setShowInfoModal(true)}
      >
        Open Details
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
        <button
          style={{
            background: colors.hover,
            color: colors.text,
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
            width: "100%",
            maxWidth: "100%",
            minWidth: 80,
            display: "block",
          }}
          onClick={() => {
            if (aiLink) window.open(aiLink, "_blank");
          }}
        >
          View Ai Strategy
        </button>
        <button
          style={{
            background: colors.border,
            color: colors.text,
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
            width: "100%",
            maxWidth: 48,
            minWidth: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setEditingAiLink(true)}
        >
          <PencilSquareIcon className="w-4 h-4 text-[#2563eb]" />
        </button>
        {editingAiLink && (
          <input
            type="text"
            value={aiLink}
            onChange={e => setAiLink(e.target.value)}
            style={{
              marginLeft: 8,
              padding: "8px",
              borderRadius: 6,
              border: `1px solid ${colors.border}`,
              fontSize: 16,
              width: 180,
              maxWidth: 220,
            }}
            onBlur={() => setEditingAiLink(false)}
            autoFocus
            placeholder="Enter Ai link"
          />
        )}
      </div>
      <button
        style={{
          marginTop: 16,
          background: colors.border,
          color: colors.text,
          border: "none",
          borderRadius: 8,
          padding: "10px 18px",
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.2s",
          width: "100%",
          maxWidth: "100%",
          minWidth: 80,
          display: "block",
        }}
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