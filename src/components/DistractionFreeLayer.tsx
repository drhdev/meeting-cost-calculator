import { createPortal } from 'react-dom';
import { useI18n } from '../hooks/useI18n';
import type { AppLocale } from '../timer/types';
import { mccHeading, mccPageShell } from '../ui/themeClasses';
import { RunningView, type RunningViewProps } from './RunningView';

interface DistractionFreeLayerProps extends RunningViewProps {
  locale: AppLocale;
  pipWindow: Window | null;
  pipActive: boolean;
}

export function DistractionFreeLayer({
  locale,
  pipWindow,
  pipActive,
  ...runningProps
}: DistractionFreeLayerProps) {
  const { t } = useI18n(locale);
  const panel = <RunningView {...runningProps} focus />;

  return (
    <>
      {pipWindow && createPortal(panel, pipWindow.document.body)}
      {!pipActive && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto p-4 ${mccPageShell}`}
          data-testid="focus-overlay"
        >
          <div className="w-full max-w-sm">{panel}</div>
        </div>
      )}
      {pipActive && (
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 px-6 text-center ${mccPageShell}`}
          data-testid="focus-pip-placeholder"
        >
          <p className={`text-lg font-semibold ${mccHeading}`}>{t('focus.overlayTitle')}</p>
          <p className="text-sm text-mcc-fg-muted dark:text-mcc-fg-muted-dark">{t('focus.pipActive')}</p>
          <p className="text-xs text-mcc-fg-subtle">{t('focus.pipHint')}</p>
        </div>
      )}
    </>
  );
}
