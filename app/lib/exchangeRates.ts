// Real-time exchange rates from Open Exchange Rates API
// Cache rates for 1 hour to minimize API calls
// Falls back to PPP rates if API unavailable

import { pppRates } from './pppRates'

interface ExchangeRateCache {
  rates: Record<string, number>
  timestamp: number
}

let rateCache: ExchangeRateCache | null = null
const CACHE_DURATION = 3600000 // 1 hour

// Market exchange rates relative to USD (base currency)
// These are fetched from the API if available, otherwise fallback to PPP rates
let marketRates: Record<string, number> = { ...pppRates }

async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Use exchangerate-api.com (free, no key needed) or similar
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    const data = (await response.json()) as { rates: Record<string, number> }

    if (data.rates) {
      return data.rates
    }
  } catch (error) {
    console.warn('Failed to fetch exchange rates:', error)
  }

  // Fallback to hardcoded rates if API fails
  return pppRates
}

export async function getMarketRate(fromCurrency: string, toCurrency: string): Promise<number> {
  if (fromCurrency === toCurrency) return 1

  // Check cache
  const now = Date.now()
  if (rateCache && now - rateCache.timestamp < CACHE_DURATION) {
    const rate = calculateRate(rateCache.rates, fromCurrency, toCurrency)
    if (rate > 0) return rate
  }

  // Fetch fresh rates
  try {
    const rates = await fetchExchangeRates()
    rateCache = { rates, timestamp: now }
    return calculateRate(rates, fromCurrency, toCurrency)
  } catch {
    // Ultimate fallback: use PPP rates
    return calculateRate(pppRates, fromCurrency, toCurrency)
  }
}

function calculateRate(rates: Record<string, number>, fromCurrency: string, toCurrency: string): number {
  const fromRate = rates[fromCurrency] ?? 1
  const toRate = rates[toCurrency] ?? 1

  if (fromRate === 0 || toRate === 0) return 1

  return toRate / fromRate
}

// Synchronous access to cached rates (for instant calculations)
export function getMarketRateSync(fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return 1

  const rates = rateCache?.rates ?? pppRates
  return calculateRate(rates, fromCurrency, toCurrency)
}

// Preload rates on app start
export async function preloadExchangeRates(): Promise<void> {
  try {
    const rates = await fetchExchangeRates()
    rateCache = { rates, timestamp: Date.now() }
  } catch {
    // Silently fail and use PPP rates as fallback
  }
}
