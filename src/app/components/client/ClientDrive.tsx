"use client";
import React from "react";
import { DriveButton } from "./buttons/DriveButton";

interface ClientDriveProps {
  clientId?: number;
  smmDriveLink?: string | null;
}

export function ClientDrive({ clientId, smmDriveLink }: ClientDriveProps) {
  return (
    <div className="bg-[#23262F] rounded-2xl p-6 min-w-0 min-h-0 overflow-auto relative">
      <div className="font-extrabold text-2xl text-[#F1F5F9] text-center">
        Client Drive
      </div>
      {clientId && (
        <DriveButton clientId={clientId} initialDriveLink={smmDriveLink} />
      )}
    </div>
  );
}
