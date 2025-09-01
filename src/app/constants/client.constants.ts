// constants/client.constants.ts
import { Client, NewClientForm } from '../types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 1,
    name: "Acme Corp",
    address: "NY, USA",
    industry: "Logistics",
    slogan: "Moving Forward Together",
    links: ["https://acmecorp.com", "https://twitter.com/acmecorp"],
    coreProducts: ["LogiTrack", "FleetSync"],
    idealCustomers: "Large logistics companies",
    brandEmotion: "Reliable, Innovative",
    uniqueProposition: "Real-time tracking with AI optimization",
    whyChooseUs: "Industry leading technology with proven results",
    mainGoal: "Expand to Europe",
    shortTermGoal: "Increase market share by 15%",
    longTermGoal: "Become industry leader in AI logistics",
    competitors: ["Flexport", "Project44"],
    indirectCompetitors: ["Traditional freight companies"],
    brandAssets: [],
    fontUsed: ["Inter", "Arial"],
    smmDriveLink: "https://drive.google.com/example",
    contractDeliverables: "Monthly reporting, 3 posts per week",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_FORM_STATE: NewClientForm = {
  name: '',
  address: '',
  industry: '',
  slogan: '',
  links: '',
  coreProducts: '',
  idealCustomers: '',
  brandEmotion: '',
  uniqueProposition: '',
  whyChooseUs: '',
  mainGoal: '',
  shortTermGoal: '',
  longTermGoal: '',
  competitors: '',
  indirectCompetitors: '',
  brandAssets: [],
  fontUsed: '',
  smmDriveLink: '',
  contractDeliverables: ''
};