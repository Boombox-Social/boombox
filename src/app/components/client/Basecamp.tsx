"use client";
import React from "react";
import { BasecampButton } from "./buttons/BasecampButton";

interface BasecampProps {
  clientId?: number;
}

export function Basecamp({ clientId }: BasecampProps) {
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
        Basecamp
      </div>
      <BasecampButton clientId={clientId} />
    </div>
  );
}