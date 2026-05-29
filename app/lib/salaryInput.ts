// Currency codes that use no decimal places
const NO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW', 'IDR', 'CNY', 'VND'])

/**
 * Returns the number of decimal places used by a currency.
 * @param currency - ISO currency code (e.g., 'USD', 'JPY')
 * @returns 2 for standard currencies, 0 for non-decimal currencies, defaults to 2 for unknowns
 */
export function getCurrencyDecimalPlaces(currency: string): number {
  return NO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2
}
