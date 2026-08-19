# Salary Conversion Calculation Verification

## How the Conversion Works

The app now uses **real-time market exchange rates** from the exchangerate-api.com API to convert salaries between currencies.

### Exchange Rate Format
- Base currency: USD
- Format: Number of local currency units per 1 USD
- Example: If EUR rate is 0.92, then 1 USD = 0.92 EUR

### Conversion Formula
```
targetSalary = sourceSalary × (targetCurrencyRate ÷ sourceCurrencyRate)
```

### Example: USD to EUR Conversion
Assume:
- Source salary: $50,000 USD/year
- Exchange rates: USD = 1, EUR = 0.92

Calculation:
```
50,000 USD × (0.92 ÷ 1) = 46,000 EUR
```

### Verification: Reverse Conversion
To verify correctness, convert back to source currency:
```
46,000 EUR × (1 ÷ 0.92) = 50,000 USD ✓
```

## Display in UI
The app shows:
1. **Main salary field**: The converted salary in target currency
2. **Inline exchange rate**: Shows the conversion rate (e.g., "EUR 1 ≈ USD 1.09")
3. **Source currency equivalent**: Converts the target salary back to source currency for reference

## Real-Time Data Sources

### Primary Source: exchangerate-api.com
- Free API, no authentication required
- Updates rates regularly (typically daily)
- Endpoint: `https://api.exchangerate-api.com/v4/latest/USD`

### Fallback: Hardcoded PPP Rates
If the API is unavailable:
- Falls back to cached PPP (Purchasing Power Parity) rates
- Ensures app functionality even without internet
- PPP rates from World Bank 2024 data

### Cache Strategy
- Exchange rates cached for 1 hour
- Minimizes API calls while keeping data fresh
- Cache invalidates automatically after expiry

## Supported Currencies
The app supports 30 currencies across all major regions:
- Major: USD, EUR, GBP, JPY, CAD, AUD, CHF
- Asia-Pacific: SGD, IDR, INR, CNY, KRW, THB, VND, MYR, PHP, NZD
- Europe: SEK, NOK, DKK, PLN, ZAR, AED
- Americas: BRL, MXN

## Technical Details

### Files Involved
- `app/lib/exchangeRates.ts` - Fetches and caches real exchange rates
- `app/lib/convert.ts` - Performs currency conversion calculations
- `app/lib/pppRates.ts` - Fallback PPP rate data
- `app/routes/index.tsx` - Preloads exchange rates on app load

### Error Handling
1. API fetch fails → Uses cached rates
2. No cached rates → Uses hardcoded PPP rates
3. All fallbacks preserve app functionality

## Accuracy Notes

- Market rates from exchangerate-api.com are mid-market rates
- Actual rates depend on your bank/provider (may include spreads)
- PPP rates represent purchasing power equivalence, not market rates
- Rates refresh every 1 hour (cache duration)
