"use client";
import React from "react";
import { Client } from "../types";
import { ClientProfile } from "./client/ClientProfile";
import { ClientInformation } from "./client/ClientInformation";
import { SMMPromptPlaybook } from "./client/SMMPromptPlaybook";
import { Basecamp } from "./client/Basecamp";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF",
};

type ClientDetailsProps = {
  client: Client;
};

export default function ClientDetails({ client }: ClientDetailsProps) {
  // Early return if no client
  if (!client) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          color: colors.muted,
        }}
      >
        <p>No client selected</p>
      </div>
    );
  }

  // Bento grid layout with 60%-40% ratio
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "60% 40%",
    gridTemplateRows: "auto 1fr",
    gap: 15,
    padding: "min(5vw, 32px)",
    margin: "0 auto",
    maxWidth: 1200,
    boxSizing: "border-box",
    minHeight: 600,
  };

  return (
    <div style={gridStyle}>
      {/* Top left: Profile container */}
      <ClientProfile client={client} />

      {/* Top right: SMM Prompt Playbook (spans 2 rows, 40% width) */}
      <SMMPromptPlaybook client={client} />

      {/* Bottom left: Info and Basecamp side by side */}
      <div style={{ display: "flex", gap: 10, height: 320 }}>
        <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
          <ClientInformation client={client} />
        </div>
        <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
          <Basecamp link={client.basecampLink} />
        </div>
      </div>
    </div>
  );
}
