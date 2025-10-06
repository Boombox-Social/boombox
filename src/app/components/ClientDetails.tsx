import React from "react";
import { Client } from "../types";
import { ClientProfile } from "./client/ClientProfile";
import { ClientInformation } from "./client/ClientInformation";
import { SMMPromptPlaybook } from "./client/SMMPromptPlaybook";
import { Basecamp } from "./client/Basecamp";
import { ClientDrive } from "./client/ClientDrive";

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
    <div
      className="
      flex flex-col gap-6 p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto min-h-[600px]
      md:grid md:grid-cols-[60%_40%] md:grid-rows-[auto_1fr] md:gap-6
    "
    >
      {/* Top left: Profile container */}
      <div className="md:row-span-2 md:col-span-1 min-w-0">
        <ClientProfile client={client} />


        {/* Info, Basecamp, and Drive stacked on mobile, in a grid on md+ */}
        <div className="flex flex-col gap-4 mt-4 md:grid md:grid-cols-2 md:gap-4">
          <div className="min-w-0 h-full">
            <div className="min-w-0 h-full">
              <ClientInformation client={client} />
            </div>
          </div>
          <div className="flex flex-col min-w-0 h-full gap-4">
            <div className="min-w-0">
              {typeof client.id === "number" ? (
                <Basecamp clientId={client.id} />
              ) : null}
            </div>
            <div className="min-w-0">
              {typeof client.id === "number" ? (
                <ClientDrive
                  clientId={client.id}
                  smmDriveLink={client.smmDriveLink}
                />
              ) : null}
            </div>

          </div>
        </div>
      </div>

      {/* Top right: SMM Prompt Playbook (spans 2 rows, 40% width) */}
      <SMMPromptPlaybook client={client} />
    </div>
  );
}
