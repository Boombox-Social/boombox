// File Structure: src/app/dashboard/client/[id]/page.tsx - Individual client details page
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useClientManagement } from "../../../hooks";
import ClientDetails from "../../../components/ClientDetails";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

export default function ClientPage() {
  const params = useParams();
  const { clients, isLoading } = useClientManagement();
  const clientId = params.id ? parseInt(params.id as string) : null;

  console.log(
    "Client page render, clientId:",
    clientId,
    "isLoading:",
    isLoading
  ); // Debug log

  // Show loading state while clients are being fetched
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          flexDirection: "column",
        }}
      >
        <LoadingSpinner size="large" text="Loading client details..." />
      </div>
    );
  }

  // Find the client by ID
  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          color: "#94A3B8",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Client Not Found</h2>
        <p>The client you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return <ClientDetails client={client} />;
}
