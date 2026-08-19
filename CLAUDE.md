# Project Context

## Design System
This project uses a design system defined in `design.md` at the project root.
Always refer to this file when generating or modifying any UI component.

- Use only colors, fonts, and spacing values defined in design.md.
- Do not invent new values or use defaults from any framework.
- Match component states (hover, focus, active, disabled) to the patterns in design.md.
- Follow the typographic scale and weight assignments in design.md.

## Stack
- Framework: Tanstack Start latest version
- Styling: Tailwind CSS with custom config
- Components: Custom components, no UI library

## SalaryForm Component Updates

### Layout Redesign
The `app/components/SalaryForm.tsx` component has been redesigned to match a cleaner, display-focused UI:

**Key Changes:**
1. **Frequency Toggle moved to top** - Positioned at the top of the form with rounded-full styling (pill buttons)
2. **Salary Display Layout** - Changed from input-focused to display-focused with:
   - Large currency symbols in primary color (text-3xl md:text-4xl)
   - Large salary numbers in regular text (text-2xl md:text-3xl)
   - Country dropdowns positioned to the right on desktop
   - Responsive grid layout (1 column on mobile, 1fr_auto on desktop)
3. **Hidden Salary Input** - Original input field kept but hidden for functionality while maintaining the display-focused design
4. **Info Box** - Added informational box with icon showing purchase power equivalence
5. **Responsive Design** - Uses Tailwind's `md:` breakpoint for desktop layout adjustments

**Component Structure:**
- Frequency Toggle (top)
- Current Salary Section (display + country dropdown)
- Hidden Input (for data management)
- Equivalent Salary Section (display + country dropdown)
- Info Box (purchase power explanation)
- CTA Button (Compare Salary)

**Typography:**
- Labels: `text-label-sm uppercase tracking-wide` (uppercase with tracking)
- Currency Symbols: `text-3xl md:text-4xl font-bold text-primary`
- Salary Amounts: `text-2xl md:text-3xl font-semibold text-on-surface`
- Info Text: `text-body-sm` with semibold accents

**Spacing:**
- Uses `space-y-lg` for vertical spacing between major sections
- Grid gap: `gap-md`
- Flex gaps: `gap-xs` between symbol and amount

**No Type Errors:**
- All props properly typed with existing `SalaryFormProps` interface
- All callbacks use correct prop types (Frequency, Country, number)
- Component returns valid JSX with no unresolved references

## Development & Testing Guidelines
- **Do not start a new dev server** - The app should be tested via manual browser interaction or by the user
- **Do not use Playwright for testing** - Avoid browser automation testing tools
