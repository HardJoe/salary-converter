import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SalaryForm } from '../components/SalaryForm'
import { CurrencyRotator } from '../components/CurrencyRotator'
import { countries, findCountry } from '../lib/countries'
import { getColIndex } from '../lib/costOfLiving'
import { convertCurrency, adjustForCostOfLiving, calcPercentageDiff, compareOfferedSalary } from '../lib/convert'
import type { ConversionResult, Frequency } from '../types'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    salary: typeof search['salary'] === 'string' ? search['salary'] : undefined,
    from: typeof search['from'] === 'string' ? search['from'] : undefined,
    to: typeof search['to'] === 'string' ? search['to'] : undefined,
  }),
  component: HomePage,
})

function HomePage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/' })

  const defaultFrom =
    (search.from ? findCountry(search.from) : undefined) ??
    countries.find((c) => c.code === 'US') ??
    countries[0]!
  const defaultTo =
    (search.to ? findCountry(search.to) : undefined) ??
    countries.find((c) => c.code === 'DE') ??
    countries[2]!
  const defaultSalary = search.salary ? Number(search.salary) : 85000

  const [salary, setSalary] = useState(defaultSalary)
  const [frequency, setFrequency] = useState<Frequency>('yearly')
  const [fromCountry, setFromCountry] = useState(defaultFrom)
  const [toCountry, setToCountry] = useState(defaultTo)
  const [offeredSalary, setOfferedSalary] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSwap() {
    setFromCountry(toCountry)
    setToCountry(fromCountry)
    setResult(null)
  }

  async function handleCompare() {
    setLoading(true)
    setResult(null)

    await new Promise((r) => setTimeout(r, 600))

    const annualSalary = frequency === 'monthly' ? salary * 12 : salary
    const convertedSalary = convertCurrency(annualSalary, fromCountry.currency, toCountry.currency)
    const fromIndex = getColIndex(fromCountry.code)
    const toIndex = getColIndex(toCountry.code)
    const adjustedSalary = adjustForCostOfLiving(convertedSalary, fromIndex, toIndex)
    const percentageDiff = calcPercentageDiff(adjustedSalary, convertedSalary)

    const offeredVsEquivalentDiff = offeredSalary > 0 ? compareOfferedSalary(offeredSalary, adjustedSalary) : undefined

    setResult({
      annualSalary,
      convertedSalary,
      adjustedSalary,
      percentageDiff,
      fromCurrency: fromCountry.currency,
      toCurrency: toCountry.currency,
      fromSymbol: fromCountry.symbol,
      toSymbol: toCountry.symbol,
      offeredSalary: offeredSalary > 0 ? offeredSalary : undefined,
      offeredVsEquivalentDiff,
    })

    navigate({
      search: {
        salary: String(salary),
        from: fromCountry.code,
        to: toCountry.code,
      },
    })

    setLoading(false)
  }

  return (
    <main className="flex-grow pt-16 hero-gradient flex items-center justify-center">
      <section className="max-w-container-max mx-auto px-gutter w-full py-xl flex flex-col items-center">
        <div className="text-center mb-xl max-w-2xl">
          <h1 className="font-medium text-h1 text-on-surface mb-md whitespace-nowrap relative left-4">
            Know your worth in <CurrencyRotator />
          </h1>
          <p className="font-inter text-body-sm text-secondary">
            Compare purchasing power between 150+ countries with our high-fidelity
            relocation calculator.
          </p>
        </div>

        <SalaryForm
          salary={salary}
          frequency={frequency}
          fromCountry={fromCountry}
          toCountry={toCountry}
          loading={loading}
          offeredSalary={offeredSalary}
          result={result}
          onSalaryChange={setSalary}
          onFrequencyChange={setFrequency}
          onFromCountryChange={(c) => { setFromCountry(c); setResult(null) }}
          onToCountryChange={(c) => { setToCountry(c); setResult(null) }}
          onOfferedSalaryChange={setOfferedSalary}
          onSwap={handleSwap}
          onCompare={handleCompare}
        />
      </section>
    </main>
  )
}
