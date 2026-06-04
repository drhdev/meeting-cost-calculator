import { GROUP_KEYS, GROUPS } from '../domain/constants';
import { formatEuro } from '../domain/cost';
import { moneyLocale, type MessageKey } from '../i18n';
import { getSessionRatePerSecond } from '../timer/meetingCalculator';
import type { MeetingSession } from '../timer/types';
import { mccFocusRing, mccWarningBanner, mccWarningText } from '../ui/themeClasses';
import { useI18n } from '../hooks/useI18n';
import type { AppLocale } from '../timer/types';
import { CostDisplay } from './CostDisplay';
import { TimeDisplay } from './TimeDisplay';
import { TimerControls } from './TimerControls';

interface TimerCostPanelProps {
  locale: AppLocale;
  elapsedLabel: string;
  costLabel: string;
  elapsedMs: number;
  displayedCostEuro: number;
  ratePerMinute?: number;
  rateLabel?: string;
  large?: boolean;
  className?: string;
}

/** Timer above cost, centered — same layout in every view. */
function TimerCostPanel({
  locale,
  elapsedLabel,
  costLabel,
  elapsedMs,
  displayedCostEuro,
  ratePerMinute,
  rateLabel,
  large = false,
  className = '',
}: TimerCostPanelProps) {
  return (
    <div className={className}>
      <div
        className={`flex w-full flex-col items-center ${large ? 'gap-8' : 'gap-4'}`}
        data-testid="timer-cost-stack"
      >
        <TimeDisplay label={elapsedLabel} elapsedMs={elapsedMs} large={large} />
        <CostDisplay
          locale={locale}
          label={costLabel}
          displayedCostEuro={displayedCostEuro}
          ratePerMinute={ratePerMinute}
          rateLabel={rateLabel}
          large={large}
        />
      </div>
    </div>
  );
}

export interface RunningViewProps {
  session: MeetingSession;
  elapsedMs: number;
  displayedCostEuro: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onOpenSettings: () => void;
  startDisabled?: boolean;
  compact?: boolean;
  /** Distraction-free: timer, participants, controls only */
  focus?: boolean;
}

function ConfigureHint({
  locale,
  compact,
  onOpenSettings,
}: {
  locale: MeetingSession['locale'];
  compact: boolean;
  onOpenSettings: () => void;
}) {
  const { t } = useI18n(locale);
  const linkClass = `font-semibold underline underline-offset-2 hover:text-mcc-warning-hover focus-visible:rounded ${mccFocusRing} dark:hover:text-mcc-warning-hover-dark`;

  return (
    <p
      className={
        compact
          ? `text-center text-xs ${mccWarningText}`
          : `text-center ${mccWarningBanner}`
      }
      role="status"
    >
      {t('timer.configureHint.prefix')}
      <button type="button" onClick={onOpenSettings} className={linkClass}>
        {t('settings.title')}
      </button>
      {t('timer.configureHint.suffix')}
    </p>
  );
}

export function RunningView({
  session,
  elapsedMs,
  displayedCostEuro,
  onStart,
  onPause,
  onResume,
  onStop,
  onOpenSettings,
  startDisabled = false,
  compact = false,
  focus = false,
}: RunningViewProps) {
  const { t } = useI18n(session.locale);
  const ratePerSecond = getSessionRatePerSecond(session);
  const ratePerMinute = ratePerSecond * 60;
  const rateLabel =
    ratePerMinute > 0
      ? t('running.ratePerMin', {
          rate: formatEuro(ratePerMinute, moneyLocale(session.locale)),
        })
      : undefined;

  const activeGroups = GROUP_KEYS.filter((g) => session.participants[g] > 0);
  const activeCustom = session.customPersonas.filter((p) => p.count > 0);
  const showParticipants = activeGroups.length > 0 || activeCustom.length > 0;

  const participantsBlock = showParticipants && (
    <div className="rounded-xl border border-mcc-border bg-mcc-surface-light px-3 py-2 dark:border-mcc-border-subtle dark:bg-mcc-surface/60">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-mcc-fg-subtle">
        {t('running.participants')}
      </p>
      <ul className="flex flex-wrap gap-1.5 text-xs text-mcc-fg-secondary dark:text-mcc-fg-body-dark sm:text-sm">
        {activeGroups.map((group) => (
          <li
            key={group}
            data-testid="active-participant"
            className="rounded-md bg-mcc-control px-2 py-1 font-mcc-mono tabular-nums dark:bg-mcc-control-dark/80"
          >
            {session.participants[group]}× {t(GROUPS[group].i18nKey as MessageKey)}
          </li>
        ))}
        {activeCustom.map((persona) => (
          <li
            key={persona.id}
            data-testid="active-participant"
            data-participant-label={persona.label.trim()}
            className="rounded-md bg-mcc-control px-2 py-1 font-mcc-mono tabular-nums dark:bg-mcc-control-dark/80"
          >
            {persona.count}× {persona.label.trim()}
          </li>
        ))}
      </ul>
    </div>
  );

  if (focus) {
    return (
      <div
        className="flex min-w-0 flex-col gap-3"
        data-testid="timer-view"
        data-focus="true"
        data-compact={compact ? 'true' : undefined}
      >
        <TimerCostPanel
          locale={session.locale}
          elapsedLabel={t('running.elapsed')}
          costLabel={t('running.cost')}
          elapsedMs={elapsedMs}
          displayedCostEuro={displayedCostEuro}
          ratePerMinute={ratePerMinute}
          rateLabel={rateLabel}
          large
          className="min-w-0 rounded-xl border border-mcc-border bg-mcc-panel/95 px-3 py-4 shadow-sm dark:border-mcc-border-subtle dark:bg-mcc-bg/90"
        />
        {participantsBlock}
        <TimerControls
          locale={session.locale}
          phase={session.phase}
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onStop={onStop}
          startDisabled={startDisabled}
          compact
        />
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className="flex min-w-0 flex-1 flex-col gap-2"
        data-testid="timer-view"
        data-compact="true"
      >
        {session.phase === 'setup' && startDisabled && (
          <ConfigureHint locale={session.locale} compact onOpenSettings={onOpenSettings} />
        )}
        <TimerCostPanel
          locale={session.locale}
          elapsedLabel={t('running.elapsed')}
          costLabel={t('running.cost')}
          elapsedMs={elapsedMs}
          displayedCostEuro={displayedCostEuro}
          large
          className="min-w-0 rounded-lg border border-mcc-border bg-mcc-panel/95 px-2 py-3 shadow-sm dark:border-transparent dark:bg-mcc-bg/90 dark:shadow-none"
        />
        <TimerControls
          locale={session.locale}
          phase={session.phase}
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onStop={onStop}
          startDisabled={startDisabled}
          compact
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6" data-testid="timer-view">
      {session.phase === 'setup' && startDisabled && (
        <ConfigureHint locale={session.locale} compact={false} onOpenSettings={onOpenSettings} />
      )}
      <TimerCostPanel
        locale={session.locale}
        elapsedLabel={t('running.elapsed')}
        costLabel={t('running.cost')}
        elapsedMs={elapsedMs}
        displayedCostEuro={displayedCostEuro}
        ratePerMinute={ratePerMinute}
        rateLabel={rateLabel}
        large
        className="rounded-2xl border border-mcc-border bg-mcc-panel/90 px-4 py-8 shadow-sm dark:border-transparent dark:bg-mcc-bg/80 dark:shadow-none"
      />

      {participantsBlock}

      <TimerControls
        locale={session.locale}
        phase={session.phase}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onStop={onStop}
        startDisabled={startDisabled}
      />
    </div>
  );
}
