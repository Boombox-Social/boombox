// File Structure: src/app/types/form.types.ts - Form type definitions with consistent array handling
// types/form.types.ts
export interface NewClientForm {
  name: string;
  address: string;
  industry: string;
  slogan?: string;
  links?: string | string[];
  coreProducts?: string | string[];
  idealCustomers?: string;
  brandEmotion?: string;
  uniqueProposition?: string;
  whyChooseUs?: string;
  mainGoal?: string;
  shortTermGoal?: string;
  longTermGoal?: string;
  competitors?: string | string[];
  indirectCompetitors?: string | string[];
  brandAssets?: string[];
  fontUsed?: string | string[];
  smmDriveLink?: string;
  contractDeliverables?: string;
  logo?: string | null;
}

// Add this missing type
export type FileUploadField = 'logo' | 'brandAssets';

// Helper type for form fields that can be either string or array
export type FormArrayField = string | string[] | undefined;

// Type guard functions
export const isStringArray = (value: FormArrayField): value is string[] => {
  return Array.isArray(value);
};

export const isString = (value: FormArrayField): value is string => {
  return typeof value === 'string';
};

// Conversion utilities
export const arrayFieldToString = (value: FormArrayField): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'string') {
    return value;
  }
  return '';
};

export const stringToArrayField = (value: string): string[] => {
  if (!value || value.trim() === '') {
    return [];
  }
  return value.split(',').map(s => s.trim()).filter(Boolean);
};