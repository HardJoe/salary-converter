# SalaryForm Input Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add input validation, real-time character filtering, dynamic width adjustment, automatic salary conversion on frequency switches, and improved form logic to the SalaryForm component.

**Architecture:** Create a reusable utility module (`lib/salaryInput.ts`) with four pure functions for validation, width calculation, and salary conversion. Update SalaryForm to import and use these utilities in onChange, onKeyDown, and frequency toggle handlers. No new state needed—all logic is stateless per keystroke.

**Tech Stack:** React, TypeScript, Tailwind CSS, existing design system

---

## File Structure

**New files:**
- `app/lib/salaryInput.ts` — Four utility functions: `getCurrencyDecimalPlaces`, `calculateInputWidth`, `validateAndFilterInput`, `convertSalaryByFrequency`

**Modified files:**
- `app/components/SalaryForm.tsx` — Import utilities, update input onChange/onKeyDown, update frequency toggle onClick, update Compare button disabled state

---

## Tasks

### Task 1: Create Utility Module - Currency Decimal Lookup

**Files:**
- Create: `app/lib/salaryInput.ts` (start)

- [ ] **Step 1: Create the file with currency decimal places lookup**

Create `app/lib/salaryInput.ts` with the first utility function:

```typescript
// Currency codes that use no decimal places
const NO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW', 'IDR', 'CNY', 'VND'])

/**
 * Returns the number of decimal places used by a currency.
 * @param currency - ISO currency code (e.g., 'USD', 'JPY')
 * @returns 2 for standard currencies, 0 for non-decimal currencies, defaults to 2 for unknowns
 */
export function getCurrencyDecimalPlaces(currency: string): number {
  return NO_DECIMAL_CURRENCIES.has(currency) ? 0 : 2
}
```

- [ ] **Step 2: Run the file syntax check**

Run: `npm run type-check` or verify TypeScript has no errors in the IDE

Expected: No errors for the new file

- [ ] **Step 3: Commit**

```bash
cd "s:\Coding\Projects\salary-converter"
git add app/lib/salaryInput.ts
git commit -m "feat: add getCurrencyDecimalPlaces utility function

- Identifies currencies with no decimal places (JPY, KRW, IDR, CNY, VND)
- Defaults to 2 decimals for standard currencies

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Create Utility Module - Input Width Calculation

**Files:**
- Modify: `app/lib/salaryInput.ts`

- [ ] **Step 1: Add input width calculation function**

Add this function to `app/lib/salaryInput.ts` after `getCurrencyDecimalPlaces`:

```typescript
/**
 * Calculates dynamic input width based on currency symbol length.
 * Shrinks input field to maintain consistent spacing regardless of symbol width.
 * @param symbolLength - Length of the currency symbol (1-3 characters)
 * @returns CSS width calculation string (e.g., "calc(100% - 3rem)")
 */
export function calculateInputWidth(symbolLength: number): string {
  // Symbol space: 1rem per character (approx 16px per char in Inter font)
  // Left padding (before symbol): 1rem (md spacing)
  // Right padding: 1rem (pr-md)
  // Total space needed: left-padding + (symbol-length × 1rem) + right-padding
  const totalSpace = 1 + symbolLength + 1 // left + symbol-chars + right
  return `calc(100% - ${totalSpace}rem)`
}
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/lib/salaryInput.ts
git commit -m "feat: add calculateInputWidth utility function

- Adjusts salary input width based on currency symbol length (1-3 chars)
- Maintains consistent spacing between symbol and input field
- Returns CSS calc() string for dynamic width

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Create Utility Module - Input Validation and Filtering

**Files:**
- Modify: `app/lib/salaryInput.ts`

- [ ] **Step 1: Add input validation function**

Add this function to `app/lib/salaryInput.ts` after `calculateInputWidth`:

```typescript
/**
 * Filters and validates salary input in real-time.
 * - Only allows: digits (0-9), comma, period
 * - Enforces one decimal separator: if comma is present, period is filtered (and vice versa)
 * @param input - The raw input string
 * @param previousValue - The previous valid value (used to detect which separator was already used)
 * @returns Cleaned valid input string
 */
export function validateAndFilterInput(input: string, previousValue: string = ''): string {
  // Step 1: Strip any character that's not a digit, comma, or period
  let filtered = input.replace(/[^0-9,.]/g, '')

  // Step 2: Determine which decimal separator (if any) is already in the previous value
  const prevHasComma = previousValue.includes(',')
  const prevHasPeriod = previousValue.includes('.')
  const prevSeparator = prevHasComma ? ',' : prevHasPeriod ? '.' : null

  // Step 3: Determine which separator is in the current filtered input
  const currHasComma = filtered.includes(',')
  const currHasPeriod = filtered.includes('.')

  // Step 4: If the user has already used one separator, remove the other one
  if (prevSeparator === ',') {
    // Comma already used, remove all periods
    filtered = filtered.replace(/\./g, '')
  } else if (prevSeparator === '.') {
    // Period already used, remove all commas
    filtered = filtered.replace(/,/g, '')
  } else {
    // No previous separator, but if user just typed both, keep the first one and remove the second
    if (currHasComma && currHasPeriod) {
      const commaIndex = filtered.indexOf(',')
      const periodIndex = filtered.indexOf('.')
      if (commaIndex < periodIndex) {
        // Comma came first, remove periods
        filtered = filtered.replace(/\./g, '')
      } else {
        // Period came first, remove commas
        filtered = filtered.replace(/,/g, '')
      }
    }
  }

  return filtered
}
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/lib/salaryInput.ts
git commit -m "feat: add validateAndFilterInput utility function

- Filters input to only allow digits, comma, and period
- Enforces one decimal separator rule (comma or period, not both)
- Detects previously used separator and removes the opposite one

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create Utility Module - Salary Conversion

**Files:**
- Modify: `app/lib/salaryInput.ts`

- [ ] **Step 1: Add salary conversion function**

Add this import at the top of `app/lib/salaryInput.ts`:

```typescript
import type { Frequency } from '../types'
```

Then add this function after `validateAndFilterInput`:

```typescript
/**
 * Converts salary between yearly and monthly frequencies.
 * - Yearly to Monthly: divide by 12
 * - Monthly to Yearly: multiply by 12
 * Rounding is applied based on currency decimal places.
 * @param salary - The salary amount to convert
 * @param fromFrequency - Current frequency ('yearly' or 'monthly')
 * @param toFrequency - Target frequency ('yearly' or 'monthly')
 * @param currency - ISO currency code (e.g., 'USD', 'JPY')
 * @returns Converted salary amount, rounded appropriately
 */
export function convertSalaryByFrequency(
  salary: number,
  fromFrequency: Frequency,
  toFrequency: Frequency,
  currency: string
): number {
  // If frequencies are the same, return salary as-is
  if (fromFrequency === toFrequency) {
    return salary
  }

  // Perform the conversion
  const converted = fromFrequency === 'yearly' ? salary / 12 : salary * 12

  // Get decimal places for this currency
  const decimals = getCurrencyDecimalPlaces(currency)

  // Round to the appropriate decimal places
  if (decimals === 0) {
    return Math.round(converted)
  } else {
    // For 2 decimals: multiply by 100, round, divide by 100
    return Math.round(converted * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
}
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/lib/salaryInput.ts
git commit -m "feat: add convertSalaryByFrequency utility function

- Converts salary between yearly and monthly (divide/multiply by 12)
- Applies currency-specific rounding (2 decimals for standard, 0 for JPY/KRW/etc)
- Used when user switches frequency toggle

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Update SalaryForm - Import Utilities

**Files:**
- Modify: `app/components/SalaryForm.tsx`

- [ ] **Step 1: Add imports to SalaryForm**

At the top of `app/components/SalaryForm.tsx`, add this import after the existing imports (after the `countries` import):

```typescript
import {
  calculateInputWidth,
  validateAndFilterInput,
  convertSalaryByFrequency,
} from '../lib/salaryInput'
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/components/SalaryForm.tsx
git commit -m "feat: import salary input utility functions into SalaryForm

- Import calculateInputWidth, validateAndFilterInput, convertSalaryByFrequency
- Prepares component to use utilities in event handlers

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Update Salary Input - Character Filtering

**Files:**
- Modify: `app/components/SalaryForm.tsx:83-90` (the salary input element)

- [ ] **Step 1: Update the salary input onChange handler**

Find the salary input element (around line 83-90 in the file):

```typescript
<input
  type="number"
  autoFocus
  value={salary || ''}
  onChange={(e) => onSalaryChange(Number(e.target.value))}
  placeholder="0.00"
  className="w-full h-12 pl-10 pr-md bg-white border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all outline-none font-inter text-body-md font-semibold text-on-surface"
/>
```

Replace the `onChange` handler:

```typescript
<input
  type="text"
  autoFocus
  value={salary || ''}
  onChange={(e) => {
    const filtered = validateAndFilterInput(e.target.value, (salary || '').toString())
    const numValue = filtered === '' ? 0 : parseFloat(filtered.replace(',', '.'))
    onSalaryChange(numValue)
  }}
  placeholder="0.00"
  className="w-full h-12 pr-md bg-white border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all outline-none font-inter text-body-md font-semibold text-on-surface"
  style={{ paddingLeft: '1rem', width: calculateInputWidth(fromCountry.symbol.length) }}
  inputMode="decimal"
/>
```

**Key changes:**
- Change `type="number"` to `type="text"` (to allow comma display)
- Add `onChange` with `validateAndFilterInput()` call
- Add `style` with dynamic width from `calculateInputWidth()`
- Add `inputMode="decimal"` for mobile keyboard
- Remove `pl-10` class (add padding via inline style instead)

- [ ] **Step 2: Run type check**

Run: `npm run type-check`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/components/SalaryForm.tsx
git commit -m "feat: add real-time input filtering and dynamic width to salary input

- Filter input to only allow digits, comma, period via validateAndFilterInput
- Apply dynamic width based on currency symbol length
- Change input type from number to text for comma/period support
- Add inputMode decimal for mobile UX

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Update Salary Input - Enter Key Handler

**Files:**
- Modify: `app/components/SalaryForm.tsx:83-110` (the salary input and surrounding structure)

- [ ] **Step 1: Add onKeyDown handler to salary input**

Find the salary input element you modified in Task 6 and add an `onKeyDown` handler:

```typescript
<input
  type="text"
  autoFocus
  value={salary || ''}
  onChange={(e) => {
    const filtered = validateAndFilterInput(e.target.value, (salary || '').toString())
    const numValue = filtered === '' ? 0 : parseFloat(filtered.replace(',', '.'))
    onSalaryChange(numValue)
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onCompare()
    }
  }}
  placeholder="0.00"
  className="w-full h-12 pr-md bg-white border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all outline-none font-inter text-body-md font-semibold text-on-surface"
  style={{ paddingLeft: '1rem', width: calculateInputWidth(fromCountry.symbol.length) }}
  inputMode="decimal"
/>
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/components/SalaryForm.tsx
git commit -m "feat: trigger Compare button on Enter key in salary input

- Pressing Enter in salary input calls onCompare() callback
- Prevents default form submission behavior
- Enables keyboard-only workflow

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Update Frequency Toggle - Auto-Conversion

**Files:**
- Modify: `app/components/SalaryForm.tsx:98-120` (the frequency toggle buttons)

- [ ] **Step 1: Update yearly button onClick**

Find the yearly frequency button (around line 98-107):

```typescript
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
```

Replace the `onClick` handler:

```typescript
<button
  type="button"
  onClick={() => {
    if (frequency !== 'yearly') {
      const converted = convertSalaryByFrequency(salary, frequency, 'yearly', fromCountry.currency)
      onSalaryChange(converted)
      onFrequencyChange('yearly')
    }
  }}
  className={`px-lg rounded-md font-inter text-label-md transition-all ${
    frequency === 'yearly'
      ? 'bg-primary text-on-primary shadow-sm'
      : 'text-secondary hover:text-on-surface'
  }`}
>
  Yearly
</button>
```

- [ ] **Step 2: Update monthly button onClick**

Find the monthly frequency button (around line 109-118):

```typescript
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
```

Replace the `onClick` handler:

```typescript
<button
  type="button"
  onClick={() => {
    if (frequency !== 'monthly') {
      const converted = convertSalaryByFrequency(salary, frequency, 'monthly', fromCountry.currency)
      onSalaryChange(converted)
      onFrequencyChange('monthly')
    }
  }}
  className={`px-lg rounded-md font-inter text-label-md transition-all ${
    frequency === 'monthly'
      ? 'bg-primary text-on-primary shadow-sm'
      : 'text-secondary hover:text-on-surface'
  }`}
>
  Monthly
</button>
```

- [ ] **Step 3: Run type check**

Run: `npm run type-check`

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add app/components/SalaryForm.tsx
git commit -m "feat: auto-convert salary when switching frequency

- Yearly to Monthly: divide by 12 with proper rounding
- Monthly to Yearly: multiply by 12 with proper rounding
- Uses currency-specific decimal precision (2 decimals or 0)
- Conversion happens before frequency state updates

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Update Compare Button - Same Country Disable

**Files:**
- Modify: `app/components/SalaryForm.tsx:126-145` (the Compare button)

- [ ] **Step 1: Update Compare button disabled state**

Find the Compare button (around line 126-145):

```typescript
<button
  type="button"
  onClick={onCompare}
  disabled={loading || !salary}
  className="w-full py-md bg-primary hover:bg-primary-container disabled:opacity-60 disabled:cursor-not-allowed text-on-primary font-inter font-semibold text-label-md rounded-lg shadow-primary-glow transition-all flex items-center justify-center gap-sm active:scale-[0.98]"
>
```

Update the `disabled` prop:

```typescript
<button
  type="button"
  onClick={onCompare}
  disabled={loading || !salary || fromCountry.code === toCountry.code}
  className="w-full py-md bg-primary hover:bg-primary-container disabled:opacity-60 disabled:cursor-not-allowed text-on-primary font-inter font-semibold text-label-md rounded-lg shadow-primary-glow transition-all flex items-center justify-center gap-sm active:scale-[0.98]"
>
```

**Key change:**
- Add `|| fromCountry.code === toCountry.code` to the disabled condition

- [ ] **Step 2: Run type check**

Run: `npm run type-check`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/components/SalaryForm.tsx
git commit -m "feat: disable Compare button when source and target countries are same

- Check if fromCountry.code === toCountry.code
- Button shows disabled styling (reduced opacity, no-cursor)
- User cannot trigger comparison when countries match

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Run Full Type Check and Manual Test

**Files:**
- No files modified (verification only)

- [ ] **Step 1: Run full TypeScript type check**

Run: `npm run type-check`

Expected: No errors or warnings related to SalaryForm or salaryInput

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`

Expected: Dev server starts successfully, no build errors

- [ ] **Step 3: Test in browser - Character filtering**

Open http://localhost:5173 in your browser

- Click salary input
- Type: `50000.5,2` 
- Expected: Input shows `50000.52` (period allowed, comma filtered)
- Type: `50000,5.2`
- Expected: Input shows `50000,52` (comma allowed, period filtered)
- Type: `50@000!` 
- Expected: Input shows `50000` (special chars filtered)

- [ ] **Step 4: Test in browser - Enter key submission**

In the salary input field:
- Enter a salary value
- Press Enter key
- Expected: API call is made (check network tab), comparison result loads

- [ ] **Step 5: Test in browser - Frequency conversion**

- Enter salary: `12000` (yearly)
- Click "Monthly" button
- Expected: Salary updates to `1000.00` (12000 ÷ 12)
- Click "Yearly" button
- Expected: Salary updates to `12000` (1000 × 12, rounding back)

- [ ] **Step 6: Test in browser - JPY conversion (no decimals)**

- Select Japan as "Current Country"
- Enter salary: `1200000` (yearly)
- Click "Monthly" button
- Expected: Salary updates to `100000` (1200000 ÷ 12, rounded to integer)
- No decimal point shown in input

- [ ] **Step 7: Test in browser - Dynamic input width**

- Select different countries and observe salary input width
- Switzerland (CHF, 3 chars) should have narrower input than US ($, 1 char)
- Gap between symbol and input should remain consistent

- [ ] **Step 8: Test in browser - Same country disable**

- Select "United States" for both "Current Country" and "Target Country"
- Expected: Compare button is disabled (grayed out, not clickable)
- Select "United Kingdom" for "Target Country"
- Expected: Compare button becomes enabled again

- [ ] **Step 9: Review component in IDE**

Open `app/components/SalaryForm.tsx` in your editor and verify:
- No syntax errors highlighted
- All imports are present
- onChange, onKeyDown, onClick handlers are correct
- disabled condition includes the same-country check

- [ ] **Step 10: Commit final verification**

```bash
cd "s:\Coding\Projects\salary-converter"
git status
```

Expected: Clean working tree, all changes committed

---

## Self-Review Checklist

**Spec Coverage:**
- ✅ Dynamic input width based on symbol length (Task 2, 6)
- ✅ Character filtering to only allow numbers, comma, period (Task 3, 6)
- ✅ Decimal separator enforcement (comma OR period, not both) (Task 3)
- ✅ Currency decimal precision detection (Task 1)
- ✅ Salary conversion on frequency switch (Task 4, 8)
- ✅ Disable Compare when countries match (Task 9)
- ✅ Enter key triggers Compare (Task 7)

**Placeholder Check:** No TBDs, all code is complete and exact

**Type Consistency:**
- `getCurrencyDecimalPlaces(currency: string): number` ✅
- `calculateInputWidth(symbolLength: number): string` ✅
- `validateAndFilterInput(input: string, previousValue: string): string` ✅
- `convertSalaryByFrequency(salary: number, fromFrequency: Frequency, toFrequency: Frequency, currency: string): number` ✅
- All function calls match signatures exactly ✅

**No Scope Issues:** All tasks are focused and produce working, testable changes

---

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-05-30-salary-form-input-enhancements.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task with review checkpoints between tasks. Faster iteration, parallel review.

**2. Inline Execution** — Execute all tasks in this session, batch verification at the end.

Which approach would you like?
