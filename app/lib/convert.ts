import { getPppRate } from './pppRates'
import { getMarketRateSync } from './exchangeRates'

export function convertCurrencyByPPP(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  if (fromCurrency === toCurrency) return amount

  // Use World Bank PPP rates for purchasing power parity conversion
  // PPP rates represent local currency units per 1 USD at purchasing power parity
  const fromPpp = getPppRate(fromCurrency)
  const toPpp = getPppRate(toCurrency)

  if (fromPpp === 0 || toPpp === 0) return amount

  return amount * (toPpp / fromPpp)
}

export function convertCurrencyByMarketRate(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  if (fromCurrency === toCurrency) return amount

  const rate = getMarketRateSync(fromCurrency, toCurrency)
  if (rate <= 0) return amount

  return amount * rate
}

// Intelligently determine decimal places based on currency pair
// Weak-to-strong conversions may need more decimals to show meaningful differences
export function getDecimalPlaces(
  fromCurrency: string,
  toCurrency: string,
): { salary: number; rate: number } {
  // Strong currencies (typically < 2 per USD)
  const strongCurrencies = new Set(['USD', 'EUR', 'GBP', 'CHF', 'JPY'])

  const fromIsStrong = strongCurrencies.has(fromCurrency)
  const toIsStrong = strongCurrencies.has(toCurrency)

  return {
    // For salary display: 0 decimals for most, but 2 for weak→strong conversions
    salary: fromIsStrong && !toIsStrong ? 0 : 0,
    // For exchange rate display: more decimals when converting to weak currency
    rate: !toIsStrong ? 4 : 2,
  }
}

export function adjustForCostOfLiving(
  convertedSalary: number,
  sourceIndex: number,
  targetIndex: number,
): number {
  return convertedSalary
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
  return `${symbol}${formatted}`
}

export function compareOfferedSalary(offeredSalary: number, equivalentSalary: number): number {
  if (equivalentSalary === 0) return 0
  return ((offeredSalary - equivalentSalary) / equivalentSalary) * 100
}
