// File Structure: src/app/utils/client.utils.ts - Client utility functions with proper type handling
import { NewClientForm, Client } from '../types';

export const transformFormDataToClient = (formData: NewClientForm): Client => {
  // Helper function to safely convert form fields to arrays
  const safeStringToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  return {
    ...formData,
    id: Date.now(),
    links: safeStringToArray(formData.links),
    coreProducts: safeStringToArray(formData.coreProducts),
    competitors: safeStringToArray(formData.competitors),
    indirectCompetitors: safeStringToArray(formData.indirectCompetitors),
    brandAssets: safeStringToArray(formData.brandAssets),
    fontUsed: safeStringToArray(formData.fontUsed),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Add the missing function that useClientManagement is trying to import
export const createClientFromForm = (formData: NewClientForm): Client => {
  return transformFormDataToClient(formData);
};

export const validateClient = (client: Partial<NewClientForm>): string[] => {
  const errors: string[] = [];
  
  if (!client.name?.trim()) {
    errors.push('Business name is required');
  }
  
  if (!client.address?.trim()) {
    errors.push('Business address is required');
  }
  
  if (!client.industry?.trim()) {
    errors.push('Industry is required');
  }
  
  // Validate URL format in links if provided
  if (client.links) {
    const linkArray = safeStringToArray(client.links);
    const urlPattern = /^https?:\/\/.+/;
    const invalidLinks = linkArray.filter(link => !urlPattern.test(link));
    
    if (invalidLinks.length > 0) {
      errors.push(`Invalid URLs: ${invalidLinks.join(', ')}`);
    }
  }
  
  return errors;
};

// Helper function to safely convert values to arrays (exported for reuse)
export const safeStringToArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// Helper function to convert arrays to display strings
export const arrayToDisplayString = (value: string[] | undefined): string => {
  return value ? value.join(', ') : '';
};