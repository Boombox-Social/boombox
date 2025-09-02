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
  }, [authState.user, authState.isLoading, loadClients]);

  const loadClients = async () => {
    if (!authState.user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Loading clients from API...');
      }
      
      const response = await fetch('/api/clients');
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('Response status:', response.status, response.statusText);
      }
      
      if (response.ok) {
        const data = await response.json();
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('Clients loaded successfully:', data);
        }
        
        if (data.success && Array.isArray(data.clients)) {
          setClients(data.clients);
        } else {
          // Fallback for backward compatibility
          setClients(data.clients || []);
        }
      } else if (response.status === 401) {
        // User not authenticated, let auth context handle it
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Authentication required for loading clients');
        }
        setError('Authentication required');
        setClients([]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load clients');
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to load clients from API:', err);
      }
      setError('Failed to load clients from database');
      setClients(INITIAL_CLIENTS); // Fallback to initial clients for development
    } finally {
      setIsLoading(false);
    }
  };

  // Add client function
  const addClient = async (formData: NewClientForm): Promise<Client> => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('useClientManagement - addClient called with:', formData);
    }

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      // Handle error responses
      if (!response.ok) {
        const errorMessage = responseData.error || `HTTP ${response.status}: ${response.statusText}`;
        if (process.env.NODE_ENV !== 'production') {
          console.error('Add client error:', errorMessage);
        }
        throw new Error(errorMessage);
      }

      // Success case
      if (responseData.success && responseData.client) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Client created successfully:', responseData.client);
        }
        
        // Add to local state
        setClients(prev => [...prev, responseData.client]);
        
        return responseData.client;
      } else {
        // Fallback handling
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Unexpected response format:', responseData);
        }
        throw new Error('Unexpected response format from server');
      }
      
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error in addClient:', error);
      }
      
      // If it's a network error and we have form data, add to local state as fallback
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Network error detected, adding to local state as fallback');
        }
        const localClient: Client = createClientFromForm(formData);
        setClients(prev => [...prev, localClient]);
        return localClient;
      }
      
      throw error;
    }
  };

  // Update client function
  const updateClient = async (updatedClient: Client): Promise<void> => {
    if (!updatedClient.id) {
      throw new Error('Client ID is required for updates');
    }

    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Updating client:', updatedClient);
      }

      const response = await fetch(`/api/clients/${updatedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (process.env.NODE_ENV !== 'production') {
          console.error('Update client error:', errorData);
        }
        throw new Error(errorData.error || 'Failed to update client');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Client updated successfully:', data);
      }

      // Update local state
      setClients(prev => 
        prev.map(client => 
          client.id === updatedClient.id ? updatedClient : client
        )
      );
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error updating client:', error);
      }
      throw error;
    }
  };

  // Delete client function
  const deleteClient = async (clientId: number): Promise<void> => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Deleting client with ID:', clientId);
      }

      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (process.env.NODE_ENV !== 'production') {
          console.error('Delete client error:', errorData);
        }
        throw new Error(errorData.error || 'Failed to delete client');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Client deleted successfully:', data);
      }

      // Update local state
      setClients(prev => prev.filter(client => client.id !== clientId));
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error deleting client:', error);
      }
      throw error;
    }
  };

  return {
    clients,
    addClient,
    updateClient, 
    deleteClient,
    isLoading,
    error,
    loadClients
  };
}

export function useModal(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);
  
  return { isOpen, open, close, toggle };
}