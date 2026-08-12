import { useEffect, useRef, useState } from "react";
import { countries } from "../lib/countries";
import {
  validateAndFilterInput,
  convertSalaryByFrequency,
  formatNumberWithSeparators,
} from "../lib/salaryInput";
import { formatCurrency } from "../lib/convert";
import type { Country, Frequency, ConversionResult } from "../types";

interface SalaryFormProps {
  salary: number;
  frequency: Frequency;
  fromCountry: Country;
  toCountry: Country;
  loading: boolean;
  offeredSalary: number;
  result?: ConversionResult | null;
  onSalaryChange: (v: number) => void;
  onFrequencyChange: (v: Frequency) => void;
  onFromCountryChange: (v: Country) => void;
  onToCountryChange: (v: Country) => void;
  onOfferedSalaryChange: (v: number) => void;
  onSwap: () => void;
  onCompare: () => void;
  salaryInputRef?: React.RefObject<HTMLInputElement>;
}

export function SalaryForm({
  salary,
  frequency,
  fromCountry,
  toCountry,
  loading,
  offeredSalary,
  result,
  onSalaryChange,
  onFrequencyChange,
  onFromCountryChange,
  onToCountryChange,
  onOfferedSalaryChange,
  onSwap,
  onCompare,
}: SalaryFormProps) {
  const formattedSalary =
    salary?.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) || "0";

  return (
    <div className="w-full max-w-2xl bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant rounded-2xl shadow-level-1 p-lg md:p-xl md:py-8 transition-colors duration-200">
      <div className="space-y-lg">
        {/* Frequency Toggle */}
        <div className="flex justify-center items-center">
          <div className="flex bg-surface-container-low dark:bg-surface-container-high p-xs rounded-full">
            <button
              type="button"
              onClick={() => {
                if (frequency !== "yearly") {
                  const converted = convertSalaryByFrequency(
                    salary,
                    frequency,
                    "yearly",
                    fromCountry.currency,
                  );
                  onSalaryChange(converted);
                  onFrequencyChange("yearly");
                }
              }}
              className={`px-lg py-sm rounded-full font-inter text-label-md transition-all ${
                frequency === "yearly"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              Yearly
            </button>
            <button
              type="button"
              onClick={() => {
                if (frequency !== "monthly") {
                  const converted = convertSalaryByFrequency(
                    salary,
                    frequency,
                    "monthly",
                    fromCountry.currency,
                  );
                  onSalaryChange(converted);
                  onFrequencyChange("monthly");
                }
              }}
              className={`px-lg py-xs rounded-full font-inter text-label-md transition-all ${
                frequency === "monthly"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-secondary hover:text-on-surface"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Current Salary Section with Country Dropdown */}
        <div>
          <div className="flex items-center justify-between mb-md">
            <label className="font-inter text-label-sm text-on-surface-variant uppercase tracking-wide">
              Current Salary
            </label>
            <div className="w-56">
              <CountryDropdown
                value={fromCountry}
                options={countries}
                onChange={(c) => {
                  onFromCountryChange(c);
                  onCompare();
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-lg">
            <span className="font-inter text-3xl md:text-4xl font-bold text-primary w-20">
              {fromCountry.currency}
            </span>
            <SalaryInput
              salary={salary}
              onSalaryChange={onSalaryChange}
              onCompare={onCompare}
              symbol={fromCountry.symbol}
            />
          </div>
        </div>

        {/* Equivalent Salary Section with Country Dropdown */}
        <div>
          <div className="flex items-center justify-between mb-md">
            <label className="font-inter text-label-sm text-on-surface-variant uppercase tracking-wide">
              Requires Equivalent of
            </label>
            <div className="w-56">
              <CountryDropdown
                value={toCountry}
                options={countries}
                onChange={(c) => {
                  onToCountryChange(c);
                  onCompare();
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-lg">
            <span className="font-inter text-3xl md:text-4xl font-bold text-primary w-20">
              {toCountry.currency}
            </span>
            {loading && !result ? (
              <Skeleton className="h-7 w-40 rounded" />
            ) : (
              <span className="font-inter text-3xl md:text-4xl font-semibold text-on-surface">
                {result?.adjustedSalary?.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }) || "0"}
              </span>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="flex gap-md bg-surface-container dark:bg-surface-container-high rounded-lg p-md items-start transition-colors duration-200">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-on-primary">
              <span className="font-inter text-label-sm font-semibold">i</span>
            </div>
          </div>
          <p className="font-inter text-body-sm text-on-surface-variant dark:text-on-surface-variant">
            An offer of{" "}
            <span className="font-semibold text-on-surface">
              {fromCountry.currency} {formattedSalary}
            </span>{" "}
            is worth roughly{" "}
            <span className="font-semibold text-on-surface">
              {toCountry.currency}{" "}
              {loading && !result ? (
                <Skeleton className="inline-block h-5 w-12 rounded" />
              ) : (
                result?.adjustedSalary?.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }) || "0"
              )}
            </span>{" "}
            in purchasing power.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Country Dropdown ────────────────────────────────────────────────────────

interface CountryDropdownProps {
  value: Country;
  options: Country[];
  onChange: (c: Country) => void;
}

function CountryDropdown({ value, options, onChange }: CountryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedOptions = [...options].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const filteredOptions = search
    ? sortedOptions.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.currency.toLowerCase().includes(search.toLowerCase()),
      )
    : sortedOptions;

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleSelect(country: Country) {
    onChange(country);
    setIsOpen(false);
    setSearch("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center justify-end gap-2 px-md h-10 bg-surface-container-lowest dark:bg-surface-container border border-outline-variant rounded-lg w-full hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary"
      >
        <div className="flex items-center gap-4">
          <span className="font-inter text-body-sm text-on-surface">
            {value.name}
          </span>
          <span className="font-inter text-label-sm text-secondary">
            {value.currency}
          </span>
        </div>
        <span
          className="material-symbols-outlined text-secondary text-[20px] transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant rounded-lg shadow-level-2 transition-colors duration-200">
          <div className="sticky top-0 bg-surface-container-lowest dark:bg-surface-container border-b border-outline-variant p-md transition-colors duration-200">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-md h-10 bg-surface-container dark:bg-surface-container-high border border-outline-variant rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary font-inter text-body-sm text-on-surface dark:text-on-surface transition-colors duration-200"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country)}
                className={`flex items-center gap-md px-md py-3 w-full text-left hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors ${
                  country.code === value.code
                    ? "bg-surface-container dark:bg-surface-container-high"
                    : ""
                }`}
              >
                <div className="flex-1">
                  <span className="font-inter text-body-sm text-on-surface">
                    {country.name}
                  </span>
                </div>
                <span className="font-inter text-label-sm text-secondary">
                  {country.currency}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Salary Input ───────────────────────────────────────────────────────────

interface SalaryInputProps {
  salary: number;
  onSalaryChange: (v: number) => void;
  onCompare: () => void;
  symbol: string;
}

function SalaryInput({
  salary,
  onSalaryChange,
  onCompare,
  symbol,
}: SalaryInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex-1">
      <input
        ref={inputRef}
        type="text"
        autoFocus
        value={formatNumberWithSeparators(salary || "")}
        onChange={(e) => {
          const digitsOnly = validateAndFilterInput(e.target.value);
          const numValue = digitsOnly === "" ? 0 : parseInt(digitsOnly, 10);
          onSalaryChange(numValue);
          onCompare();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onCompare();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="0"
        inputMode="numeric"
        className={`w-full bg-transparent outline-none ring-0 font-inter text-3xl md:text-4xl text-on-surface dark:text-on-surface font-semibold transition-all duration-200 border-b-2 pb-xs ${
          isFocused
            ? "border-primary border-opacity-100"
            : "border-outline-variant/30 dark:border-outline-variant/50"
        }`}
      />
    </div>
  );
}

// ─── Skeleton Loader ────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  );
}

// ─── Inline Result Display ──────────────────────────────────────────────────

interface InlineResultProps {
  result: ConversionResult;
  fromCountry: Country;
  toCountry: Country;
}

function InlineResult({ result, fromCountry, toCountry }: InlineResultProps) {
  const {
    convertedSalary,
    adjustedSalary,
    percentageDiff,
    toSymbol,
    toCurrency,
    offeredSalary,
    offeredVsEquivalentDiff,
  } = result;

  const isPositive = percentageDiff > 0;
  const absPercent = Math.abs(percentageDiff).toFixed(1);

  const message = isPositive
    ? `You need ${absPercent}% more salary to maintain your lifestyle`
    : percentageDiff < -0.5
      ? `Your money goes ${absPercent}% further in ${toCountry.name}`
      : `Your purchasing power is roughly equal`;

  const isOfferedHigher =
    offeredVsEquivalentDiff !== undefined && offeredVsEquivalentDiff > 0;

  return (
    <div className="mt-lg space-y-md animate-fade-in">
      {/* Cost of Living Difference */}
      <div
        className={`p-md rounded-lg border transition-all duration-300 ${
          isPositive
            ? "bg-red-50 border-red-200"
            : percentageDiff < -0.5
              ? "bg-green-50 border-green-200"
              : "bg-surface-container-low border-outline-variant"
        }`}
      >
        <div className="flex items-baseline gap-xs mb-xs">
          <span
            className={`font-manrope text-2xl md:text-3xl font-semibold font-tnum ${
              isPositive
                ? "text-red-700"
                : percentageDiff < -0.5
                  ? "text-green-700"
                  : "text-on-surface"
            }`}
          >
            {isPositive ? "+" : percentageDiff < -0.5 ? "-" : ""}
            {absPercent}%
          </span>
          <span
            className={`font-inter text-label-xs uppercase tracking-widest px-xs py-0.5 rounded-full ${
              isPositive
                ? "bg-red-100 text-red-700"
                : percentageDiff < -0.5
                  ? "bg-green-100 text-green-700"
                  : "bg-surface-container text-secondary"
            }`}
          >
            {isPositive
              ? "Higher cost"
              : percentageDiff < -0.5
                ? "Lower cost"
                : "Similar cost"}
          </span>
        </div>
        <p className="font-inter text-body-sm text-on-surface-variant">
          {message}
        </p>
      </div>

      {/* Offered Salary Comparison */}
      {offeredSalary && offeredVsEquivalentDiff !== undefined && (
        <div
          className={`p-md rounded-lg border transition-all duration-300 ${
            isOfferedHigher
              ? "bg-green-50 border-green-200"
              : offeredVsEquivalentDiff < -0.5
                ? "bg-red-50 border-red-200"
                : "bg-surface-container-low border-outline-variant"
          }`}
        >
          <div className="flex items-baseline gap-xs mb-xs">
            <span
              className={`font-manrope text-xl md:text-2xl font-semibold font-tnum ${
                isOfferedHigher
                  ? "text-green-700"
                  : offeredVsEquivalentDiff < -0.5
                    ? "text-red-700"
                    : "text-on-surface"
              }`}
            >
              {isOfferedHigher
                ? "+"
                : offeredVsEquivalentDiff < -0.5
                  ? "-"
                  : ""}
              {Math.abs(offeredVsEquivalentDiff).toFixed(1)}%
            </span>
            <span
              className={`font-inter text-label-xs uppercase tracking-widest px-xs py-0.5 rounded-full ${
                isOfferedHigher
                  ? "bg-green-100 text-green-700"
                  : offeredVsEquivalentDiff < -0.5
                    ? "bg-red-100 text-red-700"
                    : "bg-surface-container text-secondary"
              }`}
            >
              {isOfferedHigher
                ? "Better offer"
                : offeredVsEquivalentDiff < -0.5
                  ? "Lower offer"
                  : "Fair offer"}
            </span>
          </div>
          <p className="font-inter text-body-sm text-on-surface-variant">
            Your offer is{" "}
            {isOfferedHigher
              ? "higher than"
              : isOfferedHigher === false && offeredVsEquivalentDiff < -0.5
                ? "lower than"
                : "equal to"}{" "}
            the equivalent salary
          </p>
        </div>
      )}
    </div>
  );
}
