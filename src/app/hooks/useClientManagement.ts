// File Structure: src/app/hooks/useClientManagement.ts - Client management hook with API integration
"use client";
import { useState, useEffect } from 'react';
import { Client, NewClientForm } from '../types';
import { INITIAL_CLIENTS } from '../constants';
import { createClientFromForm } from '../utils';
import { useAuth } from './useAuth';

export function useClientManagement() {
  const { authState } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Load clients from API on mount and when user changes
  useEffect(() => {
    if (authState.user) {
      loadClients();
    } else if (!authState.isLoading) {
      // User is not authenticated
      setIsLoading(false);
      setClients([]);
    }
  }, [authState.user, authState.isLoading]);

  const loadClients = async () => {
    if (!authState.user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      console.log('Loading clients from API...');
      const response = await fetch('/api/clients');
      
      console.log('Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Clients loaded successfully:', data);
        
        if (data.success && Array.isArray(data.clients)) {
          setClients(data.clients);
        } else {
          // Fallback for backward compatibility
          setClients(data.clients || []);
        }
      } else if (response.status === 401) {
        // User not authenticated, let auth context handle it
        console.warn('Authentication required for loading clients');
        setError('Authentication required');
        setClients([]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load clients');
      }
    } catch (err) {
      console.warn('Failed to load clients from API:', err);
      setError('Failed to load clients from database');
      setClients(INITIAL_CLIENTS); // Fallback to initial clients for development
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (formData: NewClientForm) => {
    if (!authState.user) {
      throw new Error('Authentication required');
    }

    console.log('Creating client with form data:', formData);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Add client response:', response.status, response.statusText);

      // Parse response regardless of status
      let responseData;
      try {
        responseData = await response.json();
        console.log('Add client response data:', responseData);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        // Handle error cases
        const errorMessage = responseData?.error || `Server error: ${response.status}`;
        console.error('Add client error:', errorMessage);
        throw new Error(errorMessage);
      }

      // Success case
      if (responseData.success && responseData.client) {
        console.log('Client created successfully:', responseData.client);
        
        // Add to local state
        setClients(prev => [...prev, responseData.client]);
        
        return responseData.client;
      } else {
        // Fallback handling
        console.warn('Unexpected response format:', responseData);
        throw new Error('Unexpected response format from server');
      }
      
    } catch (error) {
      console.error('Error in addClient:', error);
      
      // If it's a network error and we have form data, add to local state as fallback
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        console.log('Network error detected, adding to local state as fallback');
        const localClient: Client = createClientFromForm(formData);
        setClients(prev => [...prev, localClient]);
        return localClient;
      }
      
      throw error;
    }
  };

  const updateClient = async (updatedClient: Client) => {
    if (!authState.user) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`/api/clients/${updatedClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClient),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse update response JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const errorMessage = responseData?.error || "Failed to update client";
        throw new Error(errorMessage);
      }

      // Update local state
      const updatedClientData = responseData.client || updatedClient;
      setClients(prev => 
        prev.map(client => 
          client.id === updatedClient.id ? updatedClientData : client
        )
      );
      
      return updatedClientData;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (clientId: number) => {
    if (!authState.user) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete client');
      }

      // Remove from local state
      setClients(prev => prev.filter(client => client.id !== clientId));
      
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    loadClients,
    isLoading,
    error,
    isAuthenticated: !!authState.user
  };
}

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