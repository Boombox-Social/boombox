// hooks/useFileUpload.ts
import React from 'react';
import { NewClientForm, FileUploadField } from '../types';

export function useFileUpload() {
  const handleFileUpload = (
    file: File | null,
    setFormData: React.Dispatch<React.SetStateAction<NewClientForm>>,
    fieldName: FileUploadField
  ) => {
    if (!file) return;
    
    if (fieldName === 'logo') {
      // Handle logo upload
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          logo: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFileUpload = (
    setFormData: React.Dispatch<React.SetStateAction<NewClientForm>>,
    fieldName: FileUploadField
  ) => {
    if (fieldName === 'logo') {
      setFormData(prev => ({
        ...prev,
        logo: null
      }));
    }
  };

  return { 
    handleFileUpload, 
    clearFileUpload 
  };
}