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
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-transparent dark:bg-slate-800/80">
      <span className="min-w-0 flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
        {displayLabel}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= 0}
          aria-label={`${t('a11y.decrease')} ${displayLabel}`}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-200 text-xl font-medium text-slate-900 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          −
        </button>
        <span
          className="min-w-10 text-center font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-white"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= MAX_COUNT}
          aria-label={`${t('a11y.increase')} ${displayLabel}`}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-200 text-xl font-medium text-slate-900 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          +
        </button>
      </div>
    </div>
  );
}
