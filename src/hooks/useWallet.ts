import { useCallback } from 'react';
import { useWalletStore } from '../stores';

export function useWallet() {
  const store = useWalletStore();

  const formattedBalance = store.balance.toLocaleString('es-AR');
  const formattedSavings = store.savings.toLocaleString('es-AR');
  const formattedUSDT = `${store.usdtBalance.toFixed(2)} USDT`;
  const usdtInARS = (store.usdtBalance * store.usdtRate).toLocaleString('es-AR');

  const sendTransfer = useCallback(async (recipientId: string, amount: number, motivo?: string) => {
    // TODO: API call + sync queue
    // For now, optimistically update balance
    useWalletStore.setState((state) => ({
      balance: state.balance - amount,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          title: `Transferencia`,
          amount: -amount,
          date: new Date().toISOString().split('T')[0],
          type: 'transfer' as const,
          category: motivo || 'transfer',
        },
        ...state.transactions,
      ],
    }));
  }, []);

  const requestAdvance = useCallback(async (amount: number) => {
    if (amount > store.adelantoDisponible) return false;
    useWalletStore.setState((state) => ({
      balance: state.balance + amount,
      adelantoUsado: state.adelantoUsado + amount,
      adelantoDisponible: state.adelantoDisponible - amount,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          title: 'Adelanto de sueldo',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          type: 'income' as const,
          category: 'advance',
        },
        ...state.transactions,
      ],
    }));
    return true;
  }, [store.adelantoDisponible]);

  const buyUSDT = useCallback((arsAmount: number) => {
    const usdtAmount = arsAmount / store.usdtRate;
    useWalletStore.setState((state) => ({
      balance: state.balance - arsAmount,
      usdtBalance: state.usdtBalance + usdtAmount,
    }));
  }, [store.usdtRate]);

  const sellUSDT = useCallback((usdtAmount: number) => {
    const arsAmount = usdtAmount * store.usdtRate;
    useWalletStore.setState((state) => ({
      balance: state.balance + arsAmount,
      usdtBalance: state.usdtBalance - usdtAmount,
    }));
  }, [store.usdtRate]);

  return {
    ...store,
    formattedBalance,
    formattedSavings,
    formattedUSDT,
    usdtInARS,
    sendTransfer,
    requestAdvance,
    buyUSDT,
    sellUSDT,
  };
}
