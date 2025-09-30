"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useClientManagement } from "../../../hooks";
import ClientDetails from "../../../components/ClientDetails";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { Client } from "../../../types/client.types";

export default function ClientPage() {
  const params = useParams();
  const { clients, isLoading } = useClientManagement();
  const clientId = params.id ? parseInt(params.id as string) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner size="large" text="Loading client details..." />
      </div>
    );
  }

  const client = clients.find((c: Client) => c.id === clientId);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-[#94A3B8] flex-col gap-4">
        <h2 className="text-2xl font-bold">Client Not Found</h2>
        <p>The client you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div>
      <ClientDetails client={client} />
    </div>
  );
}
