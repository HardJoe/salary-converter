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

/**
 * Calculates dynamic input width based on currency symbol length.
 * Shrinks input field to maintain consistent spacing regardless of symbol width.
 * @param symbolLength - Length of the currency symbol (1-3 characters)
 * @returns CSS width calculation string (e.g., "calc(100% - 3rem)")
 */
export function calculateInputWidth(symbolLength: number): string {
  // Symbol space: 1rem per character (approx 16px per char in Inter font)
  // Left padding (before symbol): 1rem (md spacing)
  // Right padding: 1rem (pr-md)
  // Total space needed: left-padding + (symbol-length × 1rem) + right-padding
  const totalSpace = 1 + symbolLength + 1 // left + symbol-chars + right
  return `calc(100% - ${totalSpace}rem)`
}
