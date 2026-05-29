export interface Country {
  name: string
  code: string
  currency: string
  symbol: string
  flag: string
}

export type Frequency = 'monthly' | 'yearly'

export interface ConversionResult {
  annualSalary: number
  convertedSalary: number
  adjustedSalary: number
  percentageDiff: number
  fromCurrency: string
  toCurrency: string
  fromSymbol: string
  toSymbol: string
}
