import { Layout } from './components/Layout';
import { EndedView } from './components/EndedView';
import { RunningView } from './components/RunningView';
import { SetupView } from './components/SetupView';
import { useCompactMode } from './hooks/useCompactMode';
import { useMeetingTimer } from './timer/useMeetingTimer';

export default function App() {
  const compact = useCompactMode();
  const {
    session,
    elapsedMs,
    displayedCostEuro,
    start,
    pause,
    resume,
    stop,
    reset,
    updateSetup,
  } = useMeetingTimer();

  const isRunningPhase =
    session.phase === 'running' ||
    session.phase === 'paused' ||
    session.phase === 'stopped_confirm';

  return (
    <Layout locale={session.locale} compact={compact}>
      {session.phase === 'setup' && (
        <SetupView
          session={session}
          onUpdateSetup={updateSetup}
          onStart={start}
          compact={compact}
        />
      )}
      {isRunningPhase && (
        <RunningView
          session={session}
          elapsedMs={elapsedMs}
          displayedCostEuro={displayedCostEuro}
          onPause={pause}
          onResume={resume}
          onContinue={start}
          onStop={stop}
          compact={compact}
        />
      )}
      {session.phase === 'ended' && (
        <EndedView session={session} onReset={reset} compact={compact} />
      )}
    </Layout>
  );
}
