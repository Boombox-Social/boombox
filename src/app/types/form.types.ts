// types/form.types.ts
export interface NewClientForm {
  name: string;
  address: string;
  industry: string;
  slogan?: string;
  links: string;
  coreProducts: string;
  idealCustomers: string;
  brandEmotion: string;
  uniqueProposition: string;
  whyChooseUs: string;
  mainGoal: string;
  shortTermGoal?: string;
  longTermGoal?: string;
  competitors: string;
  indirectCompetitors: string;
  brandAssets: string[];
  fontUsed: string;
  smmDriveLink?: string;
  contractDeliverables?: string;
}

