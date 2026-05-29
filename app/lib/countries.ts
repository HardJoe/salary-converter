import type { Country } from '../types'

export const countries: Country[] = [
  { name: 'United States', code: 'US', currency: 'USD', symbol: '$', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£', flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', currency: 'EUR', symbol: '€', flag: '🇩🇪' },
  { name: 'France', code: 'FR', currency: 'EUR', symbol: '€', flag: '🇫🇷' },
  { name: 'Japan', code: 'JP', currency: 'JPY', symbol: '¥', flag: '🇯🇵' },
  { name: 'Canada', code: 'CA', currency: 'CAD', symbol: 'CA$', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', currency: 'AUD', symbol: 'A$', flag: '🇦🇺' },
  { name: 'Netherlands', code: 'NL', currency: 'EUR', symbol: '€', flag: '🇳🇱' },
  { name: 'Switzerland', code: 'CH', currency: 'CHF', symbol: 'CHF', flag: '🇨🇭' },
  { name: 'Singapore', code: 'SG', currency: 'SGD', symbol: 'S$', flag: '🇸🇬' },
  { name: 'Indonesia', code: 'ID', currency: 'IDR', symbol: 'Rp', flag: '🇮🇩' },
  { name: 'India', code: 'IN', currency: 'INR', symbol: '₹', flag: '🇮🇳' },
  { name: 'China', code: 'CN', currency: 'CNY', symbol: '¥', flag: '🇨🇳' },
  { name: 'Brazil', code: 'BR', currency: 'BRL', symbol: 'R$', flag: '🇧🇷' },
  { name: 'Mexico', code: 'MX', currency: 'MXN', symbol: 'MX$', flag: '🇲🇽' },
  { name: 'South Korea', code: 'KR', currency: 'KRW', symbol: '₩', flag: '🇰🇷' },
  { name: 'Sweden', code: 'SE', currency: 'SEK', symbol: 'kr', flag: '🇸🇪' },
  { name: 'Norway', code: 'NO', currency: 'NOK', symbol: 'kr', flag: '🇳🇴' },
  { name: 'Denmark', code: 'DK', currency: 'DKK', symbol: 'kr', flag: '🇩🇰' },
  { name: 'Poland', code: 'PL', currency: 'PLN', symbol: 'zł', flag: '🇵🇱' },
  { name: 'Spain', code: 'ES', currency: 'EUR', symbol: '€', flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', currency: 'EUR', symbol: '€', flag: '🇮🇹' },
  { name: 'Portugal', code: 'PT', currency: 'EUR', symbol: '€', flag: '🇵🇹' },
  { name: 'South Africa', code: 'ZA', currency: 'ZAR', symbol: 'R', flag: '🇿🇦' },
  { name: 'UAE', code: 'AE', currency: 'AED', symbol: 'د.إ', flag: '🇦🇪' },
  { name: 'Thailand', code: 'TH', currency: 'THB', symbol: '฿', flag: '🇹🇭' },
  { name: 'Vietnam', code: 'VN', currency: 'VND', symbol: '₫', flag: '🇻🇳' },
  { name: 'Malaysia', code: 'MY', currency: 'MYR', symbol: 'RM', flag: '🇲🇾' },
  { name: 'Philippines', code: 'PH', currency: 'PHP', symbol: '₱', flag: '🇵🇭' },
  { name: 'New Zealand', code: 'NZ', currency: 'NZD', symbol: 'NZ$', flag: '🇳🇿' },
]

export function findCountry(code: string): Country | undefined {
  return countries.find((c) => c.code === code)
}
