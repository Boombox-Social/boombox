"use client";
import React from "react";
import { BasecampButton } from "./buttons/BasecampButton";

interface BasecampProps {
  clientId?: number;
}

export function Basecamp({ clientId }: BasecampProps) {
  return (
    <div className="border border-border rounded-2xl p-6 min-w-0 min-h-0 overflow-auto relative">
      <div className="font-extrabold text-2xl text-center">
        Basecamp
      </div>
      <BasecampButton clientId={clientId} />
    </div>
  );
}
