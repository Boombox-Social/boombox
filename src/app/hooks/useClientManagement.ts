import { useState, useEffect } from "react";
import { Client } from "../types/client.types";
import { NewClientForm } from "../types/form.types";

export function useClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch all clients ---
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error(`Failed to fetch clients: ${res.status}`);
      const data: Client[] = await res.json();
      console.log("Fetched clients:", data);

      setClients(data);
      if (!selectedClient && data.length > 0) {
        setSelectedClient(data[0]);
      }
    } catch (err: any) {
      console.error("Fetch clients error:", err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // --- Add a new client ---
  const addClient = async (formData: NewClientForm) => {
    setError(null);
    try {
      let logoUrl = formData.logoUrl;

      if ((formData.logo as any) instanceof File) {
        const fd = new FormData();
        fd.append("file", formData.logo as any);

        const upload = await fetch("/api/upload", { method: "POST", body: fd });
        if (!upload.ok) throw new Error("Failed to upload logo");

        const json = await upload.json();
        logoUrl = json.url;
      }

      const body = { ...formData, logoUrl };
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to add client");

      await fetchClients(); // ensure sidebar sync
    } catch (err: any) {
      console.error("Add client error:", err);
      setError(err.message || "Unexpected error");
      throw err;
    }
  };

  // --- Update an existing client ---
  const updateClient = async (updatedClient: Client) => {
    setError(null);
    try {
      const res = await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClient),
      });

      if (!res.ok) throw new Error("Failed to update client");

      await fetchClients(); // refresh to keep consistent
    } catch (err: any) {
      console.error("Update client error:", err);
      setError(err.message || "Unexpected error");
      throw err;
    }
  };

  // --- Delete a client ---
  const deleteClient = async (clientId: number | string | bigint) => {
    setError(null);
    const idParam = clientId.toString();
    try {
      const res = await fetch(`/api/clients?id=${encodeURIComponent(idParam)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete client");

      await fetchClients(); // refresh after deletion
    } catch (err: any) {
      console.error("Delete client error:", err);
      setError(err.message || "Unexpected error");
      throw err;
    }
  };

  return {
    clients,
    selectedClient,
    setSelectedClient,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    loading,
    error,
  };
}
