import { useI18n } from '../hooks/useI18n';
import type { MessageKey } from '../i18n';
import type { AppLocale } from '../timer/types';

const MAX_COUNT = 50;

interface ParticipantStepperProps {
  locale: AppLocale;
  labelKey?: MessageKey;
  label?: string;
  value: number;
  onChange: (value: number) => void;
}

export function ParticipantStepper({
  locale,
  labelKey,
  label: labelText,
  value,
  onChange,
}: ParticipantStepperProps) {
  const { t } = useI18n(locale);
  const displayLabel = labelKey ? t(labelKey) : (labelText ?? '');

  const decrement = () => onChange(Math.max(0, value - 1));
  const increment = () => onChange(Math.min(MAX_COUNT, value + 1));

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-mcc-border bg-mcc-surface-light px-3 py-2 dark:border-transparent dark:bg-mcc-surface/80">
      <span className="min-w-0 flex-1 text-sm font-medium text-mcc-fg-body dark:text-mcc-fg-on-dark">
        {displayLabel}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= 0}
          aria-label={`${t('a11y.decrease')} ${displayLabel}`}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-mcc-control text-xl font-medium text-mcc-fg transition hover:bg-mcc-control-hover disabled:cursor-not-allowed disabled:opacity-40 dark:bg-mcc-control-dark dark:text-mcc-fg-light dark:hover:bg-mcc-control-dark-hover"
        >
          −
        </button>
        <span
          className="min-w-10 text-center font-mcc-mono text-lg font-semibold tabular-nums text-mcc-fg dark:text-mcc-fg-inverse"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= MAX_COUNT}
          aria-label={`${t('a11y.increase')} ${displayLabel}`}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-mcc-control text-xl font-medium text-mcc-fg transition hover:bg-mcc-control-hover disabled:cursor-not-allowed disabled:opacity-40 dark:bg-mcc-control-dark dark:text-mcc-fg-light dark:hover:bg-mcc-control-dark-hover"
        >
          +
        </button>
      </div>
    </div>
  );
}
