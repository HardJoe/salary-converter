# SalaryForm Input Enhancements - Design Spec

**Date:** 2026-05-30  
**Component:** `app/components/SalaryForm.tsx`  
**Status:** Design approved, ready for implementation

---

## Overview

This spec covers five feature enhancements to the SalaryForm component:
1. Dynamic input width based on currency symbol length
2. Real-time character filtering (numbers, comma, period only)
3. Decimal separator validation (comma OR period, not both)
4. Salary auto-conversion when switching frequency (yearly ↔ monthly)
5. Disable Compare button when source and target countries match
6. Trigger Compare on Enter key in salary input

---

## Requirements

### 1. Dynamic Input Width

**Requirement:** The salary input field width adjusts based on the currency symbol length to maintain consistent spacing between symbol and input field.

**Details:**
- Currency symbol lengths: 1–3 characters ($, €, CHF, MX$, NZ$, A$, R$, etc.)
- Input width shrinks as symbol length increases
- Total visual spacing remains balanced regardless of symbol
- Symbol position: always left-aligned, never changes

**Implementation:** 
- Create `calculateInputWidth(symbolLength: number): string` utility
- Returns CSS width value (e.g., "calc(100% - 2.5rem)")
- Applied to salary input via `style={{ width: ... }}`
- Calculated fresh on each render based on `fromCountry.symbol.length`

**Formula:** 
- Symbol space needed: ~1rem per character (approx 16px per char with current Inter font)
- Left padding (before symbol): 1rem (md spacing from design system)
- Total left-side space: `left-padding + (symbol-length × 1rem)` = `1rem + (symbol-length × 1rem)`
- Input width: `calc(100% - (1rem + (symbol-length × 1rem)) - right-padding)`
- Right padding (pr-md): 1rem
- Final: `calc(100% - ${(symbolLength + 2) * 1}rem)` or simplified table:
  - 1 char ($, €): `calc(100% - 3rem)`
  - 2 chars (A$, kr, R$): `calc(100% - 4rem)`
  - 3 chars (CHF, MX$): `calc(100% - 5rem)`

---

### 2. Character Filtering (Real-Time)

**Requirement:** Salary input only accepts numbers, comma (,), and period (.).

**Details:**
- Other characters are filtered out as user types
- Filtering happens before `onSalaryChange()` is called
- No error message needed; filtering is silent
- Works with pasted content (invalid chars stripped)

**Implementation:**
- Create `validateAndFilterInput(input: string): string` utility
- Called in onChange handler before passing to onSalaryChange
- Returns cleaned string with only valid characters

**Valid Characters:** 0–9, comma, period

---

### 3. Decimal Separator Enforcement

**Requirement:** User can use either comma OR period as decimal separator, but not both in the same input.

**Details:**
- Once user enters comma, period is filtered out for that input value
- Once user enters period, comma is filtered out for that input value
- Applies per-keystroke (no state needed; detected from current value)
- Works with both manual entry and pasted values

**Implementation:**
- Extended `validateAndFilterInput(input: string, previousValue: string): string` utility
- Detects which separator is already in the value
- Strips the opposite separator during filtering
- Returns cleaned value

**Behavior:**
- User types "1,000" → comma allowed, periods blocked going forward
- User types "1.50" → period allowed, commas blocked going forward
- User pastes "1,000.50" → comma detected first, period stripped → "1,00050"

---

### 4. Currency Decimal Precision

**Requirement:** Salary conversions and decimal handling respect currency precision.

**Details:**
- Currencies like USD, GBP, EUR allow 2 decimal places
- Currencies like JPY, KRW, VND use no decimals (integer only)
- Affects: salary conversions, input field behavior, rounding

**Implementation:**
- Create `getCurrencyDecimalPlaces(currency: string): number` utility
- Returns 2 for standard currencies, 0 for non-decimal currencies
- Used by salary conversion and to determine if decimals should be shown in input
- Defaults to 2 for unknown currencies

**Supported Currencies:**
- **2 decimals:** USD, GBP, EUR, CAD, AUD, CHF, SGD, INR, BRL, MXN, SEK, NOK, DKK, PLN, ZAR, AED, THB, MYR, PHP, NZD
- **0 decimals:** JPY, KRW, IDR, CNY, VND

---

### 5. Frequency Conversion with Auto-Adjustment

**Requirement:** Switching between yearly and monthly frequency automatically converts the salary value.

**Details:**
- Yearly → Monthly: divide by 12
- Monthly → Yearly: multiply by 12
- Conversion happens before frequency state updates
- Rounding: 2 decimals if currency allows, nearest integer otherwise
- User sees updated salary input immediately after switch

**Implementation:**
- Create `convertSalaryByFrequency(salary: number, fromFrequency: Frequency, toFrequency: Frequency, currency: string): number` utility
- Called in frequency toggle onClick handlers (before onFrequencyChange)
- Calls `getCurrencyDecimalPlaces()` to determine rounding
- Returns converted salary value
- Call `onSalaryChange(convertedValue)` then `onFrequencyChange(newFrequency)`

**Rounding Rules:**
- **2 decimals:** `Math.round(value * 100) / 100`
- **0 decimals:** `Math.round(value)`

**Example:**
- Input: $50,000 yearly, USD (2 decimals)
- Switch to monthly: $50,000 ÷ 12 = $4,166.67 (rounded to 2 decimals)
- Back to yearly: $4,166.67 × 12 = $50,000.04 (rounding artifact from 12 × $4,166.67, acceptable due to intermediate rounding)
- Note: This is expected behavior in financial calculations; the value is still accurate for salary comparison

---

### 6. Disable Compare Button (Same Country)

**Requirement:** Compare button is disabled when source and target countries are the same.

**Details:**
- Condition: `fromCountry.code === toCountry.code`
- Visual feedback: disabled styling (reduced opacity, cursor not-allowed)
- Complements existing disabled state when salary is empty/loading

**Implementation:**
- Update button disabled condition: `disabled={loading || !salary || fromCountry.code === toCountry.code}`
- No additional state needed; uses existing props

---

### 7. Enter Key Submission

**Requirement:** Pressing Enter while focused on the salary input triggers the Compare button action.

**Details:**
- Only when salary input is focused
- Only valid input (after filtering) triggers submit
- Same behavior as clicking Compare button
- Allows keyboard-only workflow

**Implementation:**
- Add `onKeyDown` handler to salary input
- Check `if (e.key === 'Enter') onCompare()`
- Calls the same callback as Compare button click

---

## Implementation Plan Overview

### New File: `lib/salaryInput.ts`

Four exported utility functions:
1. `getCurrencyDecimalPlaces(currency: string): number`
2. `calculateInputWidth(symbolLength: number): string`
3. `validateAndFilterInput(input: string, previousValue: string): string`
4. `convertSalaryByFrequency(salary: number, fromFrequency: Frequency, toFrequency: Frequency, currency: string): number`

### Modified File: `app/components/SalaryForm.tsx`

Changes to `SalaryForm` function:
1. Import utilities from `lib/salaryInput`
2. Update salary input `onChange`: filter input before calling onSalaryChange
3. Update salary input `onKeyDown`: trigger onCompare on Enter
4. Update salary input `style`: apply dynamic width from calculateInputWidth
5. Update frequency toggle buttons: convert salary before changing frequency
6. Update Compare button: add disabled condition for same country

---

## Data Flow

### Salary Input Change
```
User types → validateAndFilterInput() → onSalaryChange(filtered value) → parent updates → re-render
```

### Frequency Switch
```
User clicks toggle → convertSalaryByFrequency() → onSalaryChange(converted) → onFrequencyChange() → parent updates → re-render
```

### Enter Key
```
User presses Enter → onKeyDown handler → onCompare() (same as button click)
```

### Same Country Check
```
fromCountry.code === toCountry.code → Compare button disabled + opacity reduced
```

---

## Edge Cases & Behavior

| Scenario | Behavior |
|----------|----------|
| User pastes "1,000.50" | Comma detected first, period stripped → "1,00050" |
| JPY input with comma | Comma filtered immediately (0 decimals) |
| Switch $50k yearly to monthly, back to yearly | $50k → $4,166.67 → $50,000.04 (rounding artifact acceptable) |
| Salary empty when pressing Enter | onCompare still called (parent handles disabled state via button logic) |
| User swaps countries to same | Compare button becomes disabled mid-interaction |
| Symbol length changes (on country select) | Input width updates on next render |

---

## Testing Checklist (for implementation verification)

- [ ] Salary input only accepts 0-9, comma, period
- [ ] Once comma entered, period is filtered out
- [ ] Once period entered, comma is filtered out
- [ ] Pasted content is filtered correctly
- [ ] Input width shrinks for longer symbols (CHF, MX$, etc.)
- [ ] Input width matches for single-char symbols ($, €)
- [ ] Yearly → Monthly converts correctly (÷ 12, rounds to 2 decimals for USD/GBP/EUR, to 0 for JPY)
- [ ] Monthly → Yearly converts correctly (× 12, same rounding rules)
- [ ] Enter key in salary input triggers Compare button action
- [ ] Compare button disabled when fromCountry === toCountry
- [ ] Compare button enabled again when countries differ
- [ ] Swap button re-enables Compare button if previously disabled for same country
- [ ] Frequency conversion happens before state update (no visual flicker)

---

## Files Affected

- **New:** `app/lib/salaryInput.ts`
- **Modified:** `app/components/SalaryForm.tsx`

---

## Browser Compatibility

No breaking changes. Uses standard JavaScript:
- `Math.round()` for rounding (universal)
- String methods for filtering (universal)
- CSS `calc()` for width (supported in all modern browsers)
- `onKeyDown` event (universal)
- No new dependencies required

---

## Notes

- All validation is client-side and happens on every keystroke (real-time feedback)
- Utilities are pure functions and easily testable
- No additional state needed in component (validation is stateless per keystroke)
- Currency decimal precision lookup could be extended to include more granular info if needed in future
