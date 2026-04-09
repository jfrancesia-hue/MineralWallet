import { useCallback } from 'react';
import { useWalletStore } from '../stores';

export function useWallet() {
  // Subscribe to individual primitives to avoid re-renders from unrelated state changes
  const balance = useWalletStore((s) => s.balance);
  const savings = useWalletStore((s) => s.savings);
  const usdtBalance = useWalletStore((s) => s.usdtBalance);
  const usdtRate = useWalletStore((s) => s.usdtRate);
  const adelantoDisponible = useWalletStore((s) => s.adelantoDisponible);
  const adelantoUsado = useWalletStore((s) => s.adelantoUsado);
  const transactions = useWalletStore((s) => s.transactions);
  const cvu = useWalletStore((s) => s.cvu);
  const alias = useWalletStore((s) => s.alias);
  const familyContacts = useWalletStore((s) => s.familyContacts);
  const creditScore = useWalletStore((s) => s.creditScore);
  const activeLoans = useWalletStore((s) => s.activeLoans);
  const isLoading = useWalletStore((s) => s.isLoading);
  const error = useWalletStore((s) => s.error);

  // Stable action references from the store (Zustand actions never change identity)
  const fetchBalance = useWalletStore((s) => s.fetchBalance);
  const fetchTransactions = useWalletStore((s) => s.fetchTransactions);
  const fetchFamilyContacts = useWalletStore((s) => s.fetchFamilyContacts);
  const fetchLoans = useWalletStore((s) => s.fetchLoans);
  const storeRequestAdelanto = useWalletStore((s) => s.requestAdelanto);
  const storeConvertUsdt = useWalletStore((s) => s.convertUsdt);
  const storeSendTransfer = useWalletStore((s) => s.sendTransfer);
  const clearError = useWalletStore((s) => s.clearError);

  const formattedBalance = balance.toLocaleString('es-AR');
  const formattedSavings = savings.toLocaleString('es-AR');
  const formattedUSDT = `${usdtBalance.toFixed(2)} USDT`;
  const usdtInARS = (usdtBalance * usdtRate).toLocaleString('es-AR');

  // fetchAll: runs all data fetches in parallel
  const fetchAll = useCallback(async () => {
    await Promise.all([
      fetchBalance(),
      fetchTransactions(),
      fetchFamilyContacts(),
      fetchLoans(),
    ]);
  }, [fetchBalance, fetchTransactions, fetchFamilyContacts, fetchLoans]);

  const sendTransfer = useCallback(
    async (recipientId: string, amount: number, motivo?: string) => {
      await storeSendTransfer(recipientId, amount, 'Transferencia', motivo);
    },
    [storeSendTransfer]
  );

  // requestAdvance: defer reading adelantoDisponible inside the callback to avoid
  // subscribing the callback to every balance change (rerender-defer-reads).
  // Return value signals success by checking store error state is cleared after call.
  const requestAdvance = useCallback(
    async (amount: number): Promise<boolean> => {
      const current = useWalletStore.getState().adelantoDisponible;
      if (amount > current) return false;
      await storeRequestAdelanto(amount);
      return useWalletStore.getState().error === null;
    },
    [storeRequestAdelanto]
  );

  const buyUSDT = useCallback(
    async (arsAmount: number) => {
      await storeConvertUsdt(arsAmount, 'ars_to_usdt');
    },
    [storeConvertUsdt]
  );

  const sellUSDT = useCallback(
    async (usdtAmount: number) => {
      // Read rate at call-time via getState to avoid stale closure without dep on usdtRate
      const rate = useWalletStore.getState().usdtRate;
      const arsAmount = usdtAmount * rate;
      await storeConvertUsdt(arsAmount, 'usdt_to_ars');
    },
    [storeConvertUsdt]
  );

  return {
    balance,
    savings,
    usdtBalance,
    usdtRate,
    adelantoDisponible,
    adelantoUsado,
    transactions,
    cvu,
    alias,
    familyContacts,
    creditScore,
    activeLoans,
    isLoading,
    error,
    formattedBalance,
    formattedSavings,
    formattedUSDT,
    usdtInARS,
    fetchAll,
    fetchBalance,
    fetchTransactions,
    fetchFamilyContacts,
    fetchLoans,
    sendTransfer,
    requestAdvance,
    buyUSDT,
    sellUSDT,
    clearError,
  };
}
