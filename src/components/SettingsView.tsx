import { GROUP_KEYS, GROUPS } from '../domain/constants';
import {
  CUSTOM_PERSONA_LIMITS,
  createCustomPersona,
  isCustomPersonaValidForMeeting,
} from '../domain/customPersonas';
import type { CostStepEuro } from '../domain/types';
import { COST_STEP_OPTIONS } from '../domain/types';
import { getTotalParticipantCount } from '../domain/types';
import { useI18n } from '../hooks/useI18n';
import type { MessageKey } from '../i18n';
import type { MeetingSession } from '../timer/types';
import type { AppLocale } from '../timer/types';
import { CustomPersonaEditor } from './CustomPersonaEditor';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ParticipantStepper } from './ParticipantStepper';

const COST_STEP_LABELS: Record<CostStepEuro, MessageKey> = {
  1: 'setup.costStep.1',
  10: 'setup.costStep.10',
  100: 'setup.costStep.100',
  1000: 'setup.costStep.1000',
};

interface SettingsViewProps {
  session: MeetingSession;
  onUpdateSetup: (patch: {
    participants?: MeetingSession['participants'];
    customPersonas?: MeetingSession['customPersonas'];
    costStepEuro?: CostStepEuro;
    locale?: AppLocale;
  }) => void;
  compact?: boolean;
}

export function SettingsView({ session, onUpdateSetup, compact = false }: SettingsViewProps) {
  const { t } = useI18n(session.locale);
  const total = getTotalParticipantCount(session.participants, session.customPersonas);
  const customValid = session.customPersonas.every(isCustomPersonaValidForMeeting);
  const hasInvalidCustom =
    total > 0 && !customValid && session.customPersonas.some((p) => p.count > 0);

  const updateCustomPersona = (id: string, next: MeetingSession['customPersonas'][number]) => {
    onUpdateSetup({
      customPersonas: session.customPersonas.map((p) => (p.id === id ? next : p)),
    });
  };

  const removeCustomPersona = (id: string) => {
    onUpdateSetup({
      customPersonas: session.customPersonas.filter((p) => p.id !== id),
    });
  };

  const addCustomPersona = () => {
    if (session.customPersonas.length >= CUSTOM_PERSONA_LIMITS.maxPersonas) {
      return;
    }
    onUpdateSetup({
      customPersonas: [...session.customPersonas, createCustomPersona()],
    });
  };

  return (
    <div
      className={`flex flex-col ${compact ? 'gap-3' : 'gap-6'}`}
      data-testid="settings-view"
      data-compact={compact ? 'true' : undefined}
    >
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t('setup.standardPersonas')}
        </h2>
        <div className="flex flex-col gap-2">
          {GROUP_KEYS.map((group) => (
            <ParticipantStepper
              key={group}
              locale={session.locale}
              labelKey={GROUPS[group].i18nKey as MessageKey}
              value={session.participants[group]}
              onChange={(count) =>
                onUpdateSetup({
                  participants: { ...session.participants, [group]: count },
                })
              }
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t('setup.customPersonas')}
          </h2>
          <button
            type="button"
            onClick={addCustomPersona}
            disabled={session.customPersonas.length >= CUSTOM_PERSONA_LIMITS.maxPersonas}
            className="min-h-9 shrink-0 rounded-lg bg-slate-200 px-3 text-xs font-semibold text-slate-800 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            {t('setup.customPersona.add')}
          </button>
        </div>
        {session.customPersonas.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('setup.customPersona.hint')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {session.customPersonas.map((persona) => (
              <CustomPersonaEditor
                key={persona.id}
                locale={session.locale}
                persona={persona}
                invalid={persona.count > 0 && !isCustomPersonaValidForMeeting(persona)}
                onChange={(next) => updateCustomPersona(persona.id, next)}
                onRemove={() => removeCustomPersona(persona.id)}
              />
            ))}
          </div>
        )}
      </section>

      {hasInvalidCustom && (
        <p className="text-center text-sm text-amber-600 dark:text-amber-400" role="alert">
          {t('error.invalidCustomPersona')}
        </p>
      )}

      <section className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {t('setup.costStep')}
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COST_STEP_OPTIONS.map((step) => (
            <button
              key={step}
              type="button"
              aria-pressed={session.costStepEuro === step}
              onClick={() => onUpdateSetup({ costStepEuro: step })}
              className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition ${
                session.costStepEuro === step
                  ? 'bg-orange-500/20 text-orange-800 ring-2 ring-orange-500 dark:text-orange-300'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {t(COST_STEP_LABELS[step])}
            </button>
          ))}
        </div>
      </section>

      <LanguageSwitcher
        locale={session.locale}
        onChange={(locale) => onUpdateSetup({ locale })}
      />
    </div>
  );
}
