import { useEffect, useMemo, useState } from 'react';
import { isRtlLocale } from './i18n/localeConfig';
import { AppToolbar } from './components/AppToolbar';
import { DistractionFreeLayer } from './components/DistractionFreeLayer';
import { EndedView } from './components/EndedView';
import { Layout } from './components/Layout';
import { RunningView } from './components/RunningView';
import { SettingsView } from './components/SettingsView';
import { isCustomPersonaValidForMeeting } from './domain/customPersonas';
import { getTotalParticipantCount } from './domain/types';
import { isDistractionFreePhase } from './focus/phase';
import { useCompactMode } from './hooks/useCompactMode';
import { useDocumentPiP } from './hooks/useDocumentPiP';
import { useTheme } from './hooks/useTheme';
import { useMeetingCalculator } from './timer/useMeetingCalculator';

export default function App() {
  const compact = useCompactMode();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
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
  } = useMeetingCalculator();

  const distractionFree = isDistractionFreePhase(session.phase);
  const { pipWindow, pipActive } = useDocumentPiP(distractionFree, isDark);

  useEffect(() => {
    document.documentElement.lang = session.locale;
    document.documentElement.dir = isRtlLocale(session.locale) ? 'rtl' : 'ltr';
  }, [session.locale]);

  const canStart = useMemo(() => {
    const total = getTotalParticipantCount(session.participants, session.customPersonas);
    const customValid = session.customPersonas.every(isCustomPersonaValidForMeeting);
    return total > 0 && customValid;
  }, [session.participants, session.customPersonas]);

  const runningProps = {
    session,
    elapsedMs,
    displayedCostEuro,
    onStart: start,
    onPause: pause,
    onResume: resume,
    onContinue: start,
    onStop: stop,
    onOpenSettings: () => setSettingsOpen(true),
    startDisabled: !canStart,
    compact,
  };

  const toolbar = (
    <AppToolbar
      locale={session.locale}
      isDark={isDark}
      onToggleTheme={toggleTheme}
      settingsOpen={settingsOpen}
      onOpenSettings={() => setSettingsOpen(true)}
      onCloseSettings={() => setSettingsOpen(false)}
      settingsDisabled={
        session.phase === 'running' ||
        session.phase === 'paused' ||
        session.phase === 'stopped_confirm'
      }
      compact={compact}
    />
  );

  const showTimer =
    !settingsOpen &&
    (session.phase === 'setup' ||
      session.phase === 'running' ||
      session.phase === 'paused' ||
      session.phase === 'stopped_confirm');

  if (distractionFree) {
    return (
      <DistractionFreeLayer
        locale={session.locale}
        pipWindow={pipWindow}
        pipActive={pipActive}
        {...runningProps}
      />
    );
  }

  return (
    <Layout locale={session.locale} compact={compact} toolbar={toolbar}>
      {settingsOpen && (
        <SettingsView session={session} onUpdateSetup={updateSetup} compact={compact} />
      )}
      {showTimer && <RunningView {...runningProps} />}
      {!settingsOpen && session.phase === 'ended' && (
        <EndedView
          session={session}
          onReset={() => {
            reset();
            setSettingsOpen(false);
          }}
          compact={compact}
        />
      )}
    </Layout>
  );
}
