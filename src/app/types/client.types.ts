// File Structure: src/app/types/client.types.ts - Updated client type definitions
export interface Client {
  id: number;
  logo?: string | null; // Logo link
  name: string; // Business Name
  address?: string | null;
  industry?: string | null;
  slogan?: string | null;
  links?: string[]; // Social media and website links - ARRAY of URLs
  coreProducts?: string[]; // Core products/services - ARRAY of strings
  idealCustomers?: string | null;
  brandEmotion?: string | null; // Specific feeling or emotion brand wants to evoke
  uniqueProposition?: string | null;
  whyChooseUs?: string | null;
  mainGoal?: string | null;
  shortTermGoal?: string | null;
  longTermGoal?: string | null;
  competitors?: string[]; // Direct competitors - ARRAY of names
  indirectCompetitors?: string[]; // Indirect competitors - ARRAY of names
  brandAssets?: string[]; // Brand assets LINKS - ARRAY of URLs, not files
  fontUsed?: string[]; // Array of font NAMES - ARRAY of strings
  smmDriveLink?: string | null;
  contractDeliverables?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewClientForm {
  name: string;
  address: string;
  industry: string;
  slogan?: string;
  links?: string[]; // Array of URLs
  coreProducts?: string[]; // Array of product names
  idealCustomers?: string;
  brandEmotion?: string;
  uniqueProposition?: string;
  whyChooseUs?: string;
  mainGoal?: string;
  shortTermGoal?: string;
  longTermGoal?: string;
  competitors?: string[]; // Array of competitor names
  indirectCompetitors?: string[]; // Array of competitor names
  brandAssets?: string[]; // Array of URLs, not files
  fontUsed?: string[]; // Array of font names
  smmDriveLink?: string;
  contractDeliverables?: string;
  logo?: string | null;
}