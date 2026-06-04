import { useI18n } from '../hooks/useI18n';
import type { MessageKey } from '../i18n';
import type { AppLocale } from '../timer/types';

const MAX_COUNT = 50;

interface ParticipantStepperProps {
  locale: AppLocale;
  labelKey: MessageKey;
  value: number;
  onChange: (value: number) => void;
}

export function ParticipantStepper({ locale, labelKey, value, onChange }: ParticipantStepperProps) {
  const { t } = useI18n(locale);

  const decrement = () => onChange(Math.max(0, value - 1));
  const increment = () => onChange(Math.min(MAX_COUNT, value + 1));

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-800/80 px-3 py-2">
      <span className="text-sm font-medium text-slate-200">{t(labelKey)}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= 0}
          aria-label={`${t('a11y.decrease')} ${t(labelKey)}`}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-700 text-xl font-medium text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span
          className="min-w-10 text-center font-mono text-lg font-semibold tabular-nums text-white"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= MAX_COUNT}
          aria-label={`${t('a11y.increase')} ${t(labelKey)}`}
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-700 text-xl font-medium text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
