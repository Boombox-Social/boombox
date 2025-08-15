
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
    
    const urlField = `${fieldName}Url` as keyof NewClientForm;
    setFormData(prev => ({
      ...prev,
      [fieldName]: file,
      [urlField]: URL.createObjectURL(file)
    }));
  };

  const clearFileUpload = (
    setFormData: React.Dispatch<React.SetStateAction<NewClientForm>>,
    fieldName: FileUploadField
  ) => {
    const urlField = `${fieldName}Url` as keyof NewClientForm;
    setFormData(prev => ({
      ...prev,
      [fieldName]: null,
      [urlField]: ''
    }));
  };

  return { 
    handleFileUpload, 
    clearFileUpload 
  };
}