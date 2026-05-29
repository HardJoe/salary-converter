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

/**
 * Filters and validates salary input in real-time.
 * - Only allows: digits (0-9), comma, period
 * - Enforces one decimal separator: if comma is present, period is filtered (and vice versa)
 * @param input - The raw input string
 * @param previousValue - The previous valid value (used to detect which separator was already used)
 * @returns Cleaned valid input string
 */
export function validateAndFilterInput(input: string, previousValue: string = ''): string {
  // Step 1: Strip any character that's not a digit, comma, or period
  let filtered = input.replace(/[^0-9,.]/g, '')

  // Step 2: Determine which decimal separator (if any) is already in the previous value
  const prevHasComma = previousValue.includes(',')
  const prevHasPeriod = previousValue.includes('.')
  const prevSeparator = prevHasComma ? ',' : prevHasPeriod ? '.' : null

  // Step 3: Determine which separator is in the current filtered input
  const currHasComma = filtered.includes(',')
  const currHasPeriod = filtered.includes('.')

  // Step 4: If the user has already used one separator, remove the other one
  if (prevSeparator === ',') {
    // Comma already used, remove all periods
    filtered = filtered.replace(/\./g, '')
  } else if (prevSeparator === '.') {
    // Period already used, remove all commas
    filtered = filtered.replace(/,/g, '')
  } else {
    // No previous separator, but if user just typed both, keep the first one and remove the second
    if (currHasComma && currHasPeriod) {
      const commaIndex = filtered.indexOf(',')
      const periodIndex = filtered.indexOf('.')
      if (commaIndex < periodIndex) {
        // Comma came first, remove periods
        filtered = filtered.replace(/\./g, '')
      } else {
        // Period came first, remove commas
        filtered = filtered.replace(/,/g, '')
      }
    }
  }

  return filtered
}
