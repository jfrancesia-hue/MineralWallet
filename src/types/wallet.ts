export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
}

export interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  lastSentAmount: number;
  lastSentDate: string;
  totalSentYear: number;
  method: string;
}

export interface ActiveLoan {
  id: string;
  name: string;
  total: number;
  paid: number;
  cuota: number;
  nextDate: string;
}
