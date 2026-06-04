import {
  CUSTOM_PERSONA_LIMITS,
  type CustomPersona,
} from '../domain/customPersonas';
import { useI18n } from '../hooks/useI18n';
import type { AppLocale } from '../timer/types';
import { ParticipantStepper } from './ParticipantStepper';

interface CustomPersonaEditorProps {
  locale: AppLocale;
  persona: CustomPersona;
  onChange: (persona: CustomPersona) => void;
  onRemove: () => void;
  invalid?: boolean;
}

const inputClass =
  'min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500';

export function CustomPersonaEditor({
  locale,
  persona,
  onChange,
  onRemove,
  invalid = false,
}: CustomPersonaEditorProps) {
  const { t } = useI18n(locale);
  const stepperLabel =
    persona.label.trim() || t('setup.customPersona.unnamed');

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border px-3 py-3 ${
        invalid
          ? 'border-amber-500/60 bg-amber-500/5'
          : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
      }`}
      data-testid={`custom-persona-${persona.id}`}
    >
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_8rem_auto] sm:items-end sm:gap-2">
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {t('setup.customPersona.label')}
          </span>
          <input
            type="text"
            value={persona.label}
            maxLength={CUSTOM_PERSONA_LIMITS.maxLabelLength}
            placeholder={t('setup.customPersona.labelPlaceholder')}
            onChange={(e) => onChange({ ...persona, label: e.target.value })}
            className={inputClass}
            aria-invalid={invalid}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {t('setup.customPersona.salary')}
          </span>
          <input
            type="number"
            min={CUSTOM_PERSONA_LIMITS.minAnnualSalary}
            max={CUSTOM_PERSONA_LIMITS.maxAnnualSalary}
            step={1000}
            value={persona.annualSalaryEuro}
            onChange={(e) =>
              onChange({
                ...persona,
                annualSalaryEuro: Number(e.target.value) || 0,
              })
            }
            className={`${inputClass} font-mono tabular-nums`}
            aria-invalid={invalid}
          />
        </label>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t('a11y.removeCustomPersona')}
          className="min-h-11 shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {t('setup.customPersona.remove')}
        </button>
      </div>
      <ParticipantStepper
        locale={locale}
        label={stepperLabel}
        value={persona.count}
        onChange={(count) => onChange({ ...persona, count })}
      />
    </div>
  );
}
