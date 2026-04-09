export function formatARS(amount: number): string {
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatARSFull(amount: number): string {
  return amount.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatUSDT(amount: number): string {
  return amount.toFixed(2);
}

export function parseAmountInput(text: string): number {
  const cleaned = text.replace(/[^0-9.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function formatCompactAmount(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
  return amount.toString();
}

export function arsToUSDT(arsAmount: number, rate: number): number {
  return arsAmount / rate;
}

export function usdtToARS(usdtAmount: number, rate: number): number {
  return usdtAmount * rate;
}
