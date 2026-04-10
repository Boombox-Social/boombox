// src/app/types/influencer.types.ts

export enum Tier {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

export interface Influencer {
  id: number;
  name: string;
  tag: string | null;
  niche: string | null;
  username: string;
  tiktokFollowers: string | null;
  facebookFollowers: string | null;
  instagramFollowers: string | null;
  tier: Tier | null;
  contentStyle: string | null;
  avgViews: string | null;
  contact: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInfluencerDto {
  name: string;
  username?: string;
  tag?: string;
  niche?: string;
  tiktokFollowers?: string;
  facebookFollowers?: string;
  instagramFollowers?: string;
  tier?: Tier;
  contentStyle?: string;
  avgViews?: string;
  contact?: string;
  notes?: string;
}

export interface UpdateInfluencerDto {
  name?: string;
  username?: string;
  tag?: string;
  niche?: string;
  tiktokFollowers?: string;
  facebookFollowers?: string;
  instagramFollowers?: string;
  tier?: Tier;
  contentStyle?: string;
  avgViews?: string;
  contact?: string;
  notes?: string;
}

export interface InfluencerFilters {
  search?: string;
  tier?: Tier | "all";
  niche?: string | "all";
}

export interface InfluencerTableRow extends Influencer {
  isEditing?: boolean;
  isNew?: boolean;
}

export interface CSVImportResult {
  success: number;
  failed: number;
  errors: string[];
}
