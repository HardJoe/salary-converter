import { useState, useEffect, useMemo, memo } from 'react'
import { countries } from '../lib/countries'

const TRANSITION_DURATION = 500
const INTERVAL_MS = 2000

export const CurrencyRotator = memo(function CurrencyRotator() {
  const uniqueCurrencies = useMemo(() => {
    const seen = new Set<string>()
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
    )
      .filter((c) => {
        if (seen.has(c.name)) return false
        seen.add(c.name)
        return true
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const [currentIdx, setCurrentIdx] = useState(0)
  const [nextIdx, setNextIdx] = useState(1)
  const [phase, setPhase] = useState<'idle' | 'transitioning'>('idle')

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase('transitioning')
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % uniqueCurrencies.length)
        setNextIdx((prev) => (prev + 1) % uniqueCurrencies.length)
        setPhase('idle')
      }, TRANSITION_DURATION)
    }, INTERVAL_MS)

    return () => clearInterval(interval)
  }, [uniqueCurrencies.length])

  const transitioning = phase === 'transitioning'
  const currentName = uniqueCurrencies[currentIdx]?.name ?? ''
  const nextName = uniqueCurrencies[nextIdx]?.name ?? ''

  return (
    <span
      className="text-primary inline-block relative overflow-hidden font-bold"
      style={{
        minWidth: '8rem',
        height: '1.2em',
        verticalAlign: 'bottom',
      }}
    >
      {/* Current: exits upward */}
      <span
        className="absolute left-0 top-0 whitespace-nowrap"
        style={{
          transform: transitioning ? 'translateY(-110%)' : 'translateY(0)',
          transition: transitioning
            ? `transform ${TRANSITION_DURATION}ms ease-in-out`
            : 'none',
        }}
      >
        {currentName}
      </span>

      {/* Next: enters from below */}
      <span
        className="absolute left-0 top-0 whitespace-nowrap"
        style={{
          transform: transitioning ? 'translateY(0)' : 'translateY(110%)',
          transition: transitioning
            ? `transform ${TRANSITION_DURATION}ms ease-in-out`
            : 'none',
        }}
      >
        {nextName}
      </span>
    </span>
  )
})

function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    USD: 'Dollars',
    GBP: 'Pounds',
    EUR: 'Euros',
    JPY: 'Yen',
    CAD: 'Dollars',
    AUD: 'Dollars',
    CHF: 'Francs',
    SGD: 'Dollars',
    IDR: 'Rupiah',
    INR: 'Rupees',
    CNY: 'Yuan',
    BRL: 'Reais',
    MXN: 'Pesos',
    KRW: 'Won',
    SEK: 'Krona',
    NOK: 'Krone',
    DKK: 'Krone',
    PLN: 'Zloty',
    ZAR: 'Rand',
    AED: 'Dirhams',
    THB: 'Baht',
    VND: 'Dong',
    MYR: 'Ringgit',
    PHP: 'Pesos',
    NZD: 'Dollars',
  }
  return names[code] || code
}
