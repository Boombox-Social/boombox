export interface Client {
  id: number;
  name: string;
  info: string;
  logo: string; // ⬅ add this line
  industry: string;
  links: string[];
  niche: string;
  businessAge: string;
  description: string;
  coreProducts: string[];
  idealCustomer: string;
  brandEmotion: string;
  uniqueSelling: string;
  mainGoal: string;
  competitors: string[];
  inspo: string[];
  brandColors: string;
  fontUsed: string;
}
