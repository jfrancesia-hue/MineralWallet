import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';
import { walletService } from '../services/wallet.service';
import type { Transaction, FamilyContact, ActiveLoan } from '../types';

interface WalletState {
  balance: number;
  savings: number;
  usdtBalance: number;
  usdtRate: number;
  adelantoDisponible: number;
  adelantoUsado: number;
  transactions: Transaction[];
  cvu: string;
  alias: string;
  familyContacts: FamilyContact[];
  creditScore: number;
  activeLoans: ActiveLoan[];
  isLoading: boolean;
  error: string | null;
}

interface WalletActions {
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchFamilyContacts: () => Promise<void>;
  fetchLoans: () => Promise<void>;
  sendTransfer: (recipientId: string, amount: number, title?: string, description?: string) => Promise<void>;
  requestAdelanto: (amount: number) => Promise<void>;
  convertUsdt: (arsAmount: number, direction: 'ars_to_usdt' | 'usdt_to_ars') => Promise<void>;
  sendToFamily: (contactId: string, amount: number) => Promise<void>;
  clearError: () => void;
}

type WalletStore = WalletState & WalletActions;

const initialState: WalletState = {
  balance: 0,
  savings: 0,
  usdtBalance: 0,
  usdtRate: 0,
  adelantoDisponible: 0,
  adelantoUsado: 0,
  transactions: [],
  cvu: '',
  alias: '',
  familyContacts: [],
  creditScore: 0,
  activeLoans: [],
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchBalance: async () => {
        set({ isLoading: true, error: null });
        const response = await walletService.getBalance();
        if (response.success && response.data) {
          set({
            balance: response.data.balance,
            savings: response.data.savings,
            usdtBalance: response.data.usdtBalance,
            usdtRate: response.data.usdtRate,
            adelantoDisponible: response.data.adelantoDisponible,
            adelantoUsado: response.data.adelantoUsado,
            cvu: response.data.cvu,
            alias: response.data.alias,
            creditScore: response.data.creditScore,
            isLoading: false,
          });
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al obtener saldo' });
        }
      },

      fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        const response = await walletService.getTransactions();
        if (response.success && response.data) {
          set({ transactions: response.data, isLoading: false });
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al obtener movimientos' });
        }
      },

      fetchFamilyContacts: async () => {
        set({ isLoading: true, error: null });
        const response = await walletService.getFamilyContacts();
        if (response.success && response.data) {
          set({ familyContacts: response.data, isLoading: false });
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al obtener contactos familiares' });
        }
      },

      fetchLoans: async () => {
        set({ isLoading: true, error: null });
        const response = await walletService.getActiveLoans();
        if (response.success && response.data) {
          set({ activeLoans: response.data, isLoading: false });
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al obtener préstamos' });
        }
      },

      sendTransfer: async (recipientId, amount, title, description) => {
        const prev = { balance: get().balance, transactions: get().transactions };
        const optimisticTx: Transaction = {
          id: `tx-optimistic-${Date.now()}`,
          title: title ?? 'Transferencia',
          description,
          amount: -amount,
          date: new Date().toISOString().split('T')[0],
          type: 'transfer',
          category: 'transfer',
        };
        set((state) => ({
          balance: state.balance - amount,
          transactions: [optimisticTx, ...state.transactions],
          error: null,
        }));
        const response = await walletService.transfer({ toContactId: recipientId, amount, description });
        if (response.success && response.data) {
          set((state) => ({
            transactions: state.transactions.map((tx) =>
              tx.id === optimisticTx.id ? response.data! : tx
            ),
          }));
        } else {
          set({
            balance: prev.balance,
            transactions: prev.transactions,
            error: response.error?.message ?? 'Error al realizar transferencia',
          });
        }
      },

      requestAdelanto: async (amount) => {
        set({ isLoading: true, error: null });
        const response = await walletService.requestAdelanto({ amount });
        if (response.success && response.data) {
          set((state) => ({
            balance: state.balance + amount,
            adelantoUsado: state.adelantoUsado + amount,
            adelantoDisponible: state.adelantoDisponible - amount,
            transactions: [response.data!, ...state.transactions],
            isLoading: false,
          }));
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al solicitar adelanto' });
        }
      },

      convertUsdt: async (arsAmount, direction) => {
        set({ isLoading: true, error: null });
        const response = await walletService.convertUsdt({ amountArs: arsAmount, direction });
        if (response.success && response.data) {
          set({
            usdtBalance: response.data.newUsdtBalance,
            balance: response.data.newArsBalance,
            isLoading: false,
          });
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al convertir USDT' });
        }
      },

      sendToFamily: async (contactId, amount) => {
        set({ isLoading: true, error: null });
        const response = await walletService.sendToFamily(contactId, amount);
        if (response.success && response.data) {
          set((state) => ({
            balance: state.balance - amount,
            transactions: [response.data!, ...state.transactions],
            isLoading: false,
          }));
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al enviar a familiar' });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mineral-wallet',
      storage: mmkvStorage,
      partialize: (state) => ({
        balance: state.balance,
        savings: state.savings,
        usdtBalance: state.usdtBalance,
        usdtRate: state.usdtRate,
        adelantoDisponible: state.adelantoDisponible,
        adelantoUsado: state.adelantoUsado,
        transactions: state.transactions,
        cvu: state.cvu,
        alias: state.alias,
        familyContacts: state.familyContacts,
        creditScore: state.creditScore,
        activeLoans: state.activeLoans,
      }),
    }
  )
);
