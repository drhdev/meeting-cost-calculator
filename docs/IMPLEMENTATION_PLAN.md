# Meeting Cost Timer (MCT) — Agent-Umsetzungsplan

> **Ziel:** Dieses Dokument Schritt für Schritt abarbeiten, bis die App production-ready ist.  
> **Zielgruppe:** KI-Coding-Agenten (Codex, Cursor Agent, etc.)  
> **Repo-Titel:** `meeting-cost-timer` (Kurzname: MCT)  
> **Sprache der App:** Deutsch (Standard), Englisch optional

## Standards & Referenzen (vor Phase 0 lesen)

| Dokument | Zweck |
|----------|--------|
| [`AGENTS.md`](../AGENTS.md) | Einstieg für alle Agenten |
| [`docs/references/CODING_STANDARDS.md`](references/CODING_STANDARDS.md) | Verbindliche Code- & UX-Regeln |
| [`docs/references/README.md`](references/README.md) | Index Stack, React, Vite, PWA, Tests, Docker |
| [`.cursor/rules/`](../.cursor/rules/) | Automatische Cursor-Regeln pro Dateityp |

---

## Anweisungen für den Agenten

0. **Lies zuerst** `AGENTS.md` und `docs/references/CODING_STANDARDS.md`.
1. **Arbeite Phase für Phase** — beginne bei Phase 0, schließe jede Phase erst ab, wenn alle DoD-Checkboxen erfüllt und alle Tests grün sind.
2. **Keine Phase überspringen** — Abhängigkeiten sind bewusst gesetzt.
3. **Nach jeder Phase:** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` ausführen.
4. **Keine Commits**, es sei denn der Nutzer fordert sie ausdrücklich an.
5. **Keine Secrets** committen; nur `VITE_*` für öffentliche Build-Zeit-Variablen.
6. **Scope minimal halten** — keine Features außerhalb dieses Plans.
7. **Aktuelle Versionen** verwenden (Stand Plan: Juni 2026): Vite 8, React 19, TypeScript 6, vite-plugin-pwa 1.3+, Node 22.
8. Am Ende von Phase 7: Release `v1.0.0` vorbereiten (Tag nur wenn Nutzer wünscht).

### Status-Tracking (Agent aktualisiert diese Tabelle)

| Phase | Name | Status |
|-------|------|--------|
| 0 | Projekt-Bootstrap | `done` |
| 1 | Domänenlogik | `done` |
| 2 | Timer-FSM | `done` |
| 3 | UI Setup & Meeting | `done` |
| 4 | Ended & Kompaktmodus | `done` |
| 5 | PWA | `done` |
| 6 | Docker & Coolify | `done` |
| 7 | Production Readiness | `done` |

Status-Werte: `pending` → `in_progress` → `done`

---

## Produktanforderungen (Referenz)

### Funktional

- **Setup:** Anzahl Teilnehmer pro Gruppe via `+` / `-`
  - Tarifmitarbeiter — 90.000 €/Jahr
  - Außertarifliche Mitarbeiter — 150.000 €/Jahr
  - Leitende Angestellte — 300.000 €/Jahr
  - Vorstände — 3.000.000 €/Jahr
- **Kostenberechnung:** Gehalt abzüglich modellierter Nicht-Arbeitszeit → Kosten pro Sekunde
- **Timer:** Start, Pause, Stop; laufende Anzeige von Zeit und Kosten während `running`
- **Doppel-Stop:** Erstes Stop → eingefroren + Hinweis; zweites Stop → Auswertung
- **Ended-Screen:** Gesamtkosten, Dauer, Frage „War es das wert?“, Link zu Meeting-Tipps (URL TBD via Env)
- **Sprache:** DE (Standard) / EN umschaltbar im Setup
- **€-Anzeige-Schrittweite:** 1 / 10 / 100 / 1000 € (Setup) — Anzeige springt in diesen Schritten
- **Kompaktmodus:** Für kleines Fenster in Videokonferenzen (`?compact=1`)
- **Keine Persistenz** nötig (kein Backend, kein localStorage erforderlich)

### Nicht-funktional

- PWA: iPhone, Android, Desktop-Browser
- Keine Installation auf dem Rechner nötig (Web + optional PWA)
- Öffentliches GitHub-Repo, deploybar via Docker Compose auf Coolify
- Lighthouse PWA installable (wo Browser es unterstützt)
- Bundle-Ziel: < 150 KB gzip (JS)

---

## Technology Stack (verbindlich)

| Komponente | Paket / Version |
|------------|-----------------|
| Runtime Build | Node 22 LTS |
| Bundler | Vite 8.x |
| UI | React 19.x |
| Sprache | TypeScript 6.x (strict) |
| PWA | vite-plugin-pwa 1.3.x, Workbox 7 |
| Styling | Tailwind CSS 4.x |
| Unit Tests | Vitest + @testing-library/react |
| E2E | Playwright |
| Lint | ESLint 9 flat config + typescript-eslint |
| Deploy | nginx:alpine (Multi-Stage Dockerfile) |

**Nicht verwenden:** Next.js, Backend/API, Datenbank, Redux, i18next (nur 2 Sprachen → eigene JSON-Maps).

---

## Domänenlogik (verbindliche Formeln)

### Konstanten (`src/domain/constants.ts`)

```ts
export const GROUPS = {
  tariff:      { annualSalary: 90_000,   i18nKey: 'group.tariff' },
  non_tariff:  { annualSalary: 150_000,  i18nKey: 'group.non_tariff' },
  executive:   { annualSalary: 300_000,  i18nKey: 'group.executive' },
  board:       { annualSalary: 3_000_000, i18nKey: 'group.board' },
} as const;

export const WORK_TIME_ASSUMPTIONS = {
  daysPerYear: 365,
  weekendDays: 104,
  vacationDays: 30,
  sickDays: 5,
  publicHolidays: 10, // Annahme DE-Durchschnitt, in README dokumentieren
  hoursPerWeek: 38,
  workDaysPerWeek: 5,
} as const;
```

### Berechnung

```
workDaysPerYear = 365 - 104 - 30 - 5 - 10 = 216
hoursPerDay = 38 / 5 = 7.6
workSecondsPerYear = workDaysPerYear * hoursPerDay * 3600

costPerSecond(person) = annualSalary / workSecondsPerYear
totalRatePerSecond = Σ (count[group] * costPerSecond[group])
elapsedCost = elapsedMs / 1000 * totalRatePerSecond

displayedCostEuro = floor(elapsedCost / stepEuro) * stepEuro
```

### Golden-Test-Werte (für Unit-Tests)

Bei Standard-Annahmen (216 Tage, 7,6 h/Tag):

| Gruppe | Jahresgehalt | ≈ €/s (1 Person) |
|--------|--------------|------------------|
| tariff | 90.000 | ~0,0151 |
| non_tariff | 150.000 | ~0,0252 |
| executive | 300.000 | ~0,0504 |
| board | 3.000.000 | ~0,504 |

*(Exakte Werte im Test mit `toBeCloseTo` prüfen, nicht hardcoden ohne Berechnung.)*

---

## State Machine (verbindlich)

```
setup
  └─[Start]─→ running
running
  ├─[Pause]─→ paused
  └─[Stop]─→ stopped_confirm
paused
  ├─[Start/Resume]─→ running
  └─[Stop]─→ stopped_confirm
stopped_confirm
  ├─[Stop]─→ ended
  └─[Start]─→ running   (Meeting fortsetzen)
ended
  └─[Neues Meeting]─→ setup
```

### Verhalten

- **running:** Zeit und Kosten aktualisieren (Tick 100 ms intern, Zeit-Anzeige sekundengenau).
- **paused:** Keine Zeit-/Kosten-Fortschreibung.
- **stopped_confirm:** Timer eingefroren; UI-Text: DE „Erneut Stop zum Beenden“, EN „Press Stop again to finish“.
- **ended:** Finale Werte anzeigen (nicht neu berechnen aus laufendem Timer).

### Timer-Implementierung

- Nutze **segment-basierte** Zeitmessung mit `performance.now()`.
- Speichere Segmente: `{ startPerf, endPerf? }[]`.
- `elapsedMs` = Summe abgeschlossener Segmente + (now - letztes Segment.start) wenn running.
- **Page Visibility API:** Bei `visibilitychange` → `document.hidden` keine Pause erzwingen (Meetings laufen im Hintergrund weiter), aber beim Zurückkommen `elapsed` aus Segments neu berechnen (kein setInterval-Drift).

---

## Ziel-Repository-Struktur

```
meeting-cost-timer/
├── .github/workflows/ci.yml
├── .gitignore
├── .nvmrc                          # 22
├── docker-compose.yaml
├── Dockerfile
├── nginx.conf
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.js
├── README.md
├── LICENSE                         # MIT
├── public/
│   ├── favicon.svg
│   └── icons/                      # 192, 512, maskable, apple-touch
├── docs/
│   └── IMPLEMENTATION_PLAN.md      # diese Datei
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── domain/
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── cost.ts
│   │   └── cost.test.ts
│   ├── timer/
│   │   ├── types.ts
│   │   ├── meetingTimer.ts
│   │   ├── useMeetingTimer.ts
│   │   └── meetingTimer.test.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── de.ts
│   │   └── en.ts
│   ├── hooks/
│   │   └── useI18n.ts
│   └── components/
│       ├── Layout.tsx
│       ├── SetupView.tsx
│       ├── RunningView.tsx
│       ├── EndedView.tsx
│       ├── ParticipantStepper.tsx
│       ├── TimerControls.tsx
│       ├── CostDisplay.tsx
│       ├── TimeDisplay.tsx
│       └── LanguageSwitcher.tsx
└── e2e/
    ├── meeting-flow.spec.ts
    └── compact-mode.spec.ts
```

---

# Phase 0 — Projekt-Bootstrap

**Status-Ziel:** `done`

## Aufgaben

### 0.1 Projekt initialisieren

```bash
cd /path/to/meeting-cost-timer
npm create vite@latest . -- --template react-ts
# Falls Verzeichnis nicht leer: Dateien manuell anlegen
```

Abhängigkeiten (aktuellste stabile Versionen prüfen auf npm):

```bash
npm install react react-dom
npm install -D vite@^8 @vitejs/plugin-react@^6 typescript@^6 @types/react @types/react-dom
npm install -D tailwindcss@^4 @tailwindcss/vite vitest @vitest/coverage-v8 jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
npm install -D prettier eslint-config-prettier
npm install -D @playwright/test
npm install -D vite-plugin-pwa@^1 workbox-window
```

### 0.2 Konfigurationsdateien

- `tsconfig.json`: `"strict": true`, `"noUncheckedIndexedAccess": true`
- `vite.config.ts`: React-Plugin, Tailwind-Plugin, PWA-Plugin (Grundgerüst, Details Phase 5)
- `vitest.config.ts`: environment `jsdom`, setup `@testing-library/jest-dom`
- `eslint.config.js`: flat config, recommended + react-hooks
- `.nvmrc`: `22`
- `.gitignore`: node_modules, dist, coverage, playwright-report

### 0.3 package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint src e2e",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:ci": "npm run lint && npm run typecheck && npm run test && npm run build"
  }
}
```

### 0.4 CI (`.github/workflows/ci.yml`)

Jobs: `lint` → `typecheck` → `test` → `build` → `playwright` (nur auf Ubuntu).

### 0.5 Platzhalter-App

- `App.tsx`: Text „MCT — Setup in progress“
- `index.css`: Tailwind import, CSS-Variablen für Theme

## Definition of Done (Phase 0)

- [x] `npm run dev` startet ohne Fehler
- [x] `npm run build` erzeugt `dist/`
- [x] `npm run test` läuft (mindestens 1 Smoke-Test)
- [x] `npm run lint` und `npm run typecheck` ohne Fehler
- [x] GitHub Actions Workflow vorhanden
- [x] README.md mit Projektname, Kurzbeschreibung, Lizenz MIT

## Tests Phase 0

```ts
// src/smoke.test.ts
import { describe, it, expect } from 'vitest';
describe('smoke', () => {
  it('works', () => expect(true).toBe(true));
});
```

**Agent-Befehl nach Phase 0:**

```bash
npm run test:ci
```

---

# Phase 1 — Domänenlogik

**Status-Ziel:** `done`  
**Abhängigkeit:** Phase 0

## Aufgaben

### 1.1 Dateien anlegen

- `src/domain/types.ts` — `GroupKey`, `Participants`, `CostStepEuro` (1 | 10 | 100 | 1000)
- `src/domain/constants.ts` — siehe Abschnitt Domänenlogik
- `src/domain/cost.ts` — pure functions:
  - `getWorkSecondsPerYear()`
  - `getCostPerSecond(annualSalary: number): number`
  - `getTotalRatePerSecond(participants: Participants): number`
  - `getElapsedCostEuro(elapsedMs: number, ratePerSecond: number): number`
  - `quantizeCostDisplay(costEuro: number, stepEuro: CostStepEuro): number`
  - `formatEuro(amount: number, locale: 'de-DE' | 'en-GB'): string`
  - `formatDuration(ms: number): string` — `HH:MM:SS`

### 1.2 Unit-Tests (`src/domain/cost.test.ts`)

Mindestens:

1. `workSecondsPerYear` === 216 * 7.6 * 3600
2. Ein Person tariff ≈ 0.0151 €/s
3. 1 tariff + 1 board → Summe der Raten
4. `quantizeCostDisplay(47.3, 10)` → 40
5. `quantizeCostDisplay(999.9, 1000)` → 0
6. `formatDuration(3661000)` → `01:01:01`

## Definition of Done (Phase 1)

- [x] Alle Funktionen in `cost.ts` sind pure (kein React, kein DOM)
- [x] ≥ 95 % Statement Coverage in `src/domain/`
- [x] Golden-Tests für alle vier Gruppen (je 1 Person)
- [x] `npm run test` grün

## Tests Phase 1

```bash
npm run test -- src/domain
```

---

# Phase 2 — Timer-FSM & Hook

**Status-Ziel:** `done`  
**Abhängigkeit:** Phase 1

## Aufgaben

### 2.1 `src/timer/types.ts`

```ts
export type TimerPhase = 'setup' | 'running' | 'paused' | 'stopped_confirm' | 'ended';

export interface TimerSegment {
  startPerf: number;
  endPerf?: number;
}

export interface MeetingSession {
  phase: TimerPhase;
  segments: TimerSegment[];
  participants: Participants;
  costStepEuro: CostStepEuro;
  locale: 'de' | 'en';
  finalElapsedMs?: number;
  finalCostEuro?: number;
}
```

### 2.2 `src/timer/meetingTimer.ts`

Pure Reducer/Funktionen:

- `createInitialSession()`
- `start(session)`
- `pause(session)`
- `resume(session)` (von paused → running)
- `stopOnce(session)` (running|paused → stopped_confirm, schließt aktives Segment)
- `stopConfirm(session)` (stopped_confirm → ended, setzt finalElapsedMs + finalCostEuro)
- `reset(session)` (ended → setup)
- `getElapsedMs(session, nowPerf = performance.now())`

### 2.3 `src/timer/useMeetingTimer.ts`

- React-Hook mit `useReducer` oder `useState` + Funktionen aus 2.2
- `useEffect` mit `requestAnimationFrame` oder 100 ms `setInterval` **nur** wenn `phase === 'running'`
- Export: `{ session, elapsedMs, elapsedCostEuro, displayedCostEuro, start, pause, resume, stop, reset }`

### 2.4 Unit-Tests (`src/timer/meetingTimer.test.ts`)

Mit `vi.useFakeTimers()` / manuellen `nowPerf`:

1. start → 10s → pause → 5s Wartezeit → resume → 10s → elapsed = 20s
2. stopOnce friert elapsed ein
3. stopConfirm setzt finals
4. paused: elapsed steigt nicht

## Definition of Done (Phase 2)

- [x] Kein Drift > 100 ms bei 5 min simuliert
- [x] Doppel-Stop-Logik korrekt
- [x] Hook exportiert alle Actions
- [x] `npm run test` grün

---

# Phase 3 — UI Setup & Meeting

**Status-Ziel:** `done`  
**Abhängigkeit:** Phase 2

## Aufgaben

### 3.1 i18n (`src/i18n/`)

Keys mindestens:

```
app.title, app.subtitle
group.tariff, group.non_tariff, group.executive, group.board
setup.participants, setup.costStep, setup.language, setup.start
setup.costStep.1, setup.costStep.10, setup.costStep.100, setup.costStep.1000
running.elapsed, running.cost, running.paused
controls.start, controls.pause, controls.resume, controls.stop
stopped.hint
ended.title, ended.duration, ended.totalCost, ended.worthIt, ended.tips, ended.newMeeting
error.noParticipants
disclaimer.model
```

Hook `useI18n(locale)` → `t(key)`

### 3.2 Komponenten

| Komponente | Verantwortung |
|------------|---------------|
| `SetupView` | Stepper pro Gruppe, Sprache, €-Schritt, Start-Button |
| `ParticipantStepper` | `-` Zahl `+`, min 0, max 50 |
| `RunningView` | TimeDisplay, CostDisplay, TimerControls, Mini-Summary Teilnehmer |
| `TimerControls` | Start/Pause/Resume/Stop je nach phase |
| `TimeDisplay` | `tabular-nums`, große Schrift |
| `CostDisplay` | quantisierter €-Betrag + optional „+X €/min“ klein |
| `LanguageSwitcher` | DE / EN Toggle |

### 3.3 `App.tsx`

- Rendert View basierend auf `session.phase`
- `setup` → SetupView
- `running|paused|stopped_confirm` → RunningView
- `ended` → EndedView (Phase 4, vorher Platzhalter)

### 3.4 Validierung

- Start disabled wenn `sum(participants) === 0`
- Mindestens 1 Teilnehmer insgesamt

### 3.5 Styling

- Mobile-first, Touch-Targets min 44×44 px
- Farben: neutraler Hintergrund, Kosten in warmem Rot/Orange
- `font-variant-numeric: tabular-nums` für Zeit und Geld

## Definition of Done (Phase 3)

- [x] Setup vollständig bedienbar
- [x] Timer startet, pausiert, stoppt (1. Stop)
- [x] DE/EN Umschaltung ändert alle sichtbaren Texte
- [x] €-Schrittweite wirkt auf Anzeige (nicht auf interne Berechnung)
- [x] RTL-Tests für SetupView und Start-Validierung
- [x] `npm run test:ci` grün

## Tests Phase 3

```ts
// src/components/SetupView.test.tsx
// - Start disabled bei 0 Teilnehmern
// - Klick + erhöht Zähler
// - Sprachwechsel ändert Label
```

---

# Phase 4 — Ended-Screen & Kompaktmodus

**Status-Ziel:** `done`  
**Abhängigkeit:** Phase 3

## Aufgaben

### 4.1 `EndedView.tsx`

Inhalt:

- Gesamtdauer (formatiert)
- Gesamtkosten (exakt, nicht quantisiert — 2 Dezimalstellen)
- Headline: „War es das wert?“ / EN „Was it worth it?“
- Button/Link: Meeting-Tipps → `import.meta.env.VITE_TIPS_URL ?? '#'` (neuer Tab)
- Button: „Neues Meeting“ → reset → setup

### 4.2 Doppel-Stop UX

- In `stopped_confirm`: Stop-Button visuell hervorgehoben (z. B. pulsierender Ring oder Farbe)
- Hinweistext unter Controls

### 4.3 Kompaktmodus

- URL-Parameter: `?compact=1` (auch `?view=compact` als Alias)
- Hook `useCompactMode()` liest `URLSearchParams`
- Layout:
  - Nur TimeDisplay + CostDisplay + TimerControls (eine Zeile)
  - Padding minimal (8px)
  - Schriftgrößen so wählen, dass 320×180 px lesbar ist
- Kein Setup im Kompaktmodus? → **Ja, Setup immer normal**; Kompakt nur für running/paused/stopped_confirm. Wenn compact und phase setup → Hinweis „Meeting im Hauptfenster starten“ oder Setup im Kompakt erlauben (einfacher: **Setup auch im Kompakt**, nur dichter)

### 4.4 README ergänzen

Abschnitt „Kompaktfenster für Videokonferenzen“:

```js
// Beispiel für Nutzer
window.open('https://your-domain/?compact=1', 'mct', 'width=340,height=220,resizable=yes');
```

## Definition of Done (Phase 4)

- [x] Zweites Stop zeigt EndedView mit korrekten Finalwerten
- [x] Final-Kosten === letzter berechneter Wert vor ended (Toleranz 0,01 €)
- [x] `?compact=1` funktioniert bei 320px Breite ohne horizontalen Scroll
- [x] E2E-Flow komplett grün

## Tests Phase 4

`e2e/meeting-flow.spec.ts`:

1. Öffne `/`
2. Setze 1× tariff
3. Start → warte 2s → Stop → Stop
4. Erwarte Text „War es das wert?“ (oder EN)
5. Erwarte sichtbare Gesamtkosten

`e2e/compact-mode.spec.ts`:

1. Öffne `/?compact=1`
2. Prüfe dass TimeDisplay sichtbar
3. Viewport 320×200 → kein Overflow

```bash
npx playwright install --with-deps
npm run test:e2e
```

---

# Phase 5 — PWA

**Status-Ziel:** `done`  
**Abhängigkeit:** Phase 4

## Aufgaben

### 5.1 `vite.config.ts` — VitePWA

```ts
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'icons/*.png'],
  manifest: {
    name: 'Meeting Cost Timer',
    short_name: 'MCT',
    description: 'Live meeting personnel cost tracker',
    theme_color: '#0f172a',
    background_color: '#0f172a',
    display: 'standalone',
    start_url: '/',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    navigateFallback: 'index.html',
  },
})
```

### 5.2 Icons

- Generiere oder platziere PNGs in `public/icons/`
- `apple-touch-icon.png` (180×180) in `public/`

### 5.3 `index.html` Meta

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#0f172a" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

### 5.4 Offline-Hinweis

- App muss nach erstem Laden ohne Netz Shell öffnen (Setup/Timer Logik ist clientseitig).

## Definition of Done (Phase 5)

- [x] `npm run build` erzeugt `sw.js` / Workbox-Assets in dist
- [x] Manifest in dist vorhanden
- [x] Lighthouse PWA-Kategorie: installable (Chrome Desktop)
- [x] README: iOS Install-Anleitung + EU-Limitation (iOS 17.4+ EU: kein Standalone)

## Tests Phase 5

- Manuell: `npm run preview` → DevTools → Application → Manifest
- Optional: `npx lighthouse http://localhost:4173 --only-categories=pwa` (Schwellwert dokumentieren)

---

# Phase 6 — Docker & Coolify

**Status-Ziel:** `done`  
**Abhängigkeit:** Phase 5

## Aufgaben

### 6.1 `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_TIPS_URL=
ENV VITE_TIPS_URL=$VITE_TIPS_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1
EXPOSE 80
```

### 6.2 `nginx.conf`

- `gzip on`
- SPA fallback: `try_files $uri $uri/ /index.html`
- Security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Cache: hashed assets `immutable`, `index.html` no-cache

### 6.3 `docker-compose.yaml`

```yaml
services:
  mct:
    build:
      context: .
      args:
        VITE_TIPS_URL: ${VITE_TIPS_URL:-}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

### 6.4 README — Coolify Deploy

Schritte dokumentieren:

1. Neues Projekt in Coolify
2. Build Pack: **Docker Compose**
3. Repository verbinden
4. Compose-Datei: `docker-compose.yaml`
5. Env optional: `VITE_TIPS_URL`
6. Domain + HTTPS

## Definition of Done (Phase 6)

- [x] `docker compose up --build -d` → HTTP 200 auf Port 80
- [x] `curl -f http://localhost/` erfolgreich
- [x] Deep-Link `/?compact=1` liefert SPA (kein 404)
- [x] Healthcheck im Container green

## Tests Phase 6

```bash
docker compose up --build -d
sleep 5
curl -f http://localhost/
docker compose ps  # healthy
docker compose down
```

---

# Phase 7 — Production Readiness & Release

**Status-Ziel:** `done`  
**Abhängigkeit:** Phase 6

## Aufgaben

### 7.1 Disclaimer & Transparenz

- Sichtbarer Hinweis (Footer oder Setup):
  - DE: „Schätzung auf Basis modellierter Arbeitstage (216), 38h/Woche, 30 Urlaubstage, 5 Krankheitstage, 10 Feiertage. Keine exakte Lohnabrechnung.“
  - EN: entsprechend

### 7.2 Accessibility-Audit

- [ ] `aria-live="polite"` auf CostDisplay und TimeDisplay
- [ ] Buttons mit `aria-label`
- [ ] Fokus sichtbar
- [ ] `prefers-reduced-motion`: keine Pulse-Animation

### 7.3 Performance

- [ ] Bundle-Analyse: `npm run build` — JS gzip < 150 KB
- [ ] Keine unnötigen Re-Renders (React DevTools optional)

### 7.4 Cross-Browser Checkliste (manuell)

| Browser | Setup | Timer | Compact | PWA |
|---------|-------|-------|---------|-----|
| Chrome Desktop | | | | |
| Firefox | | | | |
| Safari macOS | | | | |
| Safari iOS | | | | |
| Chrome Android | | | | |

### 7.5 Finale Dokumentation (`README.md`)

Muss enthalten:

- Was ist MCT / wofür
- Kostenformel erklärt
- Nutzung (Setup → Start → Pause → Doppel-Stop)
- Kompaktfenster-Anleitung
- PWA Installation iOS/Android
- Entwicklung (`npm run dev`)
- Docker / Coolify
- Env `VITE_TIPS_URL`
- Lizenz MIT

### 7.6 `.env.example`

```
VITE_TIPS_URL=https://example.com/meeting-tips
```

## Definition of Done (Phase 7) — Production Ready

- [x] Alle Phasen 0–6 Status `done`
- [x] `npm run test:ci` grün
- [x] `npm run test:e2e` grün
- [x] Docker-Build und Healthcheck grün
- [x] README vollständig
- [x] Disclaimer sichtbar
- [x] Keine offenen `TODO`/`FIXME` im Code (außer `VITE_TIPS_URL` Platzhalter-Link ok)
- [x] Status-Tabelle oben: alle `done`

## Release (nur auf Nutzeranweisung)

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Agent-Checkliste am Ende (Copy & Execute)

```bash
# Vollständige Validierung
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
docker compose up --build -d
sleep 8
curl -f http://localhost/
curl -f "http://localhost/?compact=1"
docker compose down
```

Erwartung: alle Befehle Exit Code 0.

---

## Bekannte Plattform-Limitationen (nicht blockierend für v1)

| Thema | Verhalten |
|-------|-----------|
| iOS EU (17.4+) | PWA Standalone eingeschränkt → Nutzer nutzt Browser-Tab/Kompaktfenster |
| Picture-in-Picture | Nur für Video, nicht für HTML-App → Kompaktmodus + kleines Browserfenster |
| Hintergrund-Timer iOS | Kann gedrosselt werden → Visibility-API nutzen; im README erwähnen |
| Kein `beforeinstallprompt` auf iOS | Manuelle Install-Anleitung in README |

---

## Optionale v2-Features (NICHT in v1 umsetzen)

- Anpassbare Gehälter / Arbeitstage im UI
- Export PDF der Meeting-Kosten
- Mehrere Währungen
- Analytics
- Persistenz / Historie

---

*Plan-Version: 1.0 — Erstellt für agentische Umsetzung.*
