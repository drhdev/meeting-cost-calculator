# Tech Stack — MCT

Stand: **Juni 2026** (bei Upgrades diese Datei + `package.json` synchron halten).

## Architektur

```
Browser (PWA optional)
    └── Static SPA (Vite build → nginx)
            ├── src/domain/     ← pure logic, Vitest
            ├── src/timer/      ← FSM + hook, Vitest
            ├── src/components/ ← React UI, RTL + Playwright
            └── src/i18n/       ← de/en maps
```

**Kein** Server-Runtime, **keine** Datenbank, **kein** API in v1.

## Verbindliche Versionen

| Komponente | Zielversion | Node |
|------------|-------------|------|
| Node.js | 22 LTS | `.nvmrc`: `22` |
| Vite | 8.x | 20.19+ / 22.12+ |
| @vitejs/plugin-react | 6.x | Oxc-basiertes Fast Refresh |
| React / React DOM | 19.x | — |
| TypeScript | 6.x | `strict: true` |
| vite-plugin-pwa | 1.3.x | Workbox 7 |
| Tailwind CSS | 4.x | `@tailwindcss/vite` |
| Vitest | 3.x oder 4.x | jsdom für Unit; Playwright für E2E |
| @testing-library/react | latest | Mit jsdom |
| Playwright | latest | E2E |
| ESLint | 9 flat | typescript-eslint + react-hooks |
| nginx (Docker) | 1.27-alpine | SPA + Healthcheck |

## Verzeichnis-Konventionen

| Pfad | Verantwortung |
|------|----------------|
| `src/domain/` | Kostenformeln, Konstanten — **kein React import** |
| `src/timer/` | FSM, `useMeetingTimer` — darf React nutzen |
| `src/components/` | Präsentation, keine Geschäftslogik duplizieren |
| `src/i18n/` | Übersetzungs-Maps + `t()` |
| `e2e/` | Playwright-Spezifikationen |
| `public/icons/` | PWA-Icons |

## Build & Env

| Variable | Zweck |
|----------|--------|
| `VITE_TIPS_URL` | Link „Produktivere Meetings“ (Ended-Screen) |

Nur `VITE_*` — werden zur Build-Zeit eingebettet, sind öffentlich.

## Performance-Ziele

- JS gzip **< 150 KB**
- Keine schweren UI-Bibliotheken (kein MUI/Chakra in v1)
- Timer-Tick: 100 ms intern, Zeit-Anzeige sekundengenau

## Was bewusst fehlt (v1)

Next.js, TanStack Query, Redux/Zustand, i18next, Backend, Analytics, localStorage-Persistenz
