// src/app/components/client/ContentCreation.tsx
"use client";
import React from "react";
import { ContentCreationButton } from "./buttons/ContentCreationButton";

interface ContentCreationProps {
  clientId?: number;
}

export function ContentCreation({ clientId }: ContentCreationProps) {
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
        Content Creation
      </div>
      <ContentCreationButton clientId={clientId} />
    </div>
  );
}
