"use client";
import React from "react";
import { Client } from "../types";
import { ClientProfile } from "./client/ClientProfile";
import { ClientInformation } from "./client/ClientInformation";
import { SMMPromptPlaybook } from "./client/SMMPromptPlaybook";
import { Basecamp } from "./client/Basecamp";

type ClientDetailsProps = {
  client: Client;
};

export default function ClientDetails({ client }: ClientDetailsProps) {
  // Early return if no client
  if (!client) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-[#94A3B8]">
        <p>No client selected</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[60%_40%] grid-rows-[auto_1fr] gap-[15px] p-[min(5vw,32px)] mx-auto max-w-[1200px] min-h-[600px] box-border">
      {/* Top left: Profile container */}
      <ClientProfile client={client} />

      {/* Top right: SMM Prompt Playbook (spans 2 rows, 40% width) */}
      <SMMPromptPlaybook client={client} />

      {/* Bottom left: Info and Basecamp side by side */}
      <div className="flex gap-[10px] h-[320px]">
        <div className="flex-1 min-w-0 h-full">
          <ClientInformation client={client} />
        </div>
        <div className="flex-1 min-w-0 h-full">
          {typeof client.id === "number" ? (
            <Basecamp clientId={client.id} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
