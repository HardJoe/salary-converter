// Cost of Living Index relative to USA = 100
// Sources: Numbeo / Mercer estimates (static data for MVP)
export const costOfLivingIndex: Record<string, number> = {
  US: 100,
  GB: 82,
  DE: 71,
  FR: 74,
  JP: 72,
  CA: 80,
  AU: 83,
  NL: 74,
  CH: 122,
  SG: 86,
  ID: 32,
  IN: 28,
  CN: 44,
  BR: 41,
  MX: 38,
  KR: 68,
  SE: 82,
  NO: 96,
  DK: 89,
  PL: 44,
  ES: 62,
  IT: 67,
  PT: 56,
  ZA: 36,
  AE: 72,
  TH: 41,
  VN: 30,
  MY: 42,
  PH: 34,
  NZ: 80,
}

export function getColIndex(countryCode: string): number {
  return costOfLivingIndex[countryCode] ?? 100
}
