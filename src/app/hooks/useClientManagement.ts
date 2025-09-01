// hooks/useClientManagement.ts
import { Client, NewClientForm } from '../types';
import { INITIAL_CLIENTS, INITIAL_FORM_STATE } from '../constants';


export function useClientManagement() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const addClient = (formData: NewClientForm) => {
    const newClient: Client = {
      ...formData,
      id: Date.now(),
      links: formData.links.split(',').map(s => s.trim()).filter(Boolean),
      coreProducts: formData.coreProducts.split(',').map(s => s.trim()).filter(Boolean),
      competitors: formData.competitors.split(',').map(s => s.trim()).filter(Boolean),
      indirectCompetitors: [], // Add new field
      brandAssets: [], // Add new field
      fontUsed: formData.fontUsed.split(',').map(s => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => 
      prev.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    
    if (selectedClient?.id === updatedClient.id) {
      setSelectedClient(updatedClient);
    }
  };

  const deleteClient = (clientId: number) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    
    if (selectedClient?.id === clientId) {
      setSelectedClient(null);
    }
  };

  return {
    clients,
    selectedClient,
    setSelectedClient,
    addClient,
    updateClient,
    deleteClient
  };
}

// hooks/useModal.ts
import { useState } from 'react';

export function useModal(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle
  };
}
