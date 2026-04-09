import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';

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

interface BenefitsState {
  totalSavingsYear: number;
  categories: { name: string; discount: string; color: string }[];
  featuredBenefit: { title: string; description: string; maxAmount: number } | null;
  nearbyBusinesses: NearbyBusiness[];
  savingsHistory: SavingsEntry[];
  activeBenefitsCount: number;

  recordSaving: (entry: Omit<SavingsEntry, 'id'>) => void;
}

export const useBenefitsStore = create<BenefitsState>()(
  persist(
    (set) => ({
      totalSavingsYear: 47800,
      categories: [
        { name: 'Farmacia', discount: '20%', color: '#00C48C' },
        { name: 'Supermercado', discount: '15%', color: '#00E5FF' },
        { name: 'Optica', discount: '10%', color: '#C87533' },
        { name: 'Combustible', discount: '5%', color: '#FFB020' },
        { name: 'Indumentaria', discount: '25%', color: '#6B4EFF' },
        { name: 'Celulares', discount: '12 cuotas', color: '#00E5FF' },
        { name: 'Educacion Hijos', discount: 'Becas $30k', color: '#00C48C' },
        { name: 'Salud Familiar', discount: 'Cobertura', color: '#FF3B4A' },
      ],
      featuredBenefit: {
        title: 'Turismo Familiar',
        description: 'Hasta 35% en alojamientos de montana y excursiones exclusivas para trabajadores del sector.',
        maxAmount: 150000,
      },
      nearbyBusinesses: [
        { id: 'nb-1', name: 'Mercado Central Industrial', distance: '0.8 km', category: 'Alimentos', discount: '15%', hasQR: true },
        { id: 'nb-2', name: 'Viandas del Minero', distance: '1.2 km', category: 'Alimentos', discount: '10%', hasQR: true },
        { id: 'nb-3', name: 'Gimnasio El Risco', distance: '2.1 km', category: 'Deporte', discount: '20%', hasQR: false },
      ],
      savingsHistory: [
        { id: 's-1', store: 'Farmacity', amount: 1200, date: '2026-04-04', category: 'Farmacia' },
        { id: 's-2', store: 'Shell Arroyo', amount: 850, date: '2026-04-02', category: 'Combustible' },
        { id: 's-3', store: 'Carrefour Express', amount: 10520, date: '2026-03-30', category: 'Supermercado' },
      ],
      activeBenefitsCount: 3,

      recordSaving: (entry) =>
        set((state) => ({
          savingsHistory: [{ ...entry, id: `s-${Date.now()}` }, ...state.savingsHistory],
          totalSavingsYear: state.totalSavingsYear + entry.amount,
        })),
    }),
    { name: 'mineral-benefits', storage: mmkvStorage }
  )
);
