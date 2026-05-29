import { useEffect, useRef, useState } from 'react'
import { countries } from '../lib/countries'
import type { Country, Frequency } from '../types'

interface SalaryFormProps {
  salary: number
  frequency: Frequency
  fromCountry: Country
  toCountry: Country
  loading: boolean
  onSalaryChange: (v: number) => void
  onFrequencyChange: (v: Frequency) => void
  onFromCountryChange: (v: Country) => void
  onToCountryChange: (v: Country) => void
  onSwap: () => void
  onCompare: () => void
}

export function SalaryForm({
  salary,
  frequency,
  fromCountry,
  toCountry,
  loading,
  onSalaryChange,
  onFrequencyChange,
  onFromCountryChange,
  onToCountryChange,
  onSwap,
  onCompare,
}: SalaryFormProps) {
  return (
    <div className="w-full max-w-2xl bg-white border border-outline-variant rounded-2xl shadow-level-1 p-lg md:p-xl">
      <div className="grid grid-cols-1 gap-lg">
        {/* Row 1: Country selectors + swap */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-md items-center">
          <div className="w-full">
            <label className="font-inter text-label-md text-on-surface-variant mb-xs block">
              Current Country
            </label>
            <CountryDropdown
              value={fromCountry}
              options={countries}
              onChange={onFromCountryChange}
            />
          </div>

          <div className="flex justify-center md:pt-6">
            <button
              type="button"
              onClick={onSwap}
              title="Swap countries"
              className="bg-surface-container-lowest border border-outline-variant w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-90 shadow-level-1"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">
                swap_horiz
              </span>
            </button>
          </div>

          <div className="w-full">
            <label className="font-inter text-label-md text-on-surface-variant mb-xs block">
              Target Country
            </label>
            <CountryDropdown
              value={toCountry}
              options={countries}
              onChange={onToCountryChange}
            />
          </div>
        </div>

        {/* Row 2: Salary input + frequency toggle */}
        <div className="flex flex-col md:flex-row gap-lg items-end">
          <div className="flex-grow w-full">
            <label className="font-inter text-label-md text-on-surface-variant mb-xs block">
              Current Salary
            </label>
            <div className="relative">
              <span className="absolute left-md top-1/2 -translate-y-1/2 text-secondary font-medium font-inter select-none">
                {fromCountry.symbol}
              </span>
              <input
                type="number"
                autoFocus
                value={salary || ''}
                onChange={(e) => onSalaryChange(Number(e.target.value))}
                placeholder="0.00"
                className="w-full h-12 pl-10 pr-md bg-white border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all outline-none font-inter text-body-md font-semibold text-on-surface"
              />
            </div>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <label className="font-inter text-label-md text-on-surface-variant mb-xs block">
              Frequency
            </label>
            <div className="flex bg-surface-container-low p-xs rounded-lg border border-outline-variant h-12">
              <button
                type="button"
                onClick={() => onFrequencyChange('yearly')}
                className={`px-lg rounded-md font-inter text-label-md transition-all ${
                  frequency === 'yearly'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Yearly
              </button>
              <button
                type="button"
                onClick={() => onFrequencyChange('monthly')}
                className={`px-lg rounded-md font-inter text-label-md transition-all ${
                  frequency === 'monthly'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-md">
          <button
            type="button"
            onClick={onCompare}
            disabled={loading || !salary}
            className="w-full py-md bg-primary hover:bg-primary-container disabled:opacity-60 disabled:cursor-not-allowed text-on-primary font-inter font-semibold text-label-md rounded-lg shadow-primary-glow transition-all flex items-center justify-center gap-sm active:scale-[0.98]"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Calculating…
              </>
            ) : (
              <>
                Compare Salary
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 600" }}>
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Country Dropdown ────────────────────────────────────────────────────────

interface CountryDropdownProps {
  value: Country
  options: Country[]
  onChange: (c: Country) => void
}

function CountryDropdown({ value, options, onChange }: CountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sortedOptions = [...options].sort((a, b) => a.name.localeCompare(b.name))
  const filteredOptions = search
    ? sortedOptions.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.currency.toLowerCase().includes(search.toLowerCase())
      )
    : sortedOptions

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  function handleSelect(country: Country) {
    onChange(country)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center justify-between px-md h-12 bg-white border border-outline-variant rounded-lg w-full hover:bg-slate-50 transition-colors focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary"
      >
        <span className="font-inter text-body-md text-on-surface">{value.name}</span>
        <span
          className="material-symbols-outlined text-secondary text-[20px] transition-transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-outline-variant rounded-lg shadow-level-2">
          <div className="sticky top-0 bg-white border-b border-outline-variant p-md">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-md h-10 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary font-inter text-body-sm"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country)}
                className={`flex items-center gap-md px-md py-3 w-full text-left hover:bg-surface-container-low transition-colors ${
                  country.code === value.code ? 'bg-surface-container-low' : ''
                }`}
              >
                <div className="flex-1">
                  <span className="font-inter text-body-sm text-on-surface">{country.name}</span>
                </div>
                <span className="font-inter text-label-sm text-secondary">{country.currency}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Loading Spinner ─────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
