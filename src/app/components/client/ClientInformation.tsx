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
    <div 
      className="rounded-lg p-6"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div 
        className="font-bold text-xl mb-4 tracking-tight"
        style={{ color: "var(--card-foreground)" }}
      >
        Business Information
      </div>
      
      <div className="flex flex-col gap-3">
        <OpenDetailsButton onClick={() => setShowInfoModal(true)} />
        <ViewAiStrategyButton clientId={client.id} />
        <OverviewButton clientId={client.id} />
      </div>

      {/* Modal for Client Information */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Business Information"
        maxWidth="1200px"
      >
        <ClientInfoModal client={client} />
      </Modal>
    </div>
  );
}