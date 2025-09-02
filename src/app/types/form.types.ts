// File Structure: src/app/types/form.types.ts - Form type definitions with consistent array handling
// types/form.types.ts
export interface NewClientForm {
  name: string;
  address: string;
  industry: string;
  slogan?: string;
  links?: string | string[]; // FIXED: Allow both string and array
  coreProducts?: string | string[]; // FIXED: Allow both string and array
  idealCustomers?: string;
  brandEmotion?: string;
  uniqueProposition?: string;
  whyChooseUs?: string;
  mainGoal?: string;
  shortTermGoal?: string;
  longTermGoal?: string;
  competitors?: string | string[]; // FIXED: Allow both string and array
  indirectCompetitors?: string | string[]; // FIXED: Allow both string and array
  brandAssets?: string[];
  fontUsed?: string | string[]; // FIXED: Allow both string and array
  smmDriveLink?: string;
  contractDeliverables?: string;
  logo?: string | null;
}

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