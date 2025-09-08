// types/form.types.ts
export interface NewClientForm {
  name: string;
  address: string;
  industry: string;
  slogan?: string;
  // These can be either string (from form input) or string[] (processed)
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
  brandAssets?: string | string[];
  fontUsed?: string | string[];
  smmDriveLink?: string;
  contractDeliverables?: string;
  logo?: string | null;
}

export type FileUploadField = 'logo' | 'brandAssets';

export type FormArrayField = string | string[] | undefined;

// FIXED: Helper functions that handle both string and string[] types
export const arrayFieldToString = (field: string | string[] | undefined): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (Array.isArray(field)) return field.join(', ');
  return '';
};

export const stringToArrayField = (value: string): string[] => {
  return value.split(',').map(item => item.trim()).filter(Boolean);
};

// Additional helper for safer conversion
export const ensureStringArray = (field: string | string[] | undefined): string[] => {
  if (!field) return [];
  if (typeof field === 'string') return stringToArrayField(field);
  if (Array.isArray(field)) return field;
  return [];
};

// Helper to ensure string format for form inputs
export const ensureString = (field: string | string[] | undefined): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (Array.isArray(field)) return field.join(', ');
  return '';
};