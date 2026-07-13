export type Status = "pending" | "approved" | "rejected";
export type Tier = "free" | "featured";
export type Payment = "none" | "pending" | "paid";

export type Registration = {
  id: string;
  uid?: string; // Supabase uuid
  company: string;
  country: string;
  website: string;
  contact: string;
  email: string;
  phone: string;
  businessType: string;
  products: string;
  manufactures: boolean;
  manufacturingCountry: string;
  interestedAfrica: boolean;
  interestedCameroon: boolean;
  africanPct: number;
  ingredients: string;
  capacity: string;
  tier: Tier;
  payment: Payment;
  status: Status;
  submittedAt: string;
};
