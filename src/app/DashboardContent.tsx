import React from "react";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF"
};

export default function DashboardContent() {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>LOREM IPSUM!</h2>
      <div style={{ color: colors.muted, marginBottom: 24 }}>Hi John Doe, Welcome to your dashboard</div>
      <div style={{ background: colors.card, borderRadius: 16, padding: 20, width: 160, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontWeight: 600, color: colors.text }}>Total Client</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: colors.accent }} />
          <span style={{ fontWeight: 700, fontSize: 20, color: colors.text }}>xx</span>
        </div>
      </div>
    </div>
  );
}
