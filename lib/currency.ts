// lib/currency.ts

// Фиксиран курс за тестове (1 EUR = 1.95583 BGN)
export const EUR_TO_BGN = 1.95583;

export interface Price {
  eur: number;
  bgn: number;
}

export function formatPrice(amount: number, currency: 'EUR' | 'BGN'): string {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function convertToBGN(eurAmount: number): number {
  return Number((eurAmount * EUR_TO_BGN).toFixed(2));
}

export function getDualPrice(eurAmount: number): { eur: string; bgn: string } {
  return {
    eur: formatPrice(eurAmount, 'EUR'),
    bgn: formatPrice(convertToBGN(eurAmount), 'BGN'),
  };
}

// Проверка дали сме в преходния период (до юни 2026)
export function isTransitionPeriod(): boolean {
  const now = new Date();
  const transitionEnd = new Date('2026-06-30');
  return now <= transitionEnd;
}