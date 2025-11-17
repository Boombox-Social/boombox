"use client";
import React from "react";
import { DriveButton } from "./buttons/DriveButton";

interface ClientDriveProps {
  clientId?: number;
  smmDriveLink?: string | null;
}

export function ClientDrive({ clientId, smmDriveLink }: ClientDriveProps) {
  return (
    <div 
      className="rounded-lg p-6"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div 
        className="font-bold text-xl mb-4 text-center tracking-tight"
        style={{ color: "var(--card-foreground)" }}
      >
        Client Drive
      </div>
      {clientId && (
        <DriveButton clientId={clientId} initialDriveLink={smmDriveLink} />
      )}
    </div>
  );
}