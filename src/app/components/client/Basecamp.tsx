"use client";
import React from "react";

const colors = {
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  border: "#2D3142",
};

interface BasecampProps {
  link?: string;
}

export function Basecamp({ link }: BasecampProps) {
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
      <div style={{ fontWeight: 800, fontSize: 24, color: colors.text, textAlign: "center" }}>
        Basecamp
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
          minWidth: 80,
          display: "block",
        }}
        onClick={() =>
          window.open(link || "https://placeholder-link.com", "_blank")
        }
      >
        Go to Basecamp
      </button>
    </div>
  );
}