// Cost of Living Index relative to USA = 100
// Sources: MyLifeElsewhere.com 2025 data - current global cost of living indices
export const costOfLivingIndex: Record<string, number> = {
  US: 100,
  GB: 89,
  DE: 82,
  FR: 81,
  JP: 56,
  CA: 81,
  AU: 83,
  NL: 98,
  CH: 142,
  SG: 177,
  ID: 37,
  IN: 21,
  CN: 39,
  BR: 39,
  MX: 54,
  KR: 63,
  SE: 78,
  NO: 92,
  DK: 97,
  PL: 62,
  ES: 74,
  IT: 76,
  PT: 72,
  ZA: 44,
  AE: 84,
  TH: 50,
  VN: 42,
  MY: 49,
  PH: 40,
  NZ: 73,
}

export function getColIndex(countryCode: string): number {
  return costOfLivingIndex[countryCode] ?? 100
}
