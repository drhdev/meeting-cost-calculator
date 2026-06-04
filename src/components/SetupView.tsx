import { GROUP_KEYS, GROUPS } from '../domain/constants';
import type { CostStepEuro } from '../domain/types';
import { COST_STEP_OPTIONS } from '../domain/types';
import { getTotalParticipantCount } from '../domain/types';
import { useI18n } from '../hooks/useI18n';
import type { MessageKey } from '../i18n';
import type { MeetingSession } from '../timer/types';
import type { AppLocale } from '../timer/types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ParticipantStepper } from './ParticipantStepper';

const COST_STEP_LABELS: Record<CostStepEuro, MessageKey> = {
  1: 'setup.costStep.1',
  10: 'setup.costStep.10',
  100: 'setup.costStep.100',
  1000: 'setup.costStep.1000',
};

interface SetupViewProps {
  session: MeetingSession;
  onUpdateSetup: (patch: {
    participants?: MeetingSession['participants'];
    costStepEuro?: CostStepEuro;
    locale?: AppLocale;
  }) => void;
  onStart: () => void;
  compact?: boolean;
}

export function SetupView({ session, onUpdateSetup, onStart, compact = false }: SetupViewProps) {
  const { t } = useI18n(session.locale);
  const total = getTotalParticipantCount(session.participants);
  const canStart = total > 0;

  return (
    <div
      className={`flex flex-col ${compact ? 'gap-3' : 'gap-6'}`}
      data-compact={compact ? 'true' : undefined}
    >
      <header className={compact ? 'text-center' : 'text-center'}>
        <h1 className={`font-bold tracking-tight text-white ${compact ? 'text-lg' : 'text-2xl'}`}>
          {t('app.title')}
        </h1>
        {!compact && <p className="mt-1 text-sm text-slate-400">{t('app.subtitle')}</p>}
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t('setup.participants')}
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
        {!canStart && (
          <p className="text-center text-sm text-amber-400" role="alert">
            {t('error.noParticipants')}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-400">{t('setup.costStep')}</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COST_STEP_OPTIONS.map((step) => (
            <button
              key={step}
              type="button"
              aria-pressed={session.costStepEuro === step}
              onClick={() => onUpdateSetup({ costStepEuro: step })}
              className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition ${
                session.costStepEuro === step
                  ? 'bg-orange-500/20 text-orange-300 ring-2 ring-orange-500'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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

      <button
        type="button"
        onClick={onStart}
        disabled={!canStart}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-base font-semibold text-white transition hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t('setup.start')}
      </button>
    </div>
  );
}
