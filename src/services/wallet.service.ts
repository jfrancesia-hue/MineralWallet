import { api } from './apiClient';
import type { Transaction, FamilyContact, ActiveLoan } from '../types';

interface WalletBalance {
  balance: number;
  savings: number;
  usdtBalance: number;
  usdtRate: number;
  adelantoDisponible: number;
  adelantoUsado: number;
  cvu: string;
  alias: string;
  creditScore: number;
}

interface TransferRequest {
  toContactId?: string;
  toCvu?: string;
  amount: number;
  description?: string;
}

interface AdelantoRequest {
  amount: number;
}

interface UsdtConvertRequest {
  amountArs: number;
  direction: 'ars_to_usdt' | 'usdt_to_ars';
}

export const walletService = {
  getBalance: () =>
    api.get<WalletBalance>('/wallet/balance'),

  getTransactions: (page = 1, pageSize = 20) =>
    api.get<Transaction[]>('/wallet/transactions', {
      page: String(page),
      pageSize: String(pageSize),
    }),

  transfer: (data: TransferRequest) =>
    api.post<Transaction>('/wallet/transfer', data),

  requestAdelanto: (data: AdelantoRequest) =>
    api.post<Transaction>('/wallet/adelanto', data),

  convertUsdt: (data: UsdtConvertRequest) =>
    api.post<{ newUsdtBalance: number; newArsBalance: number }>('/wallet/usdt/convert', data),

  getFamilyContacts: () =>
    api.get<FamilyContact[]>('/wallet/family-contacts'),

  sendToFamily: (contactId: string, amount: number) =>
    api.post<Transaction>('/wallet/family-contacts/send', { contactId, amount }),

  getActiveLoans: () =>
    api.get<ActiveLoan[]>('/wallet/loans'),

  requestMicrocredit: (amount: number, reason: string) =>
    api.post<ActiveLoan>('/wallet/loans/request', { amount, reason }),

  generateQR: (amount?: number) =>
    api.post<{ qrData: string; expiresAt: string }>('/wallet/qr/generate', { amount }),

  payQR: (qrData: string) =>
    api.post<Transaction>('/wallet/qr/pay', { qrData }),
};
