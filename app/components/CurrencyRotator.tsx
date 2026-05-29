import { useState, useEffect, useMemo, memo } from 'react'
import { countries } from '../lib/countries'

export const CurrencyRotator = memo(function CurrencyRotator() {
  // Extract unique currencies with their display names
  const uniqueCurrencies = useMemo(() => {
    return Array.from(
      new Map(
        countries.map((c) => [
          c.currency,
          {
            code: c.currency,
            name: getCurrencyName(c.currency),
          },
        ])
      ).values()
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % uniqueCurrencies.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [uniqueCurrencies.length])

  const activeCurrency = uniqueCurrencies[activeIndex]

  if (!activeCurrency) {
    return null
  }

  return (
    <span className="text-primary whitespace-nowrap">
      <span className="inline-block animate-slide-up">
        {activeCurrency.name}
      </span>
    </span>
  )
})

function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    USD: 'US Dollars',
    GBP: 'British Pounds',
    EUR: 'Euros',
    JPY: 'Japanese Yen',
    CAD: 'Canadian Dollars',
    AUD: 'Australian Dollars',
    CHF: 'Swiss Francs',
    SGD: 'Singapore Dollars',
    IDR: 'Indonesian Rupiah',
    INR: 'Indian Rupees',
    CNY: 'Chinese Yuan',
    BRL: 'Brazilian Real',
    MXN: 'Mexican Pesos',
    KRW: 'Korean Won',
    SEK: 'Swedish Krona',
    NOK: 'Norwegian Krone',
    DKK: 'Danish Krone',
    PLN: 'Polish Zloty',
    ZAR: 'South African Rand',
    AED: 'UAE Dirham',
    THB: 'Thai Baht',
    VND: 'Vietnamese Dong',
    MYR: 'Malaysian Ringgit',
    PHP: 'Philippine Peso',
    NZD: 'New Zealand Dollar',
  }
  return names[code] || code
}
