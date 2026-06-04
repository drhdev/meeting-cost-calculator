import { useEffect, useRef, useState } from 'react';
import {
  applyThemeToPiPWindow,
  isDocumentPiPEnabled,
  isDocumentPiPSupported,
  preparePiPDocument,
  requestDocumentPiPWindow,
} from '../focus/documentPiP';

function attachPiPWindow(win: Window, isDark: boolean, onClosed: () => void): void {
  preparePiPDocument(win, isDark);
  win.addEventListener('pagehide', onClosed, { once: true });
}

export function useDocumentPiP(enabled: boolean, isDark: boolean) {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const closingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      const existing = window.documentPictureInPicture?.window;
      if (existing) {
        closingRef.current = true;
        existing.close();
      }
      const id = window.setTimeout(() => setPipWindow(null), 0);
      return () => window.clearTimeout(id);
    }

    if (!isDocumentPiPEnabled()) {
      return;
    }

    let cancelled = false;

    const onClosed = () => {
      if (!closingRef.current) {
        setPipWindow(null);
      }
      closingRef.current = false;
    };

    const adopt = (win: Window) => {
      attachPiPWindow(win, isDark, onClosed);
      window.setTimeout(() => setPipWindow(win), 0);
    };

    const existing = window.documentPictureInPicture?.window;
    if (existing) {
      adopt(existing);
      return () => {
        cancelled = true;
      };
    }

    void requestDocumentPiPWindow().then((win) => {
      if (cancelled || !win) {
        return;
      }
      adopt(win);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, isDark]);

  useEffect(() => {
    if (!pipWindow) {
      return;
    }
    applyThemeToPiPWindow(pipWindow, isDark);
  }, [pipWindow, isDark]);

  return {
    pipWindow,
    pipSupported: isDocumentPiPSupported(),
    pipActive: pipWindow !== null,
  };
}
