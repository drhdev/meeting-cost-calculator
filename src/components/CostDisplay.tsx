import { formatEuro } from '../domain/cost';
import { moneyLocale } from '../i18n';
import type { AppLocale } from '../timer/types';
import { mccCostLabel, mccCostValue } from '../ui/themeClasses';

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
      <span className={mccCostLabel}>{label}</span>
      <p
        data-testid="cost-display"
        className={`${mccCostValue} ${large ? 'text-6xl sm:text-7xl' : 'text-4xl sm:text-5xl'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatted}
      </p>
      {ratePerMinute !== undefined && ratePerMinute > 0 && rateLabel && (
        <span className="text-xs text-mcc-fg-muted dark:text-mcc-fg-subtle">{rateLabel}</span>
      )}
    </div>
  );
}
