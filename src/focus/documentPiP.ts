export function isDocumentPiPSupported(): boolean {
  return typeof window !== 'undefined' && 'documentPictureInPicture' in window;
}

export function isDocumentPiPEnabled(): boolean {
  if (!isDocumentPiPSupported()) {
    return false;
  }
  if (typeof window === 'undefined') {
    return false;
  }
  if (navigator.webdriver) {
    return false;
  }
  return !new URLSearchParams(window.location.search).has('nopip');
}

export function adoptStylesIntoDocument(targetDoc: Document): void {
  for (const sheet of document.styleSheets) {
    try {
      if (sheet.href) {
        const link = targetDoc.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheet.href;
        targetDoc.head.appendChild(link);
      } else {
        const rules = [...sheet.cssRules].map((rule) => rule.cssText).join('\n');
        if (rules) {
          const style = targetDoc.createElement('style');
          style.textContent = rules;
          targetDoc.head.appendChild(style);
        }
      }
    } catch {
      const owner = sheet.ownerNode;
      if (owner instanceof HTMLStyleElement && owner.textContent) {
        const style = targetDoc.createElement('style');
        style.textContent = owner.textContent;
        targetDoc.head.appendChild(style);
      }
    }
  }
}

export function preparePiPDocument(pipWindow: Window, isDark: boolean): void {
  const { document: pipDoc } = pipWindow;
  adoptStylesIntoDocument(pipDoc);
  pipDoc.documentElement.className = document.documentElement.className;
  pipDoc.documentElement.lang = document.documentElement.lang;
  pipDoc.documentElement.classList.toggle('dark', isDark);
  pipDoc.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  pipDoc.body.className =
    'min-h-dvh bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3';
}

export function applyThemeToPiPWindow(pipWindow: Window, isDark: boolean): void {
  const root = pipWindow.document.documentElement;
  root.classList.toggle('dark', isDark);
  root.style.colorScheme = isDark ? 'dark' : 'light';
}

export async function requestDocumentPiPWindow(
  width = 380,
  height = 440,
): Promise<Window | null> {
  if (!isDocumentPiPSupported()) {
    return null;
  }

  const api = window.documentPictureInPicture;
  if (!api) {
    return null;
  }

  if (api.window) {
    return api.window;
  }

  try {
    return await api.requestWindow({ width, height });
  } catch {
    return null;
  }
}
