import { Client, NewClientForm } from '../types';

export const createClientFromForm = (formData: NewClientForm): Client => ({
  ...formData,
  id: Date.now(),
  links: formData.links ? formData.links.split(',').map(s => s.trim()).filter(Boolean) : [],
  coreProducts: formData.coreProducts ? formData.coreProducts.split(',').map(s => s.trim()).filter(Boolean) : [],
  competitors: formData.competitors ? formData.competitors.split(',').map(s => s.trim()).filter(Boolean) : [],
  indirectCompetitors: formData.indirectCompetitors ? formData.indirectCompetitors.split(',').map(s => s.trim()).filter(Boolean) : [],
  fontUsed: formData.fontUsed ? formData.fontUsed.split(',').map(s => s.trim()).filter(Boolean) : [],
  brandAssets: formData.brandAssets || [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const filterClients = (clients: Client[], searchTerm: string): Client[] => {
  if (!searchTerm.trim()) return clients;
  
  const term = searchTerm.toLowerCase();
  return clients.filter(client =>
    client.name?.toLowerCase().includes(term) ||
    client.industry?.toLowerCase().includes(term) ||
    client.address?.toLowerCase().includes(term)
  );
};

export const sortClients = (clients: Client[], sortBy: 'name' | 'industry' | 'createdAt' = 'name'): Client[] => {
  return [...clients].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'industry') {
      return (a.industry || '').localeCompare(b.industry || '');
    }
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
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
  
  // Validate email format in links if provided
  if (client.links) {
    const linkArray = client.links.split(',').map(s => s.trim()).filter(Boolean);
    const urlPattern = /^https?:\/\/.+/;
    const invalidLinks = linkArray.filter(link => !urlPattern.test(link));
    
    if (invalidLinks.length > 0) {
      errors.push(`Invalid URLs: ${invalidLinks.join(', ')}`);
    }
  }
  
  return errors;
};