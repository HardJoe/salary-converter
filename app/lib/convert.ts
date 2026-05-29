// Static exchange rates relative to USD as base currency
// Updated: 2025 approximate mid-market rates
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.89,
  SGD: 1.34,
  IDR: 15800,
  INR: 83.2,
  CNY: 7.23,
  BRL: 4.97,
  MXN: 17.2,
  KRW: 1335,
  SEK: 10.4,
  NOK: 10.5,
  DKK: 6.88,
  PLN: 3.98,
  ZAR: 18.9,
  AED: 3.67,
  THB: 35.1,
  VND: 24500,
  MYR: 4.71,
  PHP: 56.5,
  NZD: 1.63,
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  if (fromCurrency === toCurrency) return amount
  const fromRate = EXCHANGE_RATES[fromCurrency] ?? 1
  const toRate = EXCHANGE_RATES[toCurrency] ?? 1
  const usd = amount / fromRate
  return usd * toRate
}

export function adjustForCostOfLiving(
  convertedSalary: number,
  sourceIndex: number,
  targetIndex: number,
): number {
  if (sourceIndex === 0) return convertedSalary
  return convertedSalary * (targetIndex / sourceIndex)
}

export function calcPercentageDiff(adjusted: number, converted: number): number {
  if (converted === 0) return 0
  return ((adjusted - converted) / converted) * 100
}

export function formatCurrency(amount: number, symbol: string, currency: string): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
  return `${symbol}${formatted} ${currency}`
}
