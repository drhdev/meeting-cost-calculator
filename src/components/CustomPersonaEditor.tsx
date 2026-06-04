import {
  CUSTOM_PERSONA_LIMITS,
  type CustomPersona,
} from '../domain/customPersonas';
import { useI18n } from '../hooks/useI18n';
import type { AppLocale } from '../timer/types';
import { mccFieldInput, mccFocusRing } from '../ui/themeClasses';
import { ParticipantStepper } from './ParticipantStepper';

interface CustomPersonaEditorProps {
  locale: AppLocale;
  persona: CustomPersona;
  onChange: (persona: CustomPersona) => void;
  onRemove: () => void;
  invalid?: boolean;
}

const inputClass = mccFieldInput;

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
          ? 'border-mcc-warning-emphasis/60 bg-mcc-warning-emphasis/5'
          : 'border-mcc-border bg-mcc-surface-light dark:border-mcc-border-subtle dark:bg-mcc-surface/50'
      }`}
      data-testid={`custom-persona-${persona.id}`}
    >
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_8rem_auto] sm:items-end sm:gap-2">
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-mcc-fg-muted dark:text-mcc-fg-muted-dark">
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
          <span className="text-xs font-medium text-mcc-fg-muted dark:text-mcc-fg-muted-dark">
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
            className={`${inputClass} font-mcc-mono tabular-nums`}
            aria-invalid={invalid}
          />
        </label>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t('a11y.removeCustomPersona')}
          className={`min-h-11 shrink-0 rounded-lg border border-mcc-border-strong px-3 text-sm font-medium text-mcc-fg-secondary transition hover:bg-mcc-control ${mccFocusRing} dark:border-mcc-border-dark dark:text-mcc-fg-body-dark dark:hover:bg-mcc-control-dark`}
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
