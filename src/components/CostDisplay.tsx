import { formatEuro } from '../domain/cost';
import { moneyLocale } from '../i18n';
import type { AppLocale } from '../timer/types';

interface CostDisplayProps {
  locale: AppLocale;
  label: string;
  displayedCostEuro: number;
  ratePerMinute?: number;
  rateLabel?: string;
  large?: boolean;
}

export function CostDisplay({
  locale,
  label,
  displayedCostEuro,
  ratePerMinute,
  rateLabel,
  large = false,
}: CostDisplayProps) {
  const formatted = formatEuro(displayedCostEuro, moneyLocale(locale));

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-orange-300/80">{label}</span>
      <p
        data-testid="cost-display"
        className={`font-mono font-semibold tabular-nums tracking-tight text-orange-400 ${
          large ? 'text-4xl sm:text-5xl' : 'text-2xl'
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatted}
      </p>
      {ratePerMinute !== undefined && ratePerMinute > 0 && rateLabel && (
        <span className="text-xs text-slate-500">{rateLabel}</span>
      )}
    </div>
  );
}
