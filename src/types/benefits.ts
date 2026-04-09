export interface Benefit {
  id: string;
  category: string;
  merchant: string;
  discount: string;
  description: string;
  color: string;
}

export interface NearbyBusiness {
  id: string;
  name: string;
  distance: string;
  category: string;
  discount: string;
  hasQR: boolean;
}

export interface SavingsEntry {
  id: string;
  store: string;
  amount: number;
  date: string;
  category: string;
}

export interface BenefitCategory {
  name: string;
  discount: string;
  color: string;
}

export interface FeaturedBenefit {
  title: string;
  description: string;
  maxAmount: number;
}
