// types/client.types.ts
export interface Client {
  id?: number;
  logo?: string | null;
  name: string;
  address?: string | null;
  industry?: string | null;
  slogan?: string | null;
  links?: string[];
  coreProducts?: string[];
  idealCustomers?: string | null;
  brandEmotion?: string | null;
  uniqueProposition?: string | null;
  whyChooseUs?: string | null;
  mainGoal?: string | null;
  shortTermGoal?: string | null;
  longTermGoal?: string | null;
  competitors?: string[];
  indirectCompetitors?: string[];
  brandAssets?: string[];
  fontUsed?: string[];
  smmDriveLink?: string | null;
  contractDeliverables?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  aiLink?: string;
  basecampLink?: string;
  archived?: boolean;
  
  // UPDATED: Multiple assigned users
  assignedUserId?: number | null; // Keep for backward compatibility
  assignedUserIds?: number[]; // NEW: Array of assigned user IDs
  assignedUsers?: AssignedUser[]; // Populated array of user details
  createdById?: number;
  createdBy?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface AssignedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

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
  brandAssets?: string | string[];
  fontUsed?: string | string[];
  smmDriveLink?: string;
  contractDeliverables?: string;
  logo?: string | null;
  
  // NEW: Multiple user assignment
  assignedUserIds?: number[];
}