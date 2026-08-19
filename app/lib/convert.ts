import { getPppRate } from './pppRates'

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  if (fromCurrency === toCurrency) return amount
  const fromPpp = getPppRate(fromCurrency)
  const toPpp = getPppRate(toCurrency)
  return amount * (toPpp / fromPpp)
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
