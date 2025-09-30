"use client";
import React, { useState } from "react";
import { Client } from "../../types";
import { Modal } from "../ui/Modal";
import { ClientInfoModal } from "../modals/ClientInfoModal";
import { OpenDetailsButton } from "../client/buttons/OpenDetailsButton";
import { ViewAiStrategyButton } from "../client/buttons/ViewAiStrategyButton";
import { OverviewButton } from "../client/buttons/OverviewButton";

interface ClientInformationProps {
  client: Client;
}

export function ClientInformation({ client }: ClientInformationProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <div className="bg-[#23262F] rounded-2xl p-6 min-w-0 min-h-0 overflow-y-auto relative">
      <div className="font-extrabold text-2xl text-[#F1F5F9]">
        Business Information
      </div>
      <OpenDetailsButton onClick={() => setShowInfoModal(true)} />
      <ViewAiStrategyButton clientId={client.id} />
      <OverviewButton clientId={client.id} />

      {/* Modal for Client Information */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Business Information"
        maxWidth="48em"
      >
        <div style={{ padding: 16 }}>
          <ClientInfoModal client={client} />
        </div>
      </Modal>
    </div>
  );
}
