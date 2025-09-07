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

// Helper functions
export const arrayFieldToString = (field: string[] | undefined): string => {
  return field ? field.join(', ') : '';
};

export const stringToArrayField = (value: string): string[] => {
  return value.split(',').map(item => item.trim()).filter(Boolean);
};