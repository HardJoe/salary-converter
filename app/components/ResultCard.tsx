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
        <div className="flex items-center gap-sm mb-lg">
          <span className="material-symbols-outlined text-primary text-[20px]">
            calculate
          </span>
          <h2 className="font-manrope text-h3 text-on-surface">
            Salary Comparison
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
          {/* Converted salary */}
          <div className="bg-surface-container-low rounded-xl p-lg">
            <p className="font-inter text-label-sm text-on-surface-variant uppercase tracking-widest mb-sm">
              Converted Salary
            </p>
            <p className="font-manrope text-h2 text-on-surface font-tnum">
              {formatCurrency(convertedSalary, toSymbol, toCurrency)}
            </p>
            <p className="font-inter text-body-sm text-secondary mt-xs">
              Direct currency conversion
            </p>
          </div>

          {/* Adjusted salary */}
          <div className="bg-surface-container-low rounded-xl p-lg">
            <p className="font-inter text-label-sm text-on-surface-variant uppercase tracking-widest mb-sm">
              Purchasing Power Equivalent
            </p>
            <p className="font-manrope text-h2 text-on-surface font-tnum">
              {formatCurrency(adjustedSalary, toSymbol, toCurrency)}
            </p>
            <p className="font-inter text-body-sm text-secondary mt-xs">
              Adjusted for cost of living
            </p>
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
