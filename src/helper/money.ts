export const KHR_RATE = 4100;

export type DisplayCurrency = 'USD' | 'KHR';

export function usdToKhr(usd: number): number {
  return Math.round(usd * KHR_RATE);
}

export function formatUsd(usd: number): string {
  return `$${usd.toFixed(2)}`;
}

export function formatKhr(usd: number): string {
  return `៛${usdToKhr(usd).toLocaleString('en-US')}`;
}

export function formatMoney(usd: number, currency: DisplayCurrency): string {
  return currency === 'KHR' ? formatKhr(usd) : formatUsd(usd);
}

export function discountPct(price: number, compare?: number | null): number | null {
  if (!compare || compare <= price) return null;
  return Math.round((1 - price / compare) * 100);
}
