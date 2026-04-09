import { api } from './apiClient';
import type { NearbyBusiness, SavingsEntry, BenefitCategory, FeaturedBenefit } from '../types';

interface BenefitsSummary {
  totalSavingsYear: number;
  activeBenefitsCount: number;
  categories: BenefitCategory[];
  featuredBenefit: FeaturedBenefit | null;
}

export const benefitsService = {
  getSummary: () =>
    api.get<BenefitsSummary>('/benefits/summary'),

  getNearbyBusinesses: (latitude: number, longitude: number) =>
    api.get<NearbyBusiness[]>('/benefits/nearby', {
      lat: String(latitude),
      lng: String(longitude),
    }),

  getSavingsHistory: (page = 1) =>
    api.get<SavingsEntry[]>('/benefits/savings', { page: String(page) }),

  redeemBenefit: (businessId: string, amount: number) =>
    api.post<SavingsEntry>('/benefits/redeem', { businessId, amount }),
};
