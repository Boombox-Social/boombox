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
    <div className="
      flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto min-h-[600px]
      md:grid md:grid-cols-[60%_40%] md:grid-rows-[auto_1fr] md:gap-6
    ">
      {/* Top left: Profile container */}
      <div className="md:row-span-2 md:col-span-1 min-w-0">
        <ClientProfile client={client} />
        {/* Info and Basecamp stacked on mobile, side by side on md+ */}
        <div className="flex flex-col gap-4 mt-4 md:flex-row md:gap-4">
          <div className="flex-1 min-w-0">
            <ClientInformation client={client} />
          </div>
          <div className="flex-1 min-w-0">
            <Basecamp link={client.basecampLink} />
          </div>
        </div>
      </div>

      {/* Top right: SMM Prompt Playbook (spans 2 rows, 40% width) */}
      <div className="md:col-span-1 md:row-span-2 min-w-0 mt-6 md:mt-0">
        <SMMPromptPlaybook client={client} />
      </div>
    </div>
  );
}