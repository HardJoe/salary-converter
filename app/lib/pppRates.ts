// PPP Conversion Rates - World Bank Data 2024
// Represents local currency units per 1 USD (at Purchasing Power Parity)
// Source: World Bank, International Comparison Program
export const pppRates: Record<string, number> = {
  USD: 1,
  GBP: 0.73,
  EUR: 0.87,
  JPY: 102,
  CAD: 1.23,
  AUD: 1.37,
  CHF: 1.11,
  SGD: 1.38,
  IDR: 4758.7,
  INR: 21.5,
  CNY: 3.5,
  BRL: 2.12,
  MXN: 8.5,
  KRW: 800,
  SEK: 7.1,
  NOK: 8.5,
  DKK: 5.3,
  PLN: 2.4,
  ZAR: 7.5,
  AED: 2.7,
  THB: 14.2,
  VND: 9100,
  MYR: 1.9,
  PHP: 18,
  NZD: 1.42,
}

export function getPppRate(currency: string): number {
  return pppRates[currency] ?? 1
}
