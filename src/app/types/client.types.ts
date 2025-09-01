// types/client.types.ts
export interface Client {
  id: number;
  logo?: string; // Logo link
  name: string; // Business Name
  address?: string;
  industry?: string;
  slogan?: string;
  links?: string[]; // Social media and website links
  coreProducts?: string[]; // Core products/services
  idealCustomers?: string;
  brandEmotion?: string; // Specific feeling or emotion brand wants to evoke
  uniqueProposition?: string;
  whyChooseUs?: string;
  mainGoal?: string;
  shortTermGoal?: string;
  longTermGoal?: string;
  competitors?: string[]; // Direct competitors (links)
  indirectCompetitors?: string[]; // Indirect competitors (links)
  brandAssets?: string[]; // Brand assets links
  fontUsed?: string[]; // Array of fonts used
  smmDriveLink?: string;
  contractDeliverables?: string;
  createdAt: string;
  updatedAt: string;
}