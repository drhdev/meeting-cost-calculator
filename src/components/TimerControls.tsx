import { useI18n } from '../hooks/useI18n';
import type { TimerPhase } from '../timer/types';
import type { AppLocale } from '../timer/types';
import { mccFocusRing, mccWarningText } from '../ui/themeClasses';

interface TimerControlsProps {
  locale: AppLocale;
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  startDisabled?: boolean;
  compact?: boolean;
}

function PlayIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  );
}

function PauseIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function StopIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6 6h12v12H6V6z" />
    </svg>
  );
}

export function TimerControls({
  locale,
  phase,
  onStart,
  onPause,
  onResume,
  onStop,
  startDisabled = false,
  compact = false,
}: TimerControlsProps) {
  const { t } = useI18n(locale);

  const iconClass = compact ? 'h-5 w-5' : 'h-6 w-6';
  const btnBase = `flex flex-1 items-center justify-center rounded-lg transition ${mccFocusRing} ${
    compact ? 'min-h-9 px-2' : 'min-h-11 rounded-xl px-4'
  }`;
  const disabledClass = 'disabled:cursor-not-allowed disabled:opacity-40';

  const actionBtn = `${btnBase} bg-mcc-action text-mcc-on-accent hover:bg-mcc-action-hover dark:bg-mcc-action-dark dark:hover:bg-mcc-action-dark-hover ${disabledClass}`;
  /** Setup: muted like disabled play/pause so focus stays on configuring participants */
  const stopSetupBtn = `${btnBase} bg-mcc-control text-mcc-fg-subtle dark:bg-mcc-surface/80 dark:text-mcc-fg-subtle ${disabledClass}`;
  const stopConfirmBtn = `${btnBase} animate-pulse bg-mcc-action text-mcc-on-accent ring-2 ring-mcc-ring ring-offset-2 ring-offset-mcc-ring-offset-light hover:bg-mcc-action-hover motion-reduce:animate-none dark:bg-mcc-action-dark dark:hover:bg-mcc-action-dark-hover dark:ring-mcc-ring-dark dark:ring-offset-mcc-ring-offset-dark`;

  const isSetup = phase === 'setup';
  const isRunning = phase === 'running';
  const isPaused = phase === 'paused';
  const isStoppedConfirm = phase === 'stopped_confirm';
  const canContinue = isPaused || isStoppedConfirm;
  const playEnabled = (isSetup && !startDisabled) || canContinue;
  const playLabel = canContinue ? t('controls.resume') : t('controls.start');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={isSetup ? onStart : canContinue ? onResume : undefined}
          disabled={!playEnabled}
          aria-label={playLabel}
          title={playLabel}
          className={actionBtn}
        >
          <PlayIcon className={iconClass} />
        </button>
        <button
          type="button"
          onClick={isRunning ? onPause : undefined}
          disabled={!isRunning}
          aria-label={t('controls.pause')}
          title={t('controls.pause')}
          className={actionBtn}
        >
          <PauseIcon className={iconClass} />
        </button>
        <button
          type="button"
          onClick={onStop}
          disabled={phase === 'setup'}
          aria-label={t('controls.stop')}
          title={t('controls.stop')}
          className={
            phase === 'stopped_confirm'
              ? stopConfirmBtn
              : phase === 'setup'
                ? stopSetupBtn
                : actionBtn
          }
        >
          <StopIcon className={iconClass} />
        </button>
      </div>
      {phase === 'stopped_confirm' && (
        <p className={`text-center text-sm font-medium ${mccWarningText}`}>
          {t('stopped.hint')}
        </p>
      )}
    </div>
  );
}
