import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';
import { benefitsService } from '../services/benefits.service';
import type { NearbyBusiness, SavingsEntry, BenefitCategory, FeaturedBenefit } from '../types';

interface BenefitsState {
  totalSavingsYear: number;
  categories: BenefitCategory[];
  featuredBenefit: FeaturedBenefit | null;
  nearbyBusinesses: NearbyBusiness[];
  savingsHistory: SavingsEntry[];
  activeBenefitsCount: number;
  isLoading: boolean;
  error: string | null;
}

interface BenefitsActions {
  fetchSummary: () => Promise<void>;
  fetchNearby: (lat: number, lng: number) => Promise<void>;
  redeemBenefit: (businessId: string, amount: number) => Promise<void>;
  recordSaving: (entry: Omit<SavingsEntry, 'id'>) => void;
  clearError: () => void;
}

type BenefitsStore = BenefitsState & BenefitsActions;

const initialState: BenefitsState = {
  totalSavingsYear: 0,
  categories: [],
  featuredBenefit: null,
  nearbyBusinesses: [],
  savingsHistory: [],
  activeBenefitsCount: 0,
  isLoading: false,
  error: null,
};

export const useBenefitsStore = create<BenefitsStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchSummary: async () => {
        set({ isLoading: true, error: null });
        const response = await benefitsService.getSummary();
        if (response.success && response.data) {
          set({
            totalSavingsYear: response.data.totalSavingsYear,
            activeBenefitsCount: response.data.activeBenefitsCount,
            categories: response.data.categories,
            featuredBenefit: response.data.featuredBenefit,
            nearbyBusinesses: (response.data as any).nearbyBusinesses ?? [],
            savingsHistory: (response.data as any).savingsHistory ?? [],
            isLoading: false,
          });
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al obtener beneficios' });
        }
      },

      fetchNearby: async (lat, lng) => {
        set({ isLoading: true, error: null });
        const response = await benefitsService.getNearbyBusinesses(lat, lng);
        if (response.success && response.data) {
          set({ nearbyBusinesses: response.data, isLoading: false });
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al obtener comercios cercanos' });
        }
      },

      redeemBenefit: async (businessId, amount) => {
        set({ isLoading: true, error: null });
        const response = await benefitsService.redeemBenefit(businessId, amount);
        if (response.success && response.data) {
          set((state) => ({
            savingsHistory: [response.data!, ...state.savingsHistory],
            totalSavingsYear: state.totalSavingsYear + amount,
            isLoading: false,
          }));
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al canjear beneficio' });
        }
      },

      recordSaving: (entry) =>
        set((state) => ({
          savingsHistory: [{ ...entry, id: `s-${Date.now()}` }, ...state.savingsHistory],
          totalSavingsYear: state.totalSavingsYear + entry.amount,
        })),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mineral-benefits',
      storage: mmkvStorage,
      partialize: (state) => ({
        totalSavingsYear: state.totalSavingsYear,
        categories: state.categories,
        featuredBenefit: state.featuredBenefit,
        nearbyBusinesses: state.nearbyBusinesses,
        savingsHistory: state.savingsHistory,
        activeBenefitsCount: state.activeBenefitsCount,
      }),
    }
  )
);
