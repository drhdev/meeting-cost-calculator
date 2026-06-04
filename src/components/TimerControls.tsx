import { useI18n } from '../hooks/useI18n';
import type { TimerPhase } from '../timer/types';
import type { AppLocale } from '../timer/types';

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
  const btnBase = `flex flex-1 items-center justify-center rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${
    compact ? 'min-h-9 px-2' : 'min-h-11 rounded-xl px-4'
  }`;
  const disabledClass = 'disabled:cursor-not-allowed disabled:opacity-40';

  const playBtn = `${btnBase} bg-green-600 text-white hover:bg-green-500 ${disabledClass}`;
  const pauseBtn = `${btnBase} bg-yellow-400 text-slate-900 hover:bg-yellow-300 ${disabledClass}`;
  const stopBtn = `${btnBase} bg-red-600 text-white hover:bg-red-500 ${disabledClass}`;
  /** Setup: muted like disabled play/pause so focus stays on configuring participants */
  const stopSetupBtn = `${btnBase} bg-red-950/35 text-red-300/80 dark:bg-red-950/55 dark:text-red-400/60 ${disabledClass}`;
  const stopConfirmBtn = `${btnBase} animate-pulse bg-red-600 text-white ring-2 ring-red-400 ring-offset-2 ring-offset-slate-100 hover:bg-red-500 motion-reduce:animate-none dark:ring-offset-slate-950`;

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
          className={playBtn}
        >
          <PlayIcon className={iconClass} />
        </button>
        <button
          type="button"
          onClick={isRunning ? onPause : undefined}
          disabled={!isRunning}
          aria-label={t('controls.pause')}
          title={t('controls.pause')}
          className={pauseBtn}
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
                : stopBtn
          }
        >
          <StopIcon className={iconClass} />
        </button>
      </div>
      {phase === 'stopped_confirm' && (
        <p className="text-center text-sm font-medium text-amber-600 dark:text-amber-400">
          {t('stopped.hint')}
        </p>
      )}
    </div>
  );
}
