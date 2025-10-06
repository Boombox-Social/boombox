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
  if (!client) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-[#94A3B8] p-4">
        <p className="text-center">No client selected</p>
      </div>
    );
  }

  return (
    <div className="
      flex flex-col gap-6 p-4 sm:p-6 md:p-8 
      max-w-full mx-auto min-h-[600px]
      lg:grid lg:grid-cols-[1fr_400px] lg:gap-8
    ">
      {/* Left Column: Client Info first, then Profile and Basecamp */}
      <div className="flex flex-col gap-6 min-w-0 order-1 lg:order-1">
        {/* Client Information - Always first */}
        <div className="w-full">
          <ClientInformation client={client} />
        </div>
        
        {/* Profile and Basecamp - Stack on mobile, side by side on tablet+ */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1 min-w-0">
            <ClientProfile client={client} />
          </div>
          <div className="flex-1 min-w-0">
            <Basecamp link={client.basecampLink} />
          </div>
        </div>
      </div>

      {/* Right Column: SMM Prompt Playbook */}
      <div className="min-w-0 order-2 lg:order-2">
        <SMMPromptPlaybook client={client} />
      </div>
    </div>
  );
}