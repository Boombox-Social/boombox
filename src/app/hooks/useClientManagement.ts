// src/app/hooks/useClientManagement.ts
import { useState, useEffect } from "react";
import { Client } from "../types/client.types";
import { NewClientForm } from "../types/form.types";

export function useClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = async (formData: NewClientForm) => {
    // If logo is an actual File, upload it first
    let logoUrl = formData.logoUrl;
    if ((formData.logo as any) instanceof File) {
      const fd = new FormData();
      fd.append("file", formData.logo as any);
      const upload = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const json = await upload.json();
      logoUrl = json.url;
    }

    const body = {
      ...formData,
      logoUrl,
    };

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const created = await res.json();
    setClients((prev) => [created, ...prev]);
    return created;
  };

  const updateClient = async (updatedClient: Client) => {
    const res = await fetch("/api/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedClient),
    });
    const data = await res.json();
    setClients((prev) => prev.map(c => c.id === data.id ? data : c));
    if (selectedClient?.id === data.id) setSelectedClient(data);
    return data;
  };

  const deleteClient = async (clientId: number | string) => {
    const idParam = clientId.toString();
    const res = await fetch(`/api/clients?id=${encodeURIComponent(idParam)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setClients(prev => prev.filter(c => c.id.toString() !== idParam));
      if (selectedClient?.id.toString() === idParam) setSelectedClient(null);
      return true;
    }
    return false;
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
  };
}
