import { formatCurrency } from "../lib/convert";
import type { ConversionResult, Country } from "../types";

interface ResultCardProps {
  result: ConversionResult;
  fromCountry: Country;
  toCountry: Country;
}

export function ResultCard({
  result,
  fromCountry,
  toCountry,
}: ResultCardProps) {
  const {
    convertedSalary,
    adjustedSalary,
    percentageDiff,
    toSymbol,
    toCurrency,
  } = result;

  const isPositive = percentageDiff > 0;
  const absPercent = Math.abs(percentageDiff).toFixed(1);

  const message = isPositive
    ? `You need ${absPercent}% more salary to maintain your lifestyle in ${toCountry.name}`
    : percentageDiff < -0.5
      ? `Your money goes ${absPercent}% further in ${toCountry.name}`
      : `Your purchasing power is roughly equal in ${toCountry.name}`;

  return (
    <div className="w-full max-w-2xl mt-lg animate-fade-in">
      <div className="bg-white border border-outline-variant rounded-2xl shadow-level-1 p-lg md:p-xl">
        <div className="flex flex-col items-center gap-xl mb-lg">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-lg">
            <div className="text-center md:text-left">
              <div className="font-inter text-label-sm text-secondary uppercase tracking-wider mb-xs">
                Current ({fromCountry.name})
              </div>
              <div className="font-manrope text-h1 text-on-surface font-tnum">
                {formatCurrency(
                  result.annualSalary,
                  result.fromSymbol,
                  result.fromCurrency,
                )}
              </div>
              <div className="font-inter text-body-sm text-secondary mt-xs">
                Gross Annual
              </div>
            </div>
            <div className="flex items-center justify-center p-md bg-surface-container rounded-full">
              <span className="material-symbols-outlined text-primary text-3xl">
                trending_flat
              </span>
            </div>
            <div className="text-center md:text-right">
              <div className="font-inter text-label-sm text-primary uppercase tracking-wider mb-xs">
                {toCountry.name} Equivalent
              </div>
              <div className="font-manrope text-h1 text-primary font-tnum">
                {formatCurrency(adjustedSalary, toSymbol, toCurrency)}
              </div>
              <div className="font-inter text-body-sm text-secondary mt-xs">
                Gross Annual
              </div>
            </div>
          </div>
        </div>

        {/* Percentage diff banner */}
        <div
          className={`flex items-center gap-md p-lg rounded-xl border ${
            isPositive
              ? "bg-red-50 border-red-200"
              : percentageDiff < -0.5
                ? "bg-green-50 border-green-200"
                : "bg-surface-container-low border-outline-variant"
          }`}
        >
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              isPositive
                ? "bg-red-100"
                : percentageDiff < -0.5
                  ? "bg-green-100"
                  : "bg-surface-container"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isPositive
                  ? "text-red-600"
                  : percentageDiff < -0.5
                    ? "text-green-600"
                    : "text-secondary"
              }`}
            >
              {isPositive
                ? "trending_up"
                : percentageDiff < -0.5
                  ? "trending_down"
                  : "remove"}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-sm flex-wrap">
              <span
                className={`font-manrope text-h3 font-tnum ${
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
                className={`font-inter text-label-sm uppercase tracking-widest px-sm py-xs rounded-full ${
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
            <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
              {message}
            </p>
          </div>
        </div>

        <p className="mt-lg font-inter text-label-sm text-on-surface-variant text-center">
          Based on static exchange rates and cost-of-living index. For
          informational purposes only.
        </p>
      </div>
    </div>
  );
}
