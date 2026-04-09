import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';

interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
}

interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  lastSentAmount: number;
  lastSentDate: string;
  totalSentYear: number;
  method: string;
}

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
  activeLoans: { id: string; name: string; total: number; paid: number; cuota: number; nextDate: string }[];
}

export const useWalletStore = create<WalletState>()(
  persist(
    () => ({
      balance: 847250,
      savings: 125000,
      usdtBalance: 340,
      usdtRate: 1000,
      adelantoDisponible: 200000,
      adelantoUsado: 0,
      transactions: [
        { id: 'tx-1', title: 'Deposito de Nomina', amount: 420000, date: '2026-04-05', type: 'income', category: 'salary' },
        { id: 'tx-2', title: 'Comisaria Industrial', amount: -12500, date: '2026-04-04', type: 'expense', category: 'services' },
        { id: 'tx-3', title: 'Transferencia a Maria', description: 'Esposa', amount: -50000, date: '2026-04-03', type: 'transfer', category: 'family' },
        { id: 'tx-4', title: 'Adelanto de sueldo', amount: 150000, date: '2026-04-01', type: 'income', category: 'advance' },
        { id: 'tx-5', title: 'Farmacia Catamarca', description: 'Beneficio 20%', amount: -4500, date: '2026-03-30', type: 'expense', category: 'pharmacy' },
        { id: 'tx-6', title: 'Bono asistencia perfecta', description: 'Empresa', amount: 25000, date: '2026-03-28', type: 'income', category: 'bonus' },
      ] as Transaction[],
      cvu: '0000003100012345678901',
      alias: 'MINA.ORO.WALLE',
      familyContacts: [
        { id: 'f-1', name: 'Maria', relationship: 'Esposa', lastSentAmount: 80000, lastSentDate: '2026-04-06', totalSentYear: 480000, method: 'CBU Banco Nacion' },
        { id: 'f-2', name: 'Mama', relationship: 'Madre', lastSentAmount: 30000, lastSentDate: '2026-03-25', totalSentYear: 180000, method: 'Billetera virtual' },
        { id: 'f-3', name: 'Hermano', relationship: 'Hermano', lastSentAmount: 15000, lastSentDate: '2026-03-12', totalSentYear: 90000, method: 'CBU' },
      ],
      creditScore: 92,
      activeLoans: [
        { id: 'loan-1', name: 'Refaccion de Maquinaria', total: 300000, paid: 120000, cuota: 45200, nextDate: '2026-05-01' },
      ],
    }),
    {
      name: 'mineral-wallet',
      storage: mmkvStorage,
    }
  )
);
